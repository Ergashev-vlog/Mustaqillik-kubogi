import React, { useState } from 'react';
import { Match, Team, TournamentSettings } from '../types/tournament';
import { Edit2, AlertCircle, CheckCircle2 } from 'lucide-react';

interface MatchCardProps {
  match: Match;
  settings: TournamentSettings;
  onScoreChange: (matchId: string, score1: number | null, score2: number | null) => void;
  onTeamNameChange: (teamId: string, newName: string) => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({
  match,
  settings,
  onScoreChange,
  onTeamNameChange,
}) => {
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [editName, setEditName] = useState<string>('');

  const handleScore1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.trim();
    if (val === '') {
      onScoreChange(match.id, null, match.score2);
    } else {
      const num = parseInt(val, 10);
      if (!isNaN(num) && num >= 0 && num <= 99) {
        onScoreChange(match.id, num, match.score2);
      }
    }
  };

  const handleScore2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.trim();
    if (val === '') {
      onScoreChange(match.id, match.score1, null);
    } else {
      const num = parseInt(val, 10);
      if (!isNaN(num) && num >= 0 && num <= 99) {
        onScoreChange(match.id, match.score1, num);
      }
    }
  };

  const handleTeamDoubleClick = (team: Team | null) => {
    if (match.roundId === 'R16' && team) {
      setEditingTeam(team);
      setEditName(team.name);
    }
  };

  const saveTeamName = () => {
    if (editingTeam && editName.trim()) {
      onTeamNameChange(editingTeam.id, editName.trim());
    }
    setEditingTeam(null);
  };

  const isCompleted = match.status === 'completed' && match.winnerId !== null;
  const isDrawError = match.status === 'draw_error';

  const t1Winner = isCompleted && match.winnerId === match.team1?.id;
  const t2Winner = isCompleted && match.winnerId === match.team2?.id;

  const roundTitles: Record<string, string> = {
    R16: '1/16',
    R8: '1/8',
    R4: '1/4',
    FINAL: 'FINAL',
  };

  const isFinal = match.roundId === 'FINAL';

  return (
    <div
      className={`relative ${isFinal ? 'w-56 bg-gradient-to-br from-white to-amber-50/40 border-2 border-yellow-400 shadow-xl ring-2 ring-yellow-100/80 p-3' : 'w-44 bg-white shadow-md border-l-4 border-gray-300 p-2 border-y border-r border-gray-200'} rounded-lg text-[11px] select-none transition-all duration-150 ${
        isDrawError
          ? 'border-l-amber-500 bg-amber-50/90 text-amber-900 border-amber-200'
          : isCompleted
          ? 'border-l-emerald-500 text-gray-800'
          : match.team1 || match.team2
          ? 'border-l-blue-500 text-gray-800'
          : 'border-l-gray-300 text-gray-500'
      }`}
    >
      {/* Header Match Identifier */}
      <div className="flex items-center justify-between mb-1">
        <span className={`text-[9px] font-bold uppercase tracking-wider ${isFinal ? 'text-amber-700' : 'text-gray-400'}`}>
          Match #{match.matchNumber} - {roundTitles[match.roundId]}
        </span>
        {isCompleted && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
        {isDrawError && <AlertCircle className="w-3 h-3 text-amber-600 animate-pulse" />}
      </div>

      <div className="space-y-1">
        {/* TEAM 1 ROW */}
        <div
          className={`flex items-center justify-between p-1 rounded transition-colors ${
            t1Winner
              ? 'bg-green-50 font-bold text-emerald-950 border border-green-200/80'
              : match.team1
              ? 'hover:bg-gray-50 text-gray-800'
              : 'text-gray-400 italic'
          }`}
          onDoubleClick={() => handleTeamDoubleClick(match.team1)}
          title={match.roundId === 'R16' ? "Jamoa nomini tahrirlash uchun ikkita bosing" : ""}
        >
          <div className="flex items-center gap-1.5 overflow-hidden pr-1 max-w-[105px]">
            <span className="text-xs font-semibold truncate">
              {match.team1 ? match.team1.name : 'Kutilmoqda...'}
            </span>
            {match.roundId === 'R16' && match.team1 && (
              <Edit2 className="w-2.5 h-2.5 text-gray-400 hover:text-blue-600 flex-shrink-0 cursor-pointer" />
            )}
          </div>

          <input
            type="number"
            min="0"
            max="99"
            placeholder="-"
            disabled={!match.team1 || !match.team2}
            value={match.score1 !== null ? match.score1 : ''}
            onChange={handleScore1Change}
            className={`w-7 h-6 text-center font-bold text-xs rounded border border-gray-300 focus:bg-white focus:border-blue-500 focus:outline-none transition ${
              t1Winner ? 'bg-emerald-100 text-emerald-900 border-emerald-400 font-extrabold' : 'bg-gray-50 text-gray-800'
            }`}
          />
        </div>

        {/* TEAM 2 ROW */}
        <div
          className={`flex items-center justify-between p-1 rounded transition-colors ${
            t2Winner
              ? 'bg-green-50 font-bold text-emerald-950 border border-green-200/80'
              : match.team2
              ? 'hover:bg-gray-50 text-gray-800'
              : 'text-gray-400 italic'
          }`}
          onDoubleClick={() => handleTeamDoubleClick(match.team2)}
          title={match.roundId === 'R16' ? "Jamoa nomini tahrirlash uchun ikkita bosing" : ""}
        >
          <div className="flex items-center gap-1.5 overflow-hidden pr-1 max-w-[105px]">
            <span className="text-xs font-semibold truncate">
              {match.team2 ? match.team2.name : 'Kutilmoqda...'}
            </span>
            {match.roundId === 'R16' && match.team2 && (
              <Edit2 className="w-2.5 h-2.5 text-gray-400 hover:text-blue-600 flex-shrink-0 cursor-pointer" />
            )}
          </div>

          <input
            type="number"
            min="0"
            max="99"
            placeholder="-"
            disabled={!match.team1 || !match.team2}
            value={match.score2 !== null ? match.score2 : ''}
            onChange={handleScore2Change}
            className={`w-7 h-6 text-center font-bold text-xs rounded border border-gray-300 focus:bg-white focus:border-blue-500 focus:outline-none transition ${
              t2Winner ? 'bg-emerald-100 text-emerald-900 border-emerald-400 font-extrabold' : 'bg-gray-50 text-gray-800'
            }`}
          />
        </div>

        {/* Draw Warning Message */}
        {isDrawError && (
          <p className="text-[9px] text-amber-800 font-bold text-center bg-amber-100 py-0.5 rounded border border-amber-300">
            Penaltilar g'olibini kiriting!
          </p>
        )}
      </div>

      {/* Inline Team Name Edit Modal */}
      {editingTeam && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-300 rounded-xl p-4 w-80 shadow-2xl space-y-3 text-gray-800">
            <h4 className="text-xs font-bold text-gray-900 uppercase">Jamoa nomini o'zgartirish</h4>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && saveTeamName()}
              className="w-full px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => setEditingTeam(null)}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-md cursor-pointer"
              >
                Bekor qilish
              </button>
              <button
                onClick={saveTeamName}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-md cursor-pointer shadow-xs"
              >
                Saqlash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

