"""
PDF Export Service for PlayOff Manager
Renders the playoff bracket onto an A4 Landscape PDF at 300 DPI using ReportLab / PySide6 QPrinter.
"""

from PySide6.QtWidgets import QWidget
from PySide6.QtGui import QPainter, QPageLayout, QPageSize
from PySide6.QtPrintSupport import QPrinter


class ExportPDFService:
    """
    Service for generating high-quality A4 Landscape PDF reports.
    """

    @staticmethod
    def export(widget: QWidget, file_path: str) -> bool:
        """
        Renders widget onto A4 Landscape PDF document.
        """
        try:
            printer = QPrinter(QPrinter.PrinterMode.HighResolution)
            printer.setOutputFormat(QPrinter.OutputFormat.PdfFormat)
            printer.setOutputFileName(file_path)

            # Set A4 Landscape orientation
            page_layout = QPageLayout(
                QPageSize(QPageSize.PageSizeId.A4),
                QPageLayout.Orientation.Landscape,
                QPageLayout.Unit.Millimeter
            )
            printer.setPageLayout(page_layout)

            painter = QPainter(printer)
            
            # Calculate scale to fit widget into A4 printable page rectangle
            rect = printer.pageRect(QPrinter.Unit.DevicePixel)
            x_scale = rect.width() / widget.width()
            y_scale = rect.height() / widget.height()
            scale = min(x_scale, y_scale)

            painter.scale(scale, scale)
            widget.render(painter)
            painter.end()

            return True
        except Exception as e:
            print(f"PDF Export failed: {e}")
            return False
