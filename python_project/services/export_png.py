"""
PNG Export Service for PlayOff Manager
Renders the playoff bracket widget at 300 DPI high resolution and saves it as a PNG image.
"""

from PySide6.QtWidgets import QWidget
from PySide6.QtGui import QPixmap
from PySide6.QtCore import QSize


class ExportPNGService:
    """
    Exports widget canvas to high-DPI PNG image file.
    """

    @staticmethod
    def export(widget: QWidget, file_path: str, dpi: int = 300) -> bool:
        """
        Renders the target widget into a high-DPI QPixmap and saves as PNG.
        """
        try:
            # Scale up for high resolution output
            scale_factor = dpi / 96.0
            target_size = QSize(
                int(widget.width() * scale_factor),
                int(widget.height() * scale_factor)
            )

            pixmap = QPixmap(target_size)
            pixmap.setDevicePixelRatio(scale_factor)
            widget.render(pixmap)

            return pixmap.save(file_path, "PNG")
        except Exception as e:
            print(f"Failed to export PNG: {e}")
            return False
