"""
Settings Dialog for PySide6 PlayOff Manager
Allows users to customize tournament title, background image, line colors, winner/loser highlight colors.
"""

from PySide6.QtWidgets import (
    QDialog, QVBoxLayout, QHBoxLayout, QLabel, QLineEdit,
    QPushButton, QFileDialog, QColorDialog, QFormLayout
)
from PySide6.QtCore import Qt
from PySide6.QtGui import QColor, QFont


class SettingsDialog(QDialog):
    """
    Settings dialog for configuring bracket appearance and tournament parameters.
    """

    def __init__(self, current_settings: dict, parent=None):
        super().__init__(parent)
        self.settings = current_settings.copy()
        self.setup_ui()

    def setup_ui(self) -> None:
        """Initialize form controls."""
        self.setWindowTitle("Sozlamalar")
        self.setFixedSize(450, 380)

        layout = QVBoxLayout(self)
        layout.setContentsMargins(20, 20, 20, 20)
        layout.setSpacing(16)

        form = QFormLayout()
        form.setSpacing(12)

        # Tournament Title
        self.input_name = QLineEdit(self.settings.get("name", "PlayOff Manager Tournament"))
        form.addRow("Turnir Nomi:", self.input_name)

        # Background Image Path
        bg_layout = QHBoxLayout()
        self.input_bg = QLineEdit(self.settings.get("bg_path", ""))
        btn_browse_bg = QPushButton("Tanlash...")
        btn_browse_bg.clicked.connect(self.browse_background)
        bg_layout.addWidget(self.input_bg)
        bg_layout.addWidget(btn_browse_bg)
        form.addRow("Fon Rasmi:", bg_layout)

        # Line Color
        self.btn_line_color = QPushButton("Chiziq Rangi")
        self.btn_line_color.clicked.connect(lambda: self.pick_color("line_color"))
        form.addRow("Liniya Rangi:", self.btn_line_color)

        # Winner Color
        self.btn_winner_color = QPushButton("G'olib Rangi")
        self.btn_winner_color.clicked.connect(lambda: self.pick_color("winner_color"))
        form.addRow("G'olib Rangi:", self.btn_winner_color)

        # Loser Color
        self.btn_loser_color = QPushButton("Mag'lub Rangi")
        self.btn_loser_color.clicked.connect(lambda: self.pick_color("loser_color"))
        form.addRow("Mag'lub Rangi:", self.btn_loser_color)

        layout.addLayout(form)

        # Action Buttons
        btn_layout = QHBoxLayout()
        btn_save = QPushButton("Saqlash")
        btn_save.setStyleSheet("background-color: #2563eb; color: white; padding: 8px; border-radius: 6px;")
        btn_save.clicked.connect(self.save)

        btn_cancel = QPushButton("Bekor qilish")
        btn_cancel.setStyleSheet("background-color: #94a3b8; color: white; padding: 8px; border-radius: 6px;")
        btn_cancel.clicked.connect(self.reject)

        btn_layout.addWidget(btn_save)
        btn_layout.addWidget(btn_cancel)
        layout.addLayout(btn_layout)

    def browse_background(self) -> None:
        """Browse file dialog for background image."""
        file_path, _ = QFileDialog.getOpenFileName(
            self, "Fon Rasmini Tanlang", "", "Images (*.png *.jpg *.jpeg *.bmp)"
        )
        if file_path:
            self.input_bg.setText(file_path)

    def pick_color(self, key: str) -> None:
        """Pick a color using QColorDialog."""
        default_hex = self.settings.get(key, "#3b82f6")
        color = QColorDialog.getColor(QColor(default_hex), self, "Rang Tanlang")
        if color.isValid():
            self.settings[key] = color.name()

    def save(self) -> None:
        """Save settings and close dialog."""
        self.settings["name"] = self.input_name.text().strip()
        self.settings["bg_path"] = self.input_bg.text().strip()
        self.accept()
