import React, { useRef } from 'react';
import { TournamentState } from '../types/tournament';
import { MatchCard } from './MatchCard';
import { PodiumTablo } from './PodiumTablo';
import { Trophy } from 'lucide-react';

interface BracketViewProps {
  tournament: TournamentState;
  zoom: number;
  onScoreChange: (matchId: string, score1: number | null, score2: number | null) => void;
  onTeamNameChange: (teamId: string, newName: string) => void;
  championTeamName?: string | null;
}

export const BracketView: React.FC<BracketViewProps> = ({
  tournament,
  zoom,
  onScoreChange,
  onTeamNameChange,
  championTeamName,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const m = tournament.matches;
  const settings = tournament.settings;

  return (
    <div
      ref={containerRef}
      id="playoff-bracket-canvas"
      className="relative min-w-[1350px] min-h-[820px] p-6 flex flex-col items-center justify-center transition-transform duration-150 origin-top select-none bg-[#F3F3F3]"
      style={{
        transform: `scale(${zoom})`,
        backgroundImage: settings.backgroundImageUrl 
          ? `linear-gradient(rgba(243, 243, 243, 0.9), rgba(243, 243, 243, 0.9)), url(${settings.backgroundImageUrl})` 
          : "linear-gradient(rgba(243, 243, 243, 0.95), rgba(243, 243, 243, 0.95)), url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-1.2.1&auto=format&fit=crop&w=1024&q=80')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Main Bracket High Density Grid */}
      <div className="relative z-10 flex items-center justify-between gap-3 w-full max-w-[1500px]">
        
        {/* ================= LEFT BRACKET ================= */}
        <div className="flex items-center gap-6">
          {/* 1/8 ROUND (Left - 4 matches) */}
          <div className="flex flex-col justify-around h-[680px]">
            <div className="text-center mb-1">
              <span className="text-[10px] font-extrabold text-gray-700 uppercase tracking-widest bg-white border border-gray-200 px-3 py-1 rounded-full shadow-2xs">
                Match 1/8 (Chap)
              </span>
            </div>
            <div className="space-y-4">
              <MatchCard match={m['R16_M1']} settings={settings} onScoreChange={onScoreChange} onTeamNameChange={onTeamNameChange} />
              <MatchCard match={m['R16_M2']} settings={settings} onScoreChange={onScoreChange} onTeamNameChange={onTeamNameChange} />
              <MatchCard match={m['R16_M3']} settings={settings} onScoreChange={onScoreChange} onTeamNameChange={onTeamNameChange} />
              <MatchCard match={m['R16_M4']} settings={settings} onScoreChange={onScoreChange} onTeamNameChange={onTeamNameChange} />
            </div>
          </div>

          {/* 1/4 CHORAK FINAL (Left - 2 matches) */}
          <div className="flex flex-col justify-around h-[580px] py-12">
            <div className="text-center mb-1">
              <span className="text-[10px] font-extrabold text-blue-700 uppercase tracking-widest bg-white border border-blue-200 px-3 py-1 rounded-full shadow-2xs">
                1/4 Chorak Final
              </span>
            </div>
            <div className="space-y-28">
              <MatchCard match={m['R8_M1']} settings={settings} onScoreChange={onScoreChange} onTeamNameChange={onTeamNameChange} />
              <MatchCard match={m['R8_M2']} settings={settings} onScoreChange={onScoreChange} onTeamNameChange={onTeamNameChange} />
            </div>
          </div>

          {/* 1/2 YARIM FINAL (Left - 1 match) */}
          <div className="flex flex-col justify-center h-[580px]">
            <div className="text-center mb-3">
              <span className="text-[10px] font-extrabold text-purple-700 uppercase tracking-widest bg-white border border-purple-200 px-3 py-1 rounded-full shadow-2xs">
                1/2 Yarim Final
              </span>
            </div>
            <MatchCard match={m['R4_M1']} settings={settings} onScoreChange={onScoreChange} onTeamNameChange={onTeamNameChange} />
          </div>
        </div>


        {/* ================= CENTER: FINAL, 3RD PLACE & TABLO ================= */}
        <div className="flex flex-col items-center justify-center px-2 relative space-y-3">
          
          {/* Trophy Header */}
          <div className="flex flex-col items-center mb-2">
            <div className="w-14 h-14 mb-1 drop-shadow-xl text-yellow-500 animate-pulse">
              <svg viewBox="0 0 24 24" className="w-full h-full"><path fill="currentColor" d="M18 2H6v2H4v7c0 3.31 2.69 6 6 6v3H7v2h10v-2h-3v-3c3.31 0 6-2.69 6-6V4h-2V2zM6 11V4h2v7c0 2.21-1.79 4-4 4s-2-1.79-2-4zm14 0c0 2.21-1.79 4-4 4s-4-1.79-4-4V4h2v7c0 2.21 1.79 4 4 4s4-1.79 4-4v-7h2v7z"/></svg>
            </div>
            <div className="text-center">
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Final & 3-O'rin</div>
              <div className="text-lg font-black text-gray-900 tracking-tight">{tournament.title || "PLAYOFF 2026"}</div>
            </div>
          </div>

          {/* 1-O'RIN UCHUN O'YIN (GRAND FINAL) */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-extrabold text-amber-800 uppercase tracking-widest bg-amber-50 border border-amber-300 px-3 py-0.5 rounded-full mb-1 shadow-2xs">
              🏆 1-O'rin Uchun O'yin (FINAL)
            </span>
            <div className="scale-105">
              <MatchCard match={m['FINAL']} settings={settings} onScoreChange={onScoreChange} onTeamNameChange={onTeamNameChange} />
            </div>
          </div>

          {/* 3-O'RIN UCHUN O'YIN (BRONZE MATCH) */}
          {m['BRONZE'] && (
            <div className="flex flex-col items-center pt-1">
              <span className="text-[10px] font-extrabold text-amber-900 uppercase tracking-widest bg-amber-100/90 border border-amber-400 px-3 py-0.5 rounded-full mb-1 shadow-2xs">
                🥉 3-O'rin Uchun O'yin (BRONZA)
              </span>
              <div className="scale-100">
                <MatchCard match={m['BRONZE']} settings={settings} onScoreChange={onScoreChange} onTeamNameChange={onTeamNameChange} />
              </div>
            </div>
          )}

          {/* SOVRINDORLAR TABLOSI (1, 2, 3-O'RINLAR) */}
          <PodiumTablo matches={m} />
        </div>


        {/* ================= RIGHT BRACKET ================= */}
        <div className="flex items-center gap-6">
          {/* 1/2 YARIM FINAL (Right - 1 match) */}
          <div className="flex flex-col justify-center h-[580px]">
            <div className="text-center mb-3">
              <span className="text-[10px] font-extrabold text-purple-700 uppercase tracking-widest bg-white border border-purple-200 px-3 py-1 rounded-full shadow-2xs">
                1/2 Yarim Final
              </span>
            </div>
            <MatchCard match={m['R4_M2']} settings={settings} onScoreChange={onScoreChange} onTeamNameChange={onTeamNameChange} />
          </div>

          {/* 1/4 CHORAK FINAL (Right - 2 matches) */}
          <div className="flex flex-col justify-around h-[580px] py-12">
            <div className="text-center mb-1">
              <span className="text-[10px] font-extrabold text-blue-700 uppercase tracking-widest bg-white border border-blue-200 px-3 py-1 rounded-full shadow-2xs">
                1/4 Chorak Final
              </span>
            </div>
            <div className="space-y-28">
              <MatchCard match={m['R8_M3']} settings={settings} onScoreChange={onScoreChange} onTeamNameChange={onTeamNameChange} />
              <MatchCard match={m['R8_M4']} settings={settings} onScoreChange={onScoreChange} onTeamNameChange={onTeamNameChange} />
            </div>
          </div>

          {/* 1/8 ROUND (Right - 4 matches) */}
          <div className="flex flex-col justify-around h-[680px]">
            <div className="text-center mb-1">
              <span className="text-[10px] font-extrabold text-gray-700 uppercase tracking-widest bg-white border border-gray-200 px-3 py-1 rounded-full shadow-2xs">
                Match 1/8 (O'ng)
              </span>
            </div>
            <div className="space-y-4">
              <MatchCard match={m['R16_M5']} settings={settings} onScoreChange={onScoreChange} onTeamNameChange={onTeamNameChange} />
              <MatchCard match={m['R16_M6']} settings={settings} onScoreChange={onScoreChange} onTeamNameChange={onTeamNameChange} />
              <MatchCard match={m['R16_M7']} settings={settings} onScoreChange={onScoreChange} onTeamNameChange={onTeamNameChange} />
              <MatchCard match={m['R16_M8']} settings={settings} onScoreChange={onScoreChange} onTeamNameChange={onTeamNameChange} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

