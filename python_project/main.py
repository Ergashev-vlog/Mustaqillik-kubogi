"""
PlayOff Manager - Main Entry Point
Launches the PySide6 Qt Application.
"""

import sys
import os

# Add python_project directory to sys.path so modules import seamlessly
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from PySide6.QtWidgets import QApplication
from ui.main_window import MainWindow


def main():
    """Application entry point function."""
    app = QApplication(sys.argv)
    app.setApplicationName("PlayOff Manager")
    app.setOrganizationName("PlayOff Software")

    window = MainWindow()
    window.show()

    sys.exit(app.exec())


if __name__ == "__main__":
    main()
