"""
Screenshot Service for PlayOff Manager
Captures the main window or canvas area directly and saves it as a high resolution PNG image.
"""

from PySide6.QtWidgets import QWidget
from PySide6.QtGui import QScreen, QPixmap
from PySide6.QtCore import QRect


class ScreenshotService:
    """
    Captures screenshots of target widget or full screen.
    """

    @staticmethod
    def capture_widget(widget: QWidget, file_path: str) -> bool:
        """
        Grabs screen grab of a specific widget and writes to disk.
        """
        try:
            screen: QScreen = widget.screen()
            if not screen:
                return False

            pixmap: QPixmap = widget.grab()
            return pixmap.save(file_path, "PNG")
        except Exception as e:
            print(f"Screenshot capture failed: {e}")
            return False
