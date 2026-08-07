"""
Main Window for PySide6 PlayOff Manager
Primary application window integrating menus, toolbars, bracket canvas, undo/redo stack, and dialog triggers.
"""

from PySide6.QtWidgets import (
    QMainWindow, QToolBar, QFileDialog, QMessageBox, QScrollArea
)
from PySide6.QtCore import Qt
from PySide6.QtGui import QAction, QKeySequence, QIcon
import copy

from models.tournament import Tournament, DEFAULT_TEAMS
from .bracket_widget import BracketWidget
from dialogs.champion_dialog import ChampionDialog
from dialogs.settings_dialog import SettingsDialog
from services.storage import StorageService
from services.export_png import ExportPNGService
from services.export_pdf import ExportPDFService
from services.screenshot import ScreenshotService


class MainWindow(QMainWindow):
    """
    Main PySide6 application window for PlayOff Manager.
    """

    def __init__(self):
        super().__init__()
        self.tournament = Tournament(name="PlayOff Manager Tournament", team_names=DEFAULT_TEAMS)
        
        # Undo / Redo history stacks
        self.undo_stack = []
        self.redo_stack = []
        
        self.settings = {
            "name": self.tournament.name,
            "bg_path": "",
            "line_color": "#3b82f6",
            "winner_color": "#22c55e",
            "loser_color": "#ef4444"
        }

        self.setup_ui()
        self.save_history_snapshot()

    def setup_ui(self) -> None:
        """Configure main window layout, menus, toolbars, and central widget."""
        self.setWindowTitle("PlayOff Manager - Professional Football Tournament")
        self.resize(1600, 900)

        # Central Scroll Area containing Bracket Canvas
        self.bracket_widget = BracketWidget(self.tournament, self)
        self.bracket_widget.score_changed.connect(self.on_score_changed)
        self.bracket_widget.team_name_changed.connect(self.on_team_name_changed)

        scroll_area = QScrollArea(self)
        scroll_area.setWidget(self.bracket_widget)
        scroll_area.setWidgetResizable(True)
        scroll_area.setAlignment(Qt.AlignmentFlag.AlignCenter)
        self.setCentralWidget(scroll_area)

        self.create_menu_bar()
        self.create_tool_bar()

    def create_menu_bar(self) -> None:
        """Construct application menu bar."""
        menu_bar = self.menuBar()

        # --- FILE MENU ---
        file_menu = menu_bar.addMenu("Fayl")

        act_new = QAction("Yangi Turnir", self)
        act_new.setShortcut(QKeySequence("Ctrl+N"))
        act_new.triggered.connect(self.new_tournament)
        file_menu.addAction(act_new)

        act_open = QAction("Ochish...", self)
        act_open.setShortcut(QKeySequence("Ctrl+O"))
        act_open.triggered.connect(self.open_tournament)
        file_menu.addAction(act_open)

        act_save = QAction("Saqlash", self)
        act_save.setShortcut(QKeySequence("Ctrl+S"))
        act_save.triggered.connect(self.save_tournament)
        file_menu.addAction(act_save)

        file_menu.addSeparator()

        act_png = QAction("PNG Eksport...", self)
        act_png.triggered.connect(self.export_png)
        file_menu.addAction(act_png)

        act_pdf = QAction("PDF Eksport...", self)
        act_pdf.triggered.connect(self.export_pdf)
        file_menu.addAction(act_pdf)

        file_menu.addSeparator()

        act_exit = QAction("Chiqish", self)
        act_exit.triggered.connect(self.close)
        file_menu.addAction(act_exit)

        # --- EDIT MENU (Undo/Redo) ---
        edit_menu = menu_bar.addMenu("Tahrirlash")

        act_undo = QAction("Bekor qilish (Undo)", self)
        act_undo.setShortcut(QKeySequence("Ctrl+Z"))
        act_undo.triggered.connect(self.undo)
        edit_menu.addAction(act_undo)

        act_redo = QAction("Qaytarish (Redo)", self)
        act_redo.setShortcut(QKeySequence("Ctrl+Y"))
        act_redo.triggered.connect(self.redo)
        edit_menu.addAction(act_redo)

        # --- SETTINGS MENU ---
        settings_menu = menu_bar.addMenu("Sozlamalar")
        
        act_settings = QAction("Sozlamalar paneli...", self)
        act_settings.triggered.connect(self.open_settings)
        settings_menu.addAction(act_settings)

        # --- HELP MENU ---
        help_menu = menu_bar.addMenu("Yordam")
        
        act_about = QAction("Dastur haqida", self)
        act_about.triggered.connect(self.show_about)
        help_menu.addAction(act_about)

    def create_tool_bar(self) -> None:
        """Construct quick action tool bar."""
        tb = QToolBar("Asosiy Uskunalar", self)
        tb.setMovable(False)
        self.addToolBar(tb)

        tb.addAction("Yangi Turnir", self.new_tournament)
        tb.addAction("Ochish", self.open_tournament)
        tb.addAction("Saqlash", self.save_tournament)
        tb.addSeparator()
        tb.addAction("PNG Eksport", self.export_png)
        tb.addAction("PDF Eksport", self.export_pdf)
        tb.addAction("Skrinshot", self.take_screenshot)
        tb.addSeparator()
        tb.addAction("Sozlamalar", self.open_settings)

    def save_history_snapshot(self) -> None:
        """Push current state onto undo stack and clear redo stack."""
        snapshot = copy.deepcopy(self.tournament)
        self.undo_stack.append(snapshot)
        self.redo_stack.clear()

    def undo(self) -> None:
        """Revert to previous state in history stack."""
        if len(self.undo_stack) > 1:
            current = self.undo_stack.pop()
            self.redo_stack.append(current)
            prev_state = self.undo_stack[-1]
            self.tournament = copy.deepcopy(prev_state)
            self.bracket_widget.update_tournament(self.tournament)

    def redo(self) -> None:
        """Re-apply state from redo stack."""
        if self.redo_stack:
            state = self.redo_stack.pop()
            self.undo_stack.append(state)
            self.tournament = copy.deepcopy(state)
            self.bracket_widget.update_tournament(self.tournament)

    def on_score_changed(self, match_id: str, s1, s2) -> None:
        """Handle score update event from MatchWidget."""
        prev_champ = self.tournament.champion_id
        updated = self.tournament.update_match_score(match_id, s1, s2)

        if updated:
            self.bracket_widget.update_tournament(self.tournament)
            self.save_history_snapshot()

            # Check if Champion was crowned
            if not prev_champ and self.tournament.champion_id:
                final_match = self.tournament.matches.get("FINAL")
                if final_match:
                    winning_team = final_match.team1 if final_match.winner_id == final_match.team1.id else final_match.team2
                    if winning_team:
                        dlg = ChampionDialog(winning_team, self)
                        dlg.exec()

    def on_team_name_changed(self, team_id: str, new_name: str) -> None:
        """Handle team name change event."""
        self.tournament.update_team_name(team_id, new_name)
        self.bracket_widget.update_tournament(self.tournament)
        self.save_history_snapshot()

    def new_tournament(self) -> None:
        """Create a fresh new tournament."""
        self.tournament = Tournament(name="Yangi Turnir", team_names=DEFAULT_TEAMS)
        self.bracket_widget.update_tournament(self.tournament)
        self.save_history_snapshot()

    def open_tournament(self) -> None:
        """Open tournament from JSON file."""
        file_path, _ = QFileDialog.getOpenFileName(self, "Turnirni Ochish", "", "JSON Files (*.json)")
        if file_path:
            tour = StorageService.load_tournament(file_path)
            if tour:
                self.tournament = tour
                self.bracket_widget.update_tournament(self.tournament)
                self.save_history_snapshot()
            else:
                QMessageBox.critical(self, "Xatolik", "JSON faylini o'qishda xatolik yuz berdi!")

    def save_tournament(self) -> None:
        """Save tournament to JSON file."""
        file_path, _ = QFileDialog.getSaveFileName(self, "Turnirni Saqlash", "tournament.json", "JSON Files (*.json)")
        if file_path:
            if StorageService.save_tournament(self.tournament, file_path):
                QMessageBox.information(self, "Muvaffaqiyat", "Turnir saqlandi!")
            else:
                QMessageBox.critical(self, "Xatolik", "Turnirni saqlashda xatolik yuz berdi!")

    def export_png(self) -> None:
        """Export bracket to high DPI PNG."""
        file_path, _ = QFileDialog.getSaveFileName(self, "PNG Sifatida Eksport Qilish", "playoff_bracket.png", "PNG Images (*.png)")
        if file_path:
            if ExportPNGService.export(self.bracket_widget, file_path):
                QMessageBox.information(self, "Muvaffaqiyat", "PNG fayl muvaffaqiyatli saqlandi!")

    def export_pdf(self) -> None:
        """Export bracket to A4 Landscape PDF."""
        file_path, _ = QFileDialog.getSaveFileName(self, "PDF Sifatida Eksport Qilish", "playoff_bracket.pdf", "PDF Documents (*.pdf)")
        if file_path:
            if ExportPDFService.export(self.bracket_widget, file_path):
                QMessageBox.information(self, "Muvaffaqiyat", "PDF fayl muvaffaqiyatli saqlandi!")

    def take_screenshot(self) -> None:
        """Take instant screenshot of bracket canvas."""
        file_path, _ = QFileDialog.getSaveFileName(self, "Skrinshot Saqlash", "screenshot.png", "PNG Images (*.png)")
        if file_path:
            if ScreenshotService.capture_widget(self.bracket_widget, file_path):
                QMessageBox.information(self, "Muvaffaqiyat", "Skrinshot saqlandi!")

    def open_settings(self) -> None:
        """Open settings dialog."""
        dlg = SettingsDialog(self.settings, self)
        if dlg.exec():
            self.settings = dlg.settings
            self.tournament.name = self.settings.get("name", self.tournament.name)
            self.bracket_widget.set_background_image(self.settings.get("bg_path", ""))
            self.bracket_widget.set_line_style(self.settings.get("line_color", "#3b82f6"), 2)

    def show_about(self) -> None:
        """Show About PlayOff Manager dialog."""
        QMessageBox.about(
            self,
            "PlayOff Manager Haqida",
            "<b>PlayOff Manager v1.0</b><br>"
            "Professional futbol Play-Off bosqichlarini boshqarish dasturi.<br>"
            "Python 3.13 & PySide6 yordamida yaratilgan."
        )
