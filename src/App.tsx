import React, { useState, useEffect, useRef } from 'react';
import { 
  TournamentState, HistoryState, TournamentSettings 
} from './types/tournament';
import { 
  createInitialTournament, updateMatchScore, updateTeamName, getChampionTeam, DEFAULT_SETTINGS 
} from './utils/tournamentEngine';

import { Navbar } from './components/Navbar';
import { Toolbar } from './components/Toolbar';
import { BracketView } from './components/BracketView';
import { StatusBar } from './components/StatusBar';

import { AboutModal } from './components/AboutModal';
import { HelpModal } from './components/HelpModal';
import { SettingsModal } from './components/SettingsModal';
import { ChampionModal } from './components/ChampionModal';
import { PythonCodeViewerModal } from './components/PythonCodeViewerModal';

import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export default function App() {
  const [history, setHistory] = useState<HistoryState>(() => {
    const initial = createInitialTournament();
    return {
      past: [],
      present: initial,
      future: [],
    };
  });

  const [zoom, setZoom] = useState<number>(1);
  const [activeModal, setActiveModal] = useState<
    'settings' | 'about' | 'help' | 'python' | 'champion' | null
  >(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const presentState = history.present;
  const championTeam = getChampionTeam(presentState);

  // Auto trigger Champion modal when champion is determined
  useEffect(() => {
    if (championTeam && presentState.championId) {
      setActiveModal('champion');
    }
  }, [presentState.championId]);

  // Helper to push state changes to undo history
  const updateState = (newState: TournamentState) => {
    setHistory((prev) => ({
      past: [...prev.past, prev.present],
      present: newState,
      future: [],
    }));
  };

  const handleUndo = () => {
    setHistory((prev) => {
      if (prev.past.length === 0) return prev;
      const previous = prev.past[prev.past.length - 1];
      const newPast = prev.past.slice(0, prev.past.length - 1);
      return {
        past: newPast,
        present: previous,
        future: [prev.present, ...prev.future],
      };
    });
  };

  const handleRedo = () => {
    setHistory((prev) => {
      if (prev.future.length === 0) return prev;
      const next = prev.future[0];
      const newFuture = prev.future.slice(1);
      return {
        past: [...prev.past, prev.present],
        present: next,
        future: newFuture,
      };
    });
  };

  const handleScoreChange = (matchId: string, score1: number | null, score2: number | null) => {
    const nextState = updateMatchScore(presentState, matchId, score1, score2);
    updateState(nextState);
  };

  const handleTeamNameChange = (teamId: string, newName: string) => {
    const nextState = updateTeamName(presentState, teamId, newName);
    updateState(nextState);
  };

  const handleNewTournament = () => {
    if (window.confirm("Yangi turnir yaratilsinmi? Barcha kiritilgan hisoblar tozalanadi.")) {
      const initial = createInitialTournament();
      updateState(initial);
      setActiveModal(null);
    }
  };

  const handleSaveJSON = () => {
    const jsonStr = JSON.stringify(presentState, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${presentState.title.replace(/\s+/g, '_')}_PlayOff.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleOpenJSON = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && parsed.matches) {
          updateState(parsed as TournamentState);
        } else {
          alert("Xatolik: Yuklangan fayl PlayOff turnir formati strukturasiga mos kelmadi.");
        }
      } catch (err) {
        alert("JSON faylni o'qishda xatolik yuz berdi.");
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleExportPNG = async () => {
    const element = document.getElementById('playoff-bracket-canvas');
    if (!element) return;
    try {
      const canvas = await html2canvas(element, { scale: 2, useCORS: true, logging: false });
      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${presentState.title.replace(/\s+/g, '_')}_300DPI.png`;
      link.href = imgData;
      link.click();
    } catch (err) {
      console.error(err);
      alert("PNG eksport qilishda xatolik yuz berdi.");
    }
  };

  const handleExportPDF = async () => {
    const element = document.getElementById('playoff-bracket-canvas');
    if (!element) return;
    try {
      const canvas = await html2canvas(element, { scale: 2, useCORS: true, logging: false });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${presentState.title.replace(/\s+/g, '_')}.pdf`);
    } catch (err) {
      console.error(err);
      alert("PDF eksport qilishda xatolik yuz berdi.");
    }
  };

  const handleScreenshot = async () => {
    await handleExportPNG();
  };

  const handleSaveSettings = (newSettings: TournamentSettings, newPresetTeams?: string[]) => {
    let nextState: TournamentState;
    if (newPresetTeams && newPresetTeams.length === 16) {
      nextState = createInitialTournament(newPresetTeams, newSettings.name);
      nextState.settings = newSettings;
    } else {
      nextState = {
        ...presentState,
        title: newSettings.name,
        settings: newSettings,
      };
    }
    updateState(nextState);
    setActiveModal(null);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#F3F3F3] text-[#1C1C1C] overflow-hidden font-sans">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
      />

      {/* Top Navbar */}
      <Navbar
        tournamentTitle={presentState.title}
        onNew={handleNewTournament}
        onOpen={handleOpenJSON}
        onSave={handleSaveJSON}
        onExportPNG={handleExportPNG}
        onExportPDF={handleExportPDF}
        onScreenshot={handleScreenshot}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={history.past.length > 0}
        canRedo={history.future.length > 0}
        onOpenSettings={() => setActiveModal('settings')}
        onOpenPythonCode={() => setActiveModal('python')}
        onOpenAbout={() => setActiveModal('about')}
        onOpenHelp={() => setActiveModal('help')}
      />

      {/* Ribbon Toolbar */}
      <Toolbar
        tournamentTitle={presentState.title}
        onNew={handleNewTournament}
        onOpen={handleOpenJSON}
        onSave={handleSaveJSON}
        onExportPNG={handleExportPNG}
        onExportPDF={handleExportPDF}
        onScreenshot={handleScreenshot}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={history.past.length > 0}
        canRedo={history.future.length > 0}
        onOpenSettings={() => setActiveModal('settings')}
        onOpenPythonCode={() => setActiveModal('python')}
        zoom={zoom}
        onZoomIn={() => setZoom((z) => Math.min(z + 0.1, 1.5))}
        onZoomOut={() => setZoom((z) => Math.max(z - 0.1, 0.5))}
        onResetZoom={() => setZoom(1)}
      />

      {/* Bracket Stage Main Area */}
      <main className="flex-1 overflow-auto flex items-center justify-center p-4 relative">
        <BracketView
          tournament={presentState}
          zoom={zoom}
          onScoreChange={handleScoreChange}
          onTeamNameChange={handleTeamNameChange}
          championTeamName={championTeam ? championTeam.name : null}
        />
      </main>

      {/* Bottom High Density Status Bar */}
      <StatusBar matches={presentState.matches} zoom={zoom} />

      {/* Modals */}
      {activeModal === 'settings' && (
        <SettingsModal
          settings={presentState.settings}
          onSave={handleSaveSettings}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'about' && (
        <AboutModal onClose={() => setActiveModal(null)} />
      )}

      {activeModal === 'help' && (
        <HelpModal onClose={() => setActiveModal(null)} />
      )}

      {activeModal === 'python' && (
        <PythonCodeViewerModal onClose={() => setActiveModal(null)} />
      )}

      {activeModal === 'champion' && championTeam && (
        <ChampionModal
          championName={championTeam.name}
          onClose={() => setActiveModal(null)}
          onNewTournament={handleNewTournament}
        />
      )}
    </div>
  );
}
