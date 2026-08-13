import React from 'react';
import { Trophy, X, ShieldCheck, Code2, Cpu } from 'lucide-react';

interface AboutModalProps {
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150 font-sans text-gray-800">
      <div className="bg-white border border-gray-300 rounded-xl max-w-md w-full shadow-2xl p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-200">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-xs">
              <Trophy className="w-4 h-4 text-yellow-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-gray-900">PlayOff Manager</h3>
              <p className="text-[10px] text-gray-500 font-medium">Professional Football Tournament Manager</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 text-xs text-gray-600 leading-relaxed">
          <p>
            <strong className="text-gray-900">PlayOff Manager</strong> — Professional futbol Play-Off bosqichlarini boshqarish uchun mo'ljallangan Windows Desktop va Web dasturi.
          </p>

          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-1.5 text-[11px] font-mono">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Dastur Versiyasi:</span>
              <span className="font-bold text-blue-700">v1.0.0 Desktop Architecture</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Texnologiya:</span>
              <span className="font-bold text-emerald-700">Python 3.13 + PySide6 (Qt)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Arxitektura:</span>
              <span className="font-bold text-purple-700">MVC (Model-View-Controller)</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-gray-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Rekursiv davomiylik va avtomatik bosqich tozalash algoritmi asosida ishlaydi.</span>
          </div>
        </div>

        <div className="pt-3 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-xs cursor-pointer shadow-xs"
          >
            Yopish
          </button>
        </div>
      </div>
    </div>
  );
};

