import React from 'react';
import { 
  FileText, FolderOpen, Save, FileImage, Camera, 
  Palette, Undo, Redo, Code, ZoomIn, ZoomOut, Maximize, RefreshCw, Layers
} from 'lucide-react';

interface ToolbarProps {
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
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
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
  zoom,
  onZoomIn,
  onZoomOut,
  onResetZoom,
}) => {
  return (
    <div className="bg-white border-b border-gray-200 shadow-xs px-3 py-1.5 flex items-center justify-between select-none z-20 font-sans text-gray-800">
      {/* Left Ribbon Action Items */}
      <div className="flex items-center gap-1 overflow-x-auto">
        <button
          onClick={onNew}
          className="flex flex-col items-center p-1.5 hover:bg-gray-100 active:bg-gray-200 rounded min-w-[50px] transition-all cursor-pointer group"
          title="Yangi Play-Off turniri (Ctrl+N)"
        >
          <span className="text-base group-hover:scale-110 transition-transform">📄</span>
          <span className="text-[10px] mt-0.5 font-medium text-gray-700">Yangi</span>
        </button>

        <button
          onClick={onOpen}
          className="flex flex-col items-center p-1.5 hover:bg-gray-100 active:bg-gray-200 rounded min-w-[50px] transition-all cursor-pointer group"
          title="JSON faylidan yuklash (Ctrl+O)"
        >
          <span className="text-base group-hover:scale-110 transition-transform">📂</span>
          <span className="text-[10px] mt-0.5 font-medium text-gray-700">Ochish</span>
        </button>

        <button
          onClick={onSave}
          className="flex flex-col items-center p-1.5 hover:bg-gray-100 active:bg-gray-200 rounded min-w-[50px] transition-all cursor-pointer group"
          title="Turnirni JSON formatida saqlash (Ctrl+S)"
        >
          <span className="text-base group-hover:scale-110 transition-transform">💾</span>
          <span className="text-[10px] mt-0.5 font-medium text-gray-700">Saqlash</span>
        </button>

        <div className="w-[1px] h-9 bg-gray-200 mx-1" />

        <button
          onClick={onExportPNG}
          className="flex flex-col items-center p-1.5 hover:bg-gray-100 active:bg-gray-200 rounded min-w-[50px] transition-all cursor-pointer group"
          title="300 DPI sifatda PNG rasm qilib saqlash"
        >
          <span className="text-base text-blue-600 font-bold group-hover:scale-110 transition-transform">🖼️</span>
          <span className="text-[10px] mt-0.5 font-medium text-gray-700">PNG</span>
        </button>

        <button
          onClick={onExportPDF}
          className="flex flex-col items-center p-1.5 hover:bg-gray-100 active:bg-gray-200 rounded min-w-[50px] transition-all cursor-pointer group"
          title="A4 Landscape PDF eksport"
        >
          <span className="text-base text-red-600 font-bold group-hover:scale-110 transition-transform">📑</span>
          <span className="text-[10px] mt-0.5 font-medium text-gray-700">PDF</span>
        </button>

        <button
          onClick={onScreenshot}
          className="flex flex-col items-center p-1.5 hover:bg-gray-100 active:bg-gray-200 rounded min-w-[50px] transition-all cursor-pointer group"
          title="Tezkor skrinshot olish"
        >
          <span className="text-base text-gray-600 group-hover:scale-110 transition-transform">📸</span>
          <span className="text-[10px] mt-0.5 font-medium text-gray-700">Capture</span>
        </button>

        <div className="w-[1px] h-9 bg-gray-200 mx-1" />

        <button
          onClick={onOpenSettings}
          className="flex flex-col items-center p-1.5 hover:bg-gray-100 active:bg-gray-200 rounded min-w-[50px] transition-all cursor-pointer group"
          title="Fon rasmi, nomlar va ranglar sozlamasi"
        >
          <span className="text-base group-hover:scale-110 transition-transform">🎨</span>
          <span className="text-[10px] mt-0.5 font-medium text-gray-700">Theme</span>
        </button>

        <button
          onClick={onOpenPythonCode}
          className="flex flex-col items-center p-1.5 hover:bg-gray-100 active:bg-gray-200 rounded min-w-[50px] transition-all cursor-pointer group"
          title="Python PySide6 manba kodi"
        >
          <span className="text-base text-blue-600 font-bold group-hover:scale-110 transition-transform">🐍</span>
          <span className="text-[10px] mt-0.5 font-semibold text-blue-700">Python</span>
        </button>

        <div className="w-[1px] h-9 bg-gray-200 mx-1" />

        {/* Undo & Redo */}
        <div className="flex items-center gap-0.5 bg-gray-50 border border-gray-200 rounded-md p-1">
          <button
            disabled={!canUndo}
            onClick={onUndo}
            className="p-1 hover:bg-gray-200 disabled:opacity-30 rounded text-gray-700 cursor-pointer"
            title="Bekor qilish (Ctrl+Z)"
          >
            <Undo className="w-3.5 h-3.5 text-blue-600" />
          </button>
          <button
            disabled={!canRedo}
            onClick={onRedo}
            className="p-1 hover:bg-gray-200 disabled:opacity-30 rounded text-gray-700 cursor-pointer"
            title="Qaytarish (Ctrl+Y)"
          >
            <Redo className="w-3.5 h-3.5 text-indigo-600" />
          </button>
        </div>

        {/* Zoom */}
        <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-md px-1.5 py-1 text-xs">
          <button onClick={onZoomOut} className="p-0.5 hover:bg-gray-200 rounded text-gray-600 cursor-pointer" title="Kichraytirish">
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono text-[11px] font-bold text-gray-800 min-w-[36px] text-center">{Math.round(zoom * 100)}%</span>
          <button onClick={onZoomIn} className="p-0.5 hover:bg-gray-200 rounded text-gray-600 cursor-pointer" title="Kattalashtirish">
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button onClick={onResetZoom} className="p-0.5 hover:bg-gray-200 rounded text-gray-600 cursor-pointer ml-0.5 border-l border-gray-200 pl-1" title="Moslashtirish">
            <Maximize className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Right Tournament Badge */}
      <div className="hidden sm:flex items-center">
        <div className="px-3.5 py-1.5 bg-blue-50 rounded-lg border border-blue-100 shadow-2xs">
          <span className="text-xs font-extrabold text-blue-700 truncate max-w-[200px] block">
            {tournamentTitle || "Uzbekistan SuperCup 2026"}
          </span>
        </div>
      </div>
    </div>
  );
};

