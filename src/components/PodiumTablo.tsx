import React from 'react';
import { Match, Team } from '../types/tournament';

interface PodiumTabloProps {
  matches: Record<string, Match>;
}

export const PodiumTablo: React.FC<PodiumTabloProps> = ({ matches }) => {
  const finalMatch = matches['FINAL'];
  const bronzeMatch = matches['BRONZE'];

  let firstPlace: Team | null = null;
  let secondPlace: Team | null = null;
  let thirdPlace: Team | null = null;
  let fourthPlace: Team | null = null;

  if (finalMatch && finalMatch.status === 'completed' && finalMatch.winnerId) {
    if (finalMatch.team1 && finalMatch.team1.id === finalMatch.winnerId) {
      firstPlace = finalMatch.team1;
      secondPlace = finalMatch.team2;
    } else if (finalMatch.team2 && finalMatch.team2.id === finalMatch.winnerId) {
      firstPlace = finalMatch.team2;
      secondPlace = finalMatch.team1;
    }
  }

  if (bronzeMatch && bronzeMatch.status === 'completed' && bronzeMatch.winnerId) {
    if (bronzeMatch.team1 && bronzeMatch.team1.id === bronzeMatch.winnerId) {
      thirdPlace = bronzeMatch.team1;
      fourthPlace = bronzeMatch.team2;
    } else if (bronzeMatch.team2 && bronzeMatch.team2.id === bronzeMatch.winnerId) {
      thirdPlace = bronzeMatch.team2;
      fourthPlace = bronzeMatch.team1;
    }
  }

  return (
    <div className="w-64 bg-white border-2 border-amber-300/80 rounded-xl shadow-lg p-3 text-gray-800 font-sans mt-3 animate-in fade-in duration-200">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-amber-200">
        <div className="flex items-center gap-1.5">
          <span className="text-sm">📊</span>
          <h4 className="font-black text-xs text-amber-950 uppercase tracking-wider">
            SOVRINDORLAR TABLOSI
          </h4>
        </div>
        <span className="text-[9px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.5 rounded border border-amber-300">
          1, 2, 3-O'rinlar
        </span>
      </div>

      <div className="space-y-1.5 text-xs">
        {/* 1-O'RIN */}
        <div className="flex items-center justify-between p-2 rounded-lg bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 border border-yellow-400 shadow-2xs">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="text-lg flex-shrink-0">🥇</span>
            <div className="flex flex-col">
              <span className="text-[9px] font-extrabold text-amber-900 uppercase leading-none">1-O'rin (Chempion)</span>
              <span className="font-black text-gray-900 truncate max-w-[125px] mt-0.5">
                {firstPlace ? firstPlace.name : 'Kutilmoqda...'}
              </span>
            </div>
          </div>
          {firstPlace && (
            <span className="text-[9px] font-black text-amber-900 bg-yellow-300/90 px-1.5 py-0.5 rounded shadow-2xs">
              G'OLIB
            </span>
          )}
        </div>

        {/* 2-O'RIN */}
        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-300 shadow-2xs">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="text-lg flex-shrink-0">🥈</span>
            <div className="flex flex-col">
              <span className="text-[9px] font-extrabold text-slate-600 uppercase leading-none">2-O'rin (Vitse-chempion)</span>
              <span className="font-bold text-gray-800 truncate max-w-[125px] mt-0.5">
                {secondPlace ? secondPlace.name : 'Kutilmoqda...'}
              </span>
            </div>
          </div>
          {secondPlace && (
            <span className="text-[9px] font-bold text-slate-700 bg-slate-200 px-1.5 py-0.5 rounded">
              FINALCHI
            </span>
          )}
        </div>

        {/* 3-O'RIN */}
        <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50/80 border border-amber-300/80 shadow-2xs">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="text-lg flex-shrink-0">🥉</span>
            <div className="flex flex-col">
              <span className="text-[9px] font-extrabold text-amber-800 uppercase leading-none">3-O'rin (Bronza Medal)</span>
              <span className="font-bold text-gray-800 truncate max-w-[125px] mt-0.5">
                {thirdPlace ? thirdPlace.name : 'Kutilmoqda...'}
              </span>
            </div>
          </div>
          {thirdPlace && (
            <span className="text-[9px] font-bold text-amber-800 bg-amber-200/80 px-1.5 py-0.5 rounded">
              BRONZA
            </span>
          )}
        </div>

        {/* 4-O'RIN */}
        {fourthPlace && (
          <div className="flex items-center justify-between p-1.5 rounded-lg bg-gray-50 border border-gray-200 text-[10px]">
            <div className="flex items-center gap-1.5 overflow-hidden">
              <span className="text-xs font-bold text-gray-400">4.</span>
              <span className="font-semibold text-gray-600 truncate max-w-[140px]">
                {fourthPlace.name}
              </span>
            </div>
            <span className="text-[9px] text-gray-400 font-medium">4-o'rin</span>
          </div>
        )}
      </div>
    </div>
  );
};
