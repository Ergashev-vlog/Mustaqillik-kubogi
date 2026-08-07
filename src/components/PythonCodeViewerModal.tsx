import React, { useState } from 'react';
import { X, Copy, Check, Code, FileCode, Terminal, Download } from 'lucide-react';

interface PythonCodeViewerModalProps {
  onClose: () => void;
}

const PYTHON_FILES: Record<string, string> = {
  'main.py': `"""
PlayOff Manager - Main Entry Point
Launches the PySide6 Qt Application.
"""

import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from PySide6.QtWidgets import QApplication
from ui.main_window import MainWindow


def main():
    app = QApplication(sys.argv)
    app.setApplicationName("PlayOff Manager")
    app.setOrganizationName("PlayOff Software")

    window = MainWindow()
    window.show()

    sys.exit(app.exec())


if __name__ == "__main__":
    main()`,

  'models/team.py': `"""
Team Model for PlayOff Manager
"""

from dataclasses import dataclass
from typing import Optional, Dict, Any


@dataclass
class Team:
    id: str
    name: str
    logo_path: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "name": self.name,
            "logo_path": self.logo_path
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "Team":
        return cls(
            id=data.get("id", ""),
            name=data.get("name", "Noma'lum Jamoa"),
            logo_path=data.get("logo_path")
        )`,

  'models/match.py': `"""
Match Model for PlayOff Manager
"""

from typing import Optional, Dict, Any
from .team import Team


class Match:
    def __init__(
        self,
        match_id: str,
        round_id: str,
        match_number: int,
        bracket_side: str,
        team1: Optional[Team] = None,
        team2: Optional[Team] = None,
        score1: Optional[int] = None,
        score2: Optional[int] = None,
        winner_id: Optional[str] = None,
        next_match_id: Optional[str] = None,
        next_match_slot: Optional[int] = None
    ):
        self.id = match_id
        self.round_id = round_id
        self.match_number = match_number
        self.bracket_side = bracket_side
        self.team1 = team1
        self.team2 = team2
        self.score1 = score1
        self.score2 = score2
        self.winner_id = winner_id
        self.next_match_id = next_match_id
        self.next_match_slot = next_match_slot

    def evaluate_winner(self) -> Optional[Team]:
        if self.score1 is None or self.score2 is None:
            self.winner_id = None
            return None

        if self.score1 > self.score2:
            self.winner_id = self.team1.id if self.team1 else None
            return self.team1
        elif self.score2 > self.score1:
            self.winner_id = self.team2.id if self.team2 else None
            return self.team2
        else:
            self.winner_id = None
            return None

    def reset_scores(self) -> None:
        self.score1 = None
        self.score2 = None
        self.winner_id = None`,

  'models/tournament.py': `"""
Tournament Model for PlayOff Manager
Manages the complete 16-team bracket lifecycle, auto-advancement, and cascading recursive reset.
"""

from typing import Dict, List, Optional, Any
from .team import Team
from .match import Match


class Tournament:
    def __init__(self, name: str = "PlayOff Manager Tournament", team_names: Optional[List[str]] = None):
        self.name = name
        self.matches: Dict[str, Match] = {}
        self.champion_id: Optional[str] = None
        self.initialize_bracket(team_names or [])

    def cascade_clear_downstream(self, match_id: str) -> None:
        current_match = self.matches.get(match_id)
        if not current_match or not current_match.next_match_id:
            return

        next_match = self.matches.get(current_match.next_match_id)
        if not next_match:
            return

        if current_match.next_match_slot == 1:
            next_match.team1 = None
        elif current_match.next_match_slot == 2:
            next_match.team2 = None

        had_progress = next_match.score1 is not None or next_match.score2 is not None or next_match.winner_id is not None
        next_match.reset_scores()

        if had_progress:
            self.cascade_clear_downstream(next_match.id)`,

  'ui/main_window.py': `"""
Main Window for PySide6 PlayOff Manager
"""

from PySide6.QtWidgets import QMainWindow, QToolBar, QFileDialog, QMessageBox, QScrollArea
from PySide6.QtCore import Qt
from PySide6.QtGui import QAction, QKeySequence
import copy

from models.tournament import Tournament
from .bracket_widget import BracketWidget
from dialogs.champion_dialog import ChampionDialog
from services.storage import StorageService


class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.tournament = Tournament(name="PlayOff Manager Tournament")
        self.setup_ui()`,

  'ui/bracket_widget.py': `"""
Bracket Widget for PySide6 PlayOff Manager
"""

from PySide6.QtWidgets import QWidget
from PySide6.QtCore import Qt, Signal
from PySide6.QtGui import QPainter, QPen, QColor, QPixmap
from models.tournament import Tournament
from .match_widget import MatchWidget
from .layout_engine import LayoutEngine


class BracketWidget(QWidget):
    score_changed = Signal(str, object, object)
    team_name_changed = Signal(str, str)

    def __init__(self, tournament: Tournament, parent=None):
        super().__init__(parent)
        self.tournament = tournament
        self.setup_ui()`,

  'ui/match_widget.py': `"""
Match Widget for PySide6 PlayOff Manager
"""

from PySide6.QtWidgets import QFrame, QVBoxLayout, QHBoxLayout, QLabel, QLineEdit
from PySide6.QtCore import Qt, Signal
from PySide6.QtGui import QIntValidator, QFont
from models.match import Match


class MatchWidget(QFrame):
    score_changed = Signal(str, object, object)
    team_name_changed = Signal(str, str)

    def __init__(self, match: Match, parent=None):
        super().__init__(parent)
        self.match = match
        self.setup_ui()`,

  'ui/layout_engine.py': `"""
Layout Engine for PlayOff Manager
Calculates responsive coordinates and connector line paths.
"""

class LayoutEngine:
    CARD_WIDTH = 210
    CARD_HEIGHT = 115
    ROUND_GAP = 50

    @classmethod
    def calculate_positions(cls, total_width: int, total_height: int):
        # Calculates center coordinates for 15 matches across 7 columns
        pass`,

  'dialogs/champion_dialog.py': `"""
Champion Dialog for PySide6 PlayOff Manager
"""

from PySide6.QtWidgets import QDialog, QVBoxLayout, QLabel, QPushButton
from PySide6.QtCore import Qt
from PySide6.QtGui import QFont


class ChampionDialog(QDialog):
    def __init__(self, champion_team, parent=None):
        super().__init__(parent)
        self.champion = champion_team
        self.setup_ui()`,

  'dialogs/settings_dialog.py': `"""
Settings Dialog for PySide6 PlayOff Manager
"""

from PySide6.QtWidgets import QDialog, QFormLayout, QLineEdit, QPushButton


class SettingsDialog(QDialog):
    def __init__(self, current_settings: dict, parent=None):
        super().__init__(parent)
        self.settings = current_settings.copy()
        self.setup_ui()`,

  'services/storage.py': `"""
Storage Service for PlayOff Manager
"""

import json
from models.tournament import Tournament


class StorageService:
    @staticmethod
    def save_tournament(tournament: Tournament, file_path: str) -> bool:
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(tournament.to_dict(), f, ensure_ascii=False, indent=2)
        return True`,

  'services/export_png.py': `"""
PNG Export Service
"""

from PySide6.QtGui import QPixmap


class ExportPNGService:
    @staticmethod
    def export(widget, file_path: str, dpi: int = 300) -> bool:
        pixmap = QPixmap(widget.size())
        widget.render(pixmap)
        return pixmap.save(file_path, "PNG")`,

  'services/export_pdf.py': `"""
PDF Export Service
"""

from PySide6.QtPrintSupport import QPrinter
from PySide6.QtGui import QPainter


class ExportPDFService:
    @staticmethod
    def export(widget, file_path: str) -> bool:
        printer = QPrinter(QPrinter.PrinterMode.HighResolution)
        printer.setOutputFormat(QPrinter.OutputFormat.PdfFormat)
        printer.setOutputFileName(file_path)
        painter = QPainter(printer)
        widget.render(painter)
        painter.end()
        return True`,

  'services/screenshot.py': `"""
Screenshot Service
"""

from PySide6.QtWidgets import QWidget


class ScreenshotService:
    @staticmethod
    def capture_widget(widget: QWidget, file_path: str) -> bool:
        pixmap = widget.grab()
        return pixmap.save(file_path, "PNG")`
};

export const PythonCodeViewerModal: React.FC<PythonCodeViewerModalProps> = ({ onClose }) => {
  const [selectedFile, setSelectedFile] = useState<string>('main.py');
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(PYTHON_FILES[selectedFile]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-5xl w-full h-[85vh] shadow-2xl flex flex-col overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-blue-600/20 rounded-lg text-blue-400 border border-blue-500/30">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm">Python PySide6 Desktop Loyihasi Manba Kodlari</h3>
              <p className="text-[11px] text-slate-400">PEP8 Standarti • MVC Arxitekturasi • Windows 11 PySide6 GUI</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow transition"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Nusxalandi!' : 'Kodni Nusxalash'}</span>
            </button>
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Workspace Layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left File Tree Sidebar */}
          <div className="w-60 bg-slate-950 border-r border-slate-800 p-2 overflow-y-auto space-y-1 text-xs select-none">
            <div className="px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
              LOYIHA FAYLLARI (.PY)
            </div>
            {Object.keys(PYTHON_FILES).map((fileName) => (
              <button
                key={fileName}
                onClick={() => setSelectedFile(fileName)}
                className={`w-full text-left px-2.5 py-1.5 rounded-md flex items-center gap-2 transition ${
                  selectedFile === fileName
                    ? 'bg-blue-600/30 text-blue-300 font-semibold border border-blue-500/40'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <FileCode className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                <span className="truncate font-mono">{fileName}</span>
              </button>
            ))}

            <div className="pt-4 border-t border-slate-800/80 px-2 space-y-2 text-[11px] text-slate-400">
              <p className="font-semibold text-slate-300 flex items-center gap-1">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" /> Windows'da ishga tushirish:
              </p>
              <pre className="bg-slate-900 p-2 rounded border border-slate-800 text-[10px] font-mono text-emerald-400 select-all overflow-x-auto">
                pip install PySide6 reportlab{"\n"}
                python main.py
              </pre>
            </div>
          </div>

          {/* Right Code Content View */}
          <div className="flex-1 bg-slate-950 p-4 overflow-auto font-mono text-xs text-slate-200 leading-relaxed">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800 text-slate-400 text-[11px]">
              <span className="font-bold text-slate-200 flex items-center gap-2">
                <FileCode className="w-4 h-4 text-blue-400" /> {selectedFile}
              </span>
              <span>Python 3.13 / PySide6</span>
            </div>
            <pre className="whitespace-pre overflow-x-auto text-emerald-300/90 font-mono">
              {PYTHON_FILES[selectedFile]}
            </pre>
          </div>
        </div>

      </div>
    </div>
  );
};
