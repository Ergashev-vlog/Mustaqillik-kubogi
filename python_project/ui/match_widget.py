"""
Match Widget for PySide6 PlayOff Manager
Individual card widget for displaying a match with team names, integer score inputs, and winner/loser status styling.
"""

from PySide6.QtWidgets import (
    QFrame, QVBoxLayout, QHBoxLayout, QLabel, QLineEdit, QInputDialog
)
from PySide6.QtCore import Qt, Signal
from PySide6.QtGui import QIntValidator, QFont
from typing import Optional
from models.match import Match


class MatchWidget(QFrame):
    """
    Custom widget representing a single playoff match.
    Emits signals when scores or team names are edited.
    """
    score_changed = Signal(str, object, object)  # match_id, score1, score2
    team_name_changed = Signal(str, str)         # team_id, new_name

    def __init__(self, match: Match, parent=None):
        super().__init__(parent)
        self.match = match
        self.setObjectName("MatchWidget")
        self.setup_ui()
        self.update_data(match)

    def setup_ui(self) -> None:
        """Initialize UI controls and layout."""
        self.setFixedWidth(210)
        self.setFixedHeight(115)
        
        main_layout = QVBoxLayout(self)
        main_layout.setContentsMargins(8, 6, 8, 6)
        main_layout.setSpacing(4)

        # Round Header Label
        self.lbl_round = QLabel(f"O'yin {self.match.match_number} ({self.match.round_id})")
        self.lbl_round.setAlignment(Qt.AlignmentFlag.AlignCenter)
        self.lbl_round.setStyleSheet("font-size: 11px; font-weight: bold; color: #64748b;")
        main_layout.addWidget(self.lbl_round)

        # Team 1 Row
        t1_layout = QHBoxLayout()
        t1_layout.setSpacing(6)
        self.lbl_team1 = QLabel("---")
        self.lbl_team1.setFont(QFont("Segoe UI", 10, QFont.Weight.Medium))
        self.lbl_team1.setCursor(Qt.CursorShape.PointingHandCursor)
        self.lbl_team1.mouseDoubleClickEvent = lambda e: self.on_team_double_click(self.match.team1)

        self.input_score1 = QLineEdit()
        self.input_score1.setFixedWidth(32)
        self.input_score1.setAlignment(Qt.AlignmentFlag.AlignCenter)
        self.input_score1.setValidator(QIntValidator(0, 99))
        self.input_score1.textChanged.connect(self.on_score_changed)

        t1_layout.addWidget(self.lbl_team1, 1)
        t1_layout.addWidget(self.input_score1)
        main_layout.addLayout(t1_layout)

        # Team 2 Row
        t2_layout = QHBoxLayout()
        t2_layout.setSpacing(6)
        self.lbl_team2 = QLabel("---")
        self.lbl_team2.setFont(QFont("Segoe UI", 10, QFont.Weight.Medium))
        self.lbl_team2.setCursor(Qt.CursorShape.PointingHandCursor)
        self.lbl_team2.mouseDoubleClickEvent = lambda e: self.on_team_double_click(self.match.team2)

        self.input_score2 = QLineEdit()
        self.input_score2.setFixedWidth(32)
        self.input_score2.setAlignment(Qt.AlignmentFlag.AlignCenter)
        self.input_score2.setValidator(QIntValidator(0, 99))
        self.input_score2.textChanged.connect(self.on_score_changed)

        t2_layout.addWidget(self.lbl_team2, 1)
        t2_layout.addWidget(self.input_score2)
        main_layout.addLayout(t2_layout)

        self.apply_style("default")

    def update_data(self, match: Match) -> None:
        """Refresh displayed team names, scores, and winner/loser styles."""
        self.match = match
        self.input_score1.blockSignals(True)
        self.input_score2.blockSignals(True)

        self.lbl_team1.setText(match.team1.name if match.team1 else "---")
        self.lbl_team2.setText(match.team2.name if match.team2 else "---")

        self.input_score1.setText(str(match.score1) if match.score1 is not None else "")
        self.input_score2.setText(str(match.score2) if match.score2 is not None else "")

        # Enable score entry only if both teams are present
        has_both_teams = match.team1 is not None and match.team2 is not None
        self.input_score1.setEnabled(has_both_teams)
        self.input_score2.setEnabled(has_both_teams)

        self.input_score1.blockSignals(False)
        self.input_score2.blockSignals(False)

        # Update style according to winner/loser status
        if match.score1 is not None and match.score2 is not None:
            if match.score1 > match.score2:
                self.apply_style("t1_winner")
            elif match.score2 > match.score1:
                self.apply_style("t2_winner")
            else:
                self.apply_style("draw")
        else:
            self.apply_style("default")

    def apply_style(self, state: str) -> None:
        """Apply CSS styling to match widget based on match state."""
        base_css = """
            MatchWidget {
                background-color: rgba(255, 255, 255, 0.92);
                border-radius: 10px;
                border: 2px solid #cbd5e1;
            }
            QLineEdit {
                border: 1px solid #94a3b8;
                border-radius: 4px;
                padding: 2px;
                background-color: #f8fafc;
                font-weight: bold;
            }
        """
        if state == "t1_winner":
            css = base_css + """
                MatchWidget { border-color: #22c55e; background-color: #f0fdf4; }
                QLabel { color: #0f172a; }
            """
        elif state == "t2_winner":
            css = base_css + """
                MatchWidget { border-color: #22c55e; background-color: #f0fdf4; }
                QLabel { color: #0f172a; }
            """
        elif state == "draw":
            css = base_css + """
                MatchWidget { border-color: #eab308; background-color: #fefce8; }
            """
        else:
            css = base_css

        self.setStyleSheet(css)

    def on_score_changed(self) -> None:
        """Handle score text change events."""
        t1_str = self.input_score1.text().strip()
        t2_str = self.input_score2.text().strip()

        s1 = int(t1_str) if t1_str.isdigit() else None
        s2 = int(t2_str) if t2_str.isdigit() else None

        self.score_changed.emit(self.match.id, s1, s2)

    def on_team_double_click(self, team) -> None:
        """Allow editing team name on double click in 1/16 stage."""
        if not team or self.match.round_id != "1/16":
            return

        new_name, ok = QInputDialog.getText(
            self,
            "Jamoa Nomini Tahrirlash",
            "Yangi jamoa nomini kiriting:",
            text=team.name
        )
        if ok and new_name.strip():
            self.team_name_changed.emit(team.id, new_name.strip())
