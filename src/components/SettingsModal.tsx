import React, { useState } from 'react';
import { TournamentSettings } from '../types/tournament';
import { PRESET_TEAMS_PFL, PRESET_TEAMS_UCL } from '../utils/tournamentEngine';
import { X, Palette, Image as ImageIcon, Check } from 'lucide-react';

interface SettingsModalProps {
  settings: TournamentSettings;
  onSave: (newSettings: TournamentSettings, newPresetTeams?: string[]) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onSave,
  onClose,
}) => {
  const [name, setName] = useState(settings.name);
  const [bgUrl, setBgUrl] = useState(settings.backgroundImageUrl);
  const [bgOpacity, setBgOpacity] = useState(settings.backgroundOpacity);
  const [lineColor, setLineColor] = useState(settings.lineColor);
  const [winnerColor, setWinnerColor] = useState(settings.winnerColor);
  const [selectedPreset, setSelectedPreset] = useState<string>('current');

  const backgroundPresets = [
    { label: 'Standart Och Kulrang', url: '' },
    { label: 'Futbol Maydoni', url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1920&q=80' },
    { label: 'Stadion Tungi Chiroqlari', url: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1920&q=80' },
    { label: 'Och Moviy Abstract', url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1920&q=80' },
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let presetTeams: string[] | undefined = undefined;
    if (selectedPreset === 'pfl') presetTeams = PRESET_TEAMS_PFL;
    if (selectedPreset === 'ucl') presetTeams = PRESET_TEAMS_UCL;

    onSave(
      {
        ...settings,
        name: name.trim() || settings.name,
        backgroundImageUrl: bgUrl,
        backgroundOpacity: bgOpacity,
        lineColor,
        winnerColor,
      },
      presetTeams
    );
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150 font-sans text-gray-800">
      <div className="bg-white border border-gray-300 rounded-xl max-w-lg w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-blue-600" />
            <h3 className="font-extrabold text-gray-900 text-sm">Turnir va Mavzu Sozlamalari</h3>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-lg cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className="p-5 space-y-4 text-xs text-gray-700">
          {/* Tournament Title */}
          <div>
            <label className="block font-bold text-gray-800 mb-1">Turnir Nomi</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Preset Teams */}
          <div>
            <label className="block font-bold text-gray-800 mb-1">Jamoalar Shablonini Yuklash</label>
            <select
              value={selectedPreset}
              onChange={(e) => setSelectedPreset(e.target.value)}
              className="w-full px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="current">Joriy Jamoalar Tarkibini Saqlash</option>
              <option value="pfl">O‘zbekiston Superligasi (16 ta Jamoa)</option>
              <option value="ucl">UEFA Champions League Play-Off (16 ta Jamoa)</option>
            </select>
          </div>

          {/* Background Image Presets */}
          <div>
            <label className="block font-bold text-gray-800 mb-1">Fon Rasmi Preseti</label>
            <div className="grid grid-cols-2 gap-2">
              {backgroundPresets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setBgUrl(preset.url)}
                  className={`p-2 rounded-lg border text-left flex items-center justify-between transition cursor-pointer ${
                    bgUrl === preset.url
                      ? 'border-blue-500 bg-blue-50 text-blue-900 font-bold'
                      : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <span className="truncate">{preset.label}</span>
                  {bgUrl === preset.url && <Check className="w-3.5 h-3.5 text-blue-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Image URL */}
          <div>
            <label className="block font-bold text-gray-800 mb-1">Moslashtirilgan Fon Rasmi URL</label>
            <input
              type="text"
              placeholder="https://..."
              value={bgUrl}
              onChange={(e) => setBgUrl(e.target.value)}
              className="w-full px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Background Opacity */}
          <div>
            <div className="flex justify-between font-bold text-gray-800 mb-1">
              <span>Fon Shaffofligi (Opacity)</span>
              <span className="font-mono">{Math.round(bgOpacity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.8"
              step="0.05"
              value={bgOpacity}
              onChange={(e) => setBgOpacity(parseFloat(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          {/* Colors */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block font-bold text-gray-800 mb-1">Liniya Rangi</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={lineColor}
                  onChange={(e) => setLineColor(e.target.value)}
                  className="w-8 h-8 rounded border border-gray-300 bg-transparent cursor-pointer"
                />
                <span className="font-mono text-gray-600">{lineColor}</span>
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-800 mb-1">G'olib Rangi</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={winnerColor}
                  onChange={(e) => setWinnerColor(e.target.value)}
                  className="w-8 h-8 rounded border border-gray-300 bg-transparent cursor-pointer"
                />
                <span className="font-mono text-gray-600">{winnerColor}</span>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg cursor-pointer"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-xs cursor-pointer"
            >
              Saqlash va Qo'llash
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

