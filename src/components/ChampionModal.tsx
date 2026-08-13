import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Sparkles, X, RotateCcw } from 'lucide-react';

interface ChampionModalProps {
  championName: string;
  onClose: () => void;
  onNewTournament: () => void;
}

export const ChampionModal: React.FC<ChampionModalProps> = ({
  championName,
  onClose,
  onNewTournament,
}) => {
  useEffect(() => {
    // Fire confetti cannon!
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#22c55e', '#eab308', '#3b82f6', '#ec4899', '#f97316']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#22c55e', '#eab308', '#3b82f6', '#ec4899', '#f97316']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans text-gray-800">
      <div className="relative bg-white border border-gray-300 rounded-2xl p-6 max-w-md w-full shadow-2xl text-center space-y-5">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full cursor-pointer transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Trophy Graphics */}
        <div className="relative inline-block">
          <div className="w-20 h-20 bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-200 rounded-full flex items-center justify-center shadow-lg mx-auto animate-bounce">
            <Trophy className="w-12 h-12 text-gray-900" />
          </div>
          <Sparkles className="w-6 h-6 text-amber-500 absolute -top-1 -right-1 animate-pulse" />
          <Sparkles className="w-5 h-5 text-yellow-500 absolute -bottom-1 -left-1 animate-pulse" />
        </div>

        {/* Celebratory Text */}
        <div className="space-y-1">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-yellow-700">
            PLAY-OFF MANAGER 2026
          </p>
          <h2 className="text-2xl font-black text-gray-900">TABRIKLAYMIZ!</h2>
          <p className="text-xs text-gray-500 font-medium">TURNIR G'OLIBI VA MUSOBAQA CHEMPIONI:</p>
        </div>

        {/* Champion Name Box */}
        <div className="py-3 px-4 bg-amber-50 border-2 border-yellow-400 rounded-xl shadow-xs">
          <h3 className="text-2xl font-black text-amber-950 uppercase tracking-wide truncate">
            🏆 {championName} 🏆
          </h3>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={onNewTournament}
            className="flex-1 py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-blue-600" /> Yangi Turnir
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition shadow-xs cursor-pointer"
          >
            Natijani Ko'rish
          </button>
        </div>
      </div>
    </div>
  );
};

