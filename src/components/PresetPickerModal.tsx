import React from 'react';
import { PRESET_DILEMMAS, PresetDilemma } from '../data/presets';
import { Sparkles, X, ArrowRight, Compass, CheckCircle } from 'lucide-react';

interface PresetPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (preset: PresetDilemma) => void;
}

export const PresetPickerModal: React.FC<PresetPickerModalProps> = ({
  isOpen,
  onClose,
  onSelectPreset,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-gray-900 border border-amber-500/30 rounded-2xl shadow-2xl p-6 overflow-hidden flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between pb-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-semibold text-white">
                Featured Decision Dilemmas
              </h3>
              <p className="text-xs text-gray-400">
                Explore comprehensive pre-analyzed dilemmas with full dossiers
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {PRESET_DILEMMAS.map((preset) => (
            <div
              key={preset.id}
              className="p-4 rounded-xl bg-gray-950/70 border border-gray-800 hover:border-amber-500/50 transition-all group cursor-pointer space-y-2.5"
              onClick={() => {
                onSelectPreset(preset);
                onClose();
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    {preset.category}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Ready to View
                  </span>
                </div>
                <span className="text-xs text-amber-400 font-semibold group-hover:translate-x-1 transition flex items-center gap-1">
                  Load Dossier <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>

              <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition">
                {preset.title}
              </h4>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {preset.options.map((optName, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] px-2 py-0.5 rounded bg-gray-800/80 text-gray-300 border border-gray-700/60"
                  >
                    {optName}
                  </span>
                ))}
              </div>

              <p className="text-xs text-gray-400 italic line-clamp-2">
                Context: {preset.context}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
