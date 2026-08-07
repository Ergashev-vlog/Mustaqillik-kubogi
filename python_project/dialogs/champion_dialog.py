"""
Champion Dialog for PySide6 PlayOff Manager
Modal dialog displaying champion celebration with trophy graphic, champion team name, and celebratory styling.
"""

from PySide6.QtWidgets import QDialog, QVBoxLayout, QLabel, QPushButton
from PySide6.QtCore import Qt
from PySide6.QtGui import QFont, QColor
from models.team import Team


class ChampionDialog(QDialog):
    """
    Celebratory dialog opened when the tournament final finishes and a champion is crowned.
    """

    def __init__(self, champion_team: Team, parent=None):
        super().__init__(parent)
        self.champion = champion_team
        self.setup_ui()

    def setup_ui(self) -> None:
        """Initialize champion dialog layout and visuals."""
        self.setWindowTitle("TURNIR CHEMPIONI!")
        self.setFixedSize(450, 360)
        self.setWindowFlags(self.windowFlags() & ~Qt.WindowType.WindowContextHelpButtonHint)

        layout = QVBoxLayout(self)
        layout.setContentsMargins(24, 24, 24, 24)
        layout.setSpacing(16)
        layout.setAlignment(Qt.AlignmentFlag.AlignCenter)

        # Trophy Emoji / Banner
        lbl_trophy = QLabel("🏆")
        lbl_trophy.setAlignment(Qt.AlignmentFlag.AlignCenter)
        lbl_trophy.setFont(QFont("Segoe UI Emoji", 72))
        layout.addWidget(lbl_trophy)

        # Title
        lbl_title = QLabel("TABRIKLAYMIZ!")
        lbl_title.setAlignment(Qt.AlignmentFlag.AlignCenter)
        lbl_title.setFont(QFont("Segoe UI", 18, QFont.Weight.Bold))
        lbl_title.setStyleSheet("color: #d97706;")
        layout.addWidget(lbl_title)

        # Subtitle
        lbl_sub = QLabel("TURBO PLAYOFF KUBOGI GO'LIBI:")
        lbl_sub.setAlignment(Qt.AlignmentFlag.AlignCenter)
        lbl_sub.setFont(QFont("Segoe UI", 11, QFont.Weight.Medium))
        lbl_sub.setStyleSheet("color: #64748b;")
        layout.addWidget(lbl_sub)

        # Champion Name
        lbl_name = QLabel(self.champion.name.upper() if self.champion else "CHEMPION")
        lbl_name.setAlignment(Qt.AlignmentFlag.AlignCenter)
        lbl_name.setFont(QFont("Segoe UI", 24, QFont.Weight.ExtraBold))
        lbl_name.setStyleSheet("color: #16a34a; background-color: #f0fdf4; border: 2px solid #22c55e; border-radius: 12px; padding: 12px;")
        layout.addWidget(lbl_name)

        # Close Button
        btn_close = QPushButton("Yopish")
        btn_close.setFixedHeight(40)
        btn_close.setFont(QFont("Segoe UI", 11, QFont.Weight.Bold))
        btn_close.setStyleSheet("""
            QPushButton {
                background-color: #2563eb;
                color: white;
                border-radius: 8px;
            }
            QPushButton:hover {
                background-color: #1d4ed8;
            }
        """)
        btn_close.clicked.connect(self.accept)
        layout.addWidget(btn_close)

        self.setStyleSheet("QDialog { background-color: #ffffff; }")
