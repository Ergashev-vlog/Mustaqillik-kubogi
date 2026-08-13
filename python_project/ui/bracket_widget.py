"""
Bracket Widget for PySide6 PlayOff Manager
Main interactive canvas rendering background, connector lines via QPainter, and 15 MatchWidgets.
"""

from PySide6.QtWidgets import QWidget
from PySide6.QtCore import Qt, Signal
from PySide6.QtGui import QPainter, QPen, QColor, QPixmap
from typing import Dict, Optional
from models.tournament import Tournament
from .match_widget import MatchWidget
from .layout_engine import LayoutEngine


class BracketWidget(QWidget):
    """
    Widget containing the playoff tree layout, custom background image, and QPainter connector lines.
    """
    score_changed = Signal(str, object, object)
    team_name_changed = Signal(str, str)

    def __init__(self, tournament: Tournament, parent=None):
        super().__init__(parent)
        self.tournament = tournament
        self.match_widgets: Dict[str, MatchWidget] = {}
        self.bg_pixmap: Optional[QPixmap] = None
        self.line_color = QColor("#3b82f6")
        self.line_width = 2
        self.setup_ui()

    def setup_ui(self) -> None:
        """Initialize match widgets and place them in the layout."""
        self.setMinimumSize(1280, 720)

        for match_id, match in self.tournament.matches.items():
            widget = MatchWidget(match, self)
            widget.score_changed.connect(self.score_changed.emit)
            widget.team_name_changed.connect(self.team_name_changed.emit)
            self.match_widgets[match_id] = widget

        self.reposition_widgets()

    def update_tournament(self, tournament: Tournament) -> None:
        """Refresh tournament data in all match widgets."""
        self.tournament = tournament
        for match_id, match in tournament.matches.items():
            if match_id in self.match_widgets:
                self.match_widgets[match_id].update_data(match)
        self.update()

    def set_background_image(self, image_path: str) -> None:
        """Set background image and trigger repaint."""
        if image_path:
            self.bg_pixmap = QPixmap(image_path)
        else:
            self.bg_pixmap = None
        self.update()

    def set_line_style(self, color_hex: str, width: int) -> None:
        """Update connector line color and thickness."""
        self.line_color = QColor(color_hex)
        self.line_width = width
        self.update()

    def resizeEvent(self, event) -> None:
        """Recalculate positions when window is resized."""
        super().resizeEvent(event)
        self.reposition_widgets()

    def reposition_widgets(self) -> None:
        """Update match widget positions using LayoutEngine."""
        w, h = self.width(), self.height()
        positions = LayoutEngine.calculate_positions(w, h)

        for match_id, (cx, cy) in positions.items():
            if match_id in self.match_widgets:
                widget = self.match_widgets[match_id]
                x = cx - (widget.width() // 2)
                y = cy - (widget.height() // 2)
                widget.move(x, y)

    def paintEvent(self, event) -> None:
        """Paint custom background image and connector lines."""
        painter = QPainter(self)
        painter.setRenderHint(QPainter.RenderHint.Antialiasing)

        # Draw custom background or default gradient
        if self.bg_pixmap and not self.bg_pixmap.isNull():
            painter.drawPixmap(self.rect(), self.bg_pixmap)
        else:
            painter.fillRect(self.rect(), QColor("#f1f5f9"))

        # Draw connector lines
        pen = QPen(self.line_color, self.line_width)
        painter.setPen(pen)

        w, h = self.width(), self.height()
        positions = LayoutEngine.calculate_positions(w, h)
        connections = LayoutEngine.get_connector_lines(positions)

        for (x1, y1), (x2, y2) in connections:
            # Draw orthogonal elbow lines for clean tournament bracket look
            mid_x = (x1 + x2) // 2
            painter.drawLine(x1, y1, mid_x, y1)
            painter.drawLine(mid_x, y1, mid_x, y2)
            painter.drawLine(mid_x, y2, x2, y2)

        painter.end()
