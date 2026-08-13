import React from 'react';
import { Match } from '../types/tournament';

interface StatusBarProps {
  matches: Record<string, Match>;
  zoom: number;
}

export const StatusBar: React.FC<StatusBarProps> = ({ matches, zoom }) => {
  const totalMatches = Object.keys(matches).length || 15;
  const completedMatches = Object.values(matches).filter(
    (m) => m.status === 'completed' && m.winnerId !== null
  ).length;

  return (
    <footer className="flex items-center justify-between px-4 py-1 bg-white border-t border-gray-200 text-[10px] text-gray-500 select-none font-sans z-30 shadow-xs">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1.5">
          <span>Status:</span>
          <span className="text-emerald-600 font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Ready
          </span>
        </span>
        <span className="text-gray-300">|</span>
        <span>
          O'yinlar: <strong className="text-gray-700">{completedMatches} / {totalMatches}</strong> Yakunlandi
        </span>
        <span className="text-gray-300">|</span>
        <span>Format: 16 ta Jamoa Play-Off</span>
      </div>

      <div className="flex items-center gap-4">
        <span>
          Scale: <strong className="text-gray-700 font-mono">{Math.round(zoom * 100)}%</strong>
        </span>
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 bg-[#4CAF50] rounded-full" title="G'olib" />
          <div className="w-2.5 h-2.5 bg-[#f44336] rounded-full" title="Xato/Penalti" />
          <div className="w-2.5 h-2.5 bg-[#2196F3] rounded-full" title="Keyingi bosqich" />
        </div>
        <span className="text-gray-300">|</span>
        <span className="font-medium text-gray-600">Theme: High Density Light</span>
      </div>
    </footer>
  );
};
