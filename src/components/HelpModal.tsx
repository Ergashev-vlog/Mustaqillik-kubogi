import React from 'react';
import { HelpCircle, X, CheckCircle2, Edit3, RefreshCw, Save } from 'lucide-react';

interface HelpModalProps {
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150 font-sans text-gray-800">
      <div className="bg-white border border-gray-300 rounded-xl max-w-lg w-full shadow-2xl p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            <h3 className="font-extrabold text-sm text-gray-900">PlayOff Manager Qo'llanmasi</h3>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 text-xs text-gray-600 leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
          <div className="flex gap-2.5 p-2 bg-gray-50 rounded-lg border border-gray-200">
            <Edit3 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-gray-900">1. Jamoalar nomini kiritish</h4>
              <p className="text-gray-600">1/16 bosqichidagi jamoa nomiga sichqonchani ikkita bosing (double click). Istalgan yangi nomni yozing.</p>
            </div>
          </div>

          <div className="flex gap-2.5 p-2 bg-gray-50 rounded-lg border border-gray-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-gray-900">2. Hisoblarni kiritish va Avto-O'tish</h4>
              <p className="text-gray-600">O'yin hisoblarini faqat sonlar bilan kiriting. Hisob kiritilgach g'olib avtomatik tarzda 1/8, 1/4 va Final bosqichiga o'tadi.</p>
            </div>
          </div>

          <div className="flex gap-2.5 p-2 bg-gray-50 rounded-lg border border-gray-200">
            <RefreshCw className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-gray-900">3. Rekursiv Qaytadan Hisoblash (Cascade Clear)</h4>
              <p className="text-gray-600">Agar 1/16 yoki 1/8 bosqichidagi o'yin natijasini keyinchalik o'zgartirsangiz, ushbu jamoaga bog'liq keyingi barcha bosqichlar va Final avtomatik bekor qilinadi va qayta hisoblanadi.</p>
            </div>
          </div>

          <div className="flex gap-2.5 p-2 bg-gray-50 rounded-lg border border-gray-200">
            <Save className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-gray-900">4. Saqlash va Eksport Qilish</h4>
              <p className="text-gray-600">Turnir holatini JSON faylida saqlashingiz yoki yuqori bosma sifatdagi 300 DPI PNG rasm va A4 Landscape PDF qilib eksport qilishingiz mumkin.</p>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-xs cursor-pointer shadow-xs"
          >
            Tushundim
          </button>
        </div>
      </div>
    </div>
  );
};

