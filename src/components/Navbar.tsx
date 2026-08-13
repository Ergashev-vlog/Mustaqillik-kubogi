import React, { useState } from 'react';
import { 
  Trophy, FolderOpen, Save, FileImage, FileText, Camera, 
  Settings, RefreshCw, Undo, Redo, HelpCircle, Code, Minimize2, Square, X
} from 'lucide-react';

interface NavbarProps {
  tournamentTitle: string;
  onNew: () => void;
  onOpen: () => void;
  onSave: () => void;
  onExportPNG: () => void;
  onExportPDF: () => void;
  onScreenshot: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onOpenSettings: () => void;
  onOpenPythonCode: () => void;
  onOpenAbout: () => void;
  onOpenHelp: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  tournamentTitle,
  onNew,
  onOpen,
  onSave,
  onExportPNG,
  onExportPDF,
  onScreenshot,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onOpenSettings,
  onOpenPythonCode,
  onOpenAbout,
  onOpenHelp,
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const toggleMenu = (menuName: string) => {
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  const closeMenu = () => setActiveMenu(null);

  return (
    <header className="bg-white text-gray-800 border-b border-gray-200 select-none sticky top-0 z-50 shadow-xs font-sans">
      {/* Top Windows Desktop Title Bar */}
      <div className="flex items-center justify-between px-3 py-1 bg-white text-xs border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center shadow-xs">
              <div className="w-2.5 h-2.5 border-2 border-white rounded-xs transform rotate-45" />
            </div>
            <span className="text-xs font-bold text-gray-900 tracking-tight">PlayOff Manager</span>
          </div>
          <span className="text-gray-300">|</span>
          <span className="text-gray-600 font-semibold truncate max-w-[280px] text-[11px]">{tournamentTitle}</span>
          <span className="text-[10px] font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
            PySide6 Desktop Edition
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={onOpenPythonCode} 
            className="flex items-center gap-1.5 px-2.5 py-0.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded text-[11px] font-semibold transition cursor-pointer"
          >
            <Code className="w-3 h-3 text-blue-600" />
            <span>Python Source (.py)</span>
          </button>
          
          {/* Windows Window Controls */}
          <div className="flex items-center text-gray-500 ml-2">
            <button className="px-2.5 py-1 hover:bg-gray-100 rounded text-xs transition">
              &#x2014;
            </button>
            <button className="px-2.5 py-1 hover:bg-gray-100 rounded text-xs transition">
              &#x25FB;
            </button>
            <button className="px-2.5 py-1 hover:bg-red-600 hover:text-white rounded text-xs transition">
              &#x2715;
            </button>
          </div>
        </div>
      </div>

      {/* Menu Bar (File, Edit, Settings, Code, Help) */}
      <div className="flex items-center px-2 py-0.5 text-xs gap-1 relative bg-gray-50/80">
        {/* FILE MENU */}
        <div className="relative">
          <button 
            onClick={() => toggleMenu('file')} 
            className={`px-2.5 py-1 rounded hover:bg-gray-200/80 text-gray-700 font-medium transition cursor-pointer ${activeMenu === 'file' ? 'bg-gray-200 text-gray-900 font-semibold' : ''}`}
          >
            Fayl
          </button>
          {activeMenu === 'file' && (
            <div className="absolute top-full left-0 mt-0.5 w-52 bg-white border border-gray-200 rounded-md shadow-xl py-1 text-gray-800 text-xs z-50">
              <button onClick={() => { onNew(); closeMenu(); }} className="w-full text-left px-3 py-1.5 hover:bg-blue-50 hover:text-blue-700 flex items-center justify-between">
                <span className="flex items-center gap-2"><RefreshCw className="w-3.5 h-3.5 text-blue-600" /> Yangi Turnir</span>
                <span className="text-gray-400 text-[10px]">Ctrl+N</span>
              </button>
              <button onClick={() => { onOpen(); closeMenu(); }} className="w-full text-left px-3 py-1.5 hover:bg-blue-50 hover:text-blue-700 flex items-center justify-between">
                <span className="flex items-center gap-2"><FolderOpen className="w-3.5 h-3.5 text-amber-600" /> Ochish (JSON)...</span>
                <span className="text-gray-400 text-[10px]">Ctrl+O</span>
              </button>
              <button onClick={() => { onSave(); closeMenu(); }} className="w-full text-left px-3 py-1.5 hover:bg-blue-50 hover:text-blue-700 flex items-center justify-between">
                <span className="flex items-center gap-2"><Save className="w-3.5 h-3.5 text-emerald-600" /> Saqlash (JSON)</span>
                <span className="text-gray-400 text-[10px]">Ctrl+S</span>
              </button>
              <div className="my-1 border-t border-gray-100" />
              <button onClick={() => { onExportPNG(); closeMenu(); }} className="w-full text-left px-3 py-1.5 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2">
                <FileImage className="w-3.5 h-3.5 text-purple-600" /> PNG Eksport (300 DPI)
              </button>
              <button onClick={() => { onExportPDF(); closeMenu(); }} className="w-full text-left px-3 py-1.5 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-rose-600" /> PDF Eksport (A4)
              </button>
              <button onClick={() => { onScreenshot(); closeMenu(); }} className="w-full text-left px-3 py-1.5 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2">
                <Camera className="w-3.5 h-3.5 text-cyan-600" /> Skrinshot Olish
              </button>
            </div>
          )}
        </div>

        {/* TAHRIRLASH MENU */}
        <div className="relative">
          <button 
            onClick={() => toggleMenu('edit')} 
            className={`px-2.5 py-1 rounded hover:bg-gray-200/80 text-gray-700 font-medium transition cursor-pointer ${activeMenu === 'edit' ? 'bg-gray-200 text-gray-900 font-semibold' : ''}`}
          >
            Tahrirlash
          </button>
          {activeMenu === 'edit' && (
            <div className="absolute top-full left-0 mt-0.5 w-48 bg-white border border-gray-200 rounded-md shadow-xl py-1 text-gray-800 text-xs z-50">
              <button 
                disabled={!canUndo} 
                onClick={() => { onUndo(); closeMenu(); }} 
                className="w-full text-left px-3 py-1.5 hover:bg-blue-50 disabled:opacity-40 flex items-center justify-between"
              >
                <span className="flex items-center gap-2"><Undo className="w-3.5 h-3.5 text-cyan-600" /> Bekor qilish (Undo)</span>
                <span className="text-gray-400 text-[10px]">Ctrl+Z</span>
              </button>
              <button 
                disabled={!canRedo} 
                onClick={() => { onRedo(); closeMenu(); }} 
                className="w-full text-left px-3 py-1.5 hover:bg-blue-50 disabled:opacity-40 flex items-center justify-between"
              >
                <span className="flex items-center gap-2"><Redo className="w-3.5 h-3.5 text-indigo-600" /> Qaytarish (Redo)</span>
                <span className="text-gray-400 text-[10px]">Ctrl+Y</span>
              </button>
            </div>
          )}
        </div>

        {/* SOZLAMALAR MENU */}
        <div className="relative">
          <button 
            onClick={() => toggleMenu('settings')} 
            className={`px-2.5 py-1 rounded hover:bg-gray-200/80 text-gray-700 font-medium transition cursor-pointer ${activeMenu === 'settings' ? 'bg-gray-200 text-gray-900 font-semibold' : ''}`}
          >
            Sozlamalar
          </button>
          {activeMenu === 'settings' && (
            <div className="absolute top-full left-0 mt-0.5 w-48 bg-white border border-gray-200 rounded-md shadow-xl py-1 text-gray-800 text-xs z-50">
              <button onClick={() => { onOpenSettings(); closeMenu(); }} className="w-full text-left px-3 py-1.5 hover:bg-blue-50 flex items-center gap-2">
                <Settings className="w-3.5 h-3.5 text-emerald-600" /> Turnir va Ranglar
              </button>
            </div>
          )}
        </div>

        {/* MANBA KODI MENU */}
        <div className="relative">
          <button 
            onClick={onOpenPythonCode} 
            className="px-2.5 py-1 rounded hover:bg-gray-200/80 text-blue-700 font-semibold transition cursor-pointer"
          >
            Python PySide6 Kodi
          </button>
        </div>

        {/* YORDAM MENU */}
        <div className="relative">
          <button 
            onClick={() => toggleMenu('help')} 
            className={`px-2.5 py-1 rounded hover:bg-gray-200/80 text-gray-700 font-medium transition cursor-pointer ${activeMenu === 'help' ? 'bg-gray-200 text-gray-900 font-semibold' : ''}`}
          >
            Yordam
          </button>
          {activeMenu === 'help' && (
            <div className="absolute top-full left-0 mt-0.5 w-48 bg-white border border-gray-200 rounded-md shadow-xl py-1 text-gray-800 text-xs z-50">
              <button onClick={() => { onOpenHelp(); closeMenu(); }} className="w-full text-left px-3 py-1.5 hover:bg-blue-50 flex items-center gap-2">
                <HelpCircle className="w-3.5 h-3.5 text-amber-600" /> Qo'llanma
              </button>
              <button onClick={() => { onOpenAbout(); closeMenu(); }} className="w-full text-left px-3 py-1.5 hover:bg-blue-50 flex items-center gap-2">
                <Trophy className="w-3.5 h-3.5 text-emerald-600" /> Dastur haqida
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

