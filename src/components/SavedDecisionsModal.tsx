import React from 'react';
import { SavedDilemma, DecisionAnalysisResult } from '../types';
import { Bookmark, X, Trash2, ArrowRight, Calendar, Sparkles } from 'lucide-react';

interface SavedDecisionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedList: SavedDilemma[];
  onLoadDilemma: (dilemma: SavedDilemma) => void;
  onDeleteDilemma: (id: string) => void;
}

export const SavedDecisionsModal: React.FC<SavedDecisionsModalProps> = ({
  isOpen,
  onClose,
  savedList,
  onLoadDilemma,
  onDeleteDilemma,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-6 overflow-hidden flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between pb-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
              <Bookmark className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-semibold text-white">
                Saved Decision Dossiers
              </h3>
              <p className="text-xs text-gray-400">
                Your personal library of analyzed dilemmas & resolutions
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

        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {savedList.length === 0 ? (
            <div className="text-center py-12 text-gray-400 space-y-2">
              <Bookmark className="w-10 h-10 mx-auto text-gray-600 mb-2" />
              <p className="text-sm font-medium text-gray-300">No saved decisions yet</p>
              <p className="text-xs text-gray-400 max-w-xs mx-auto">
                Whenever you analyze a dilemma, click "Save to Library" to preserve your weighted scores and verdict.
              </p>
            </div>
          ) : (
            savedList.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-gray-950/70 border border-gray-800 hover:border-amber-500/40 transition group flex items-center justify-between gap-4"
              >
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-800 text-amber-400">
                      {item.decisionStyle}
                    </span>
                    <span className="text-[11px] text-gray-400 flex items-center gap-1 font-mono">
                      <Calendar className="w-3 h-3" />
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white truncate group-hover:text-amber-300 transition">
                    {item.title}
                  </h4>

                  <p className="text-xs text-gray-400 truncate">
                    Winner:{' '}
                    <strong className="text-emerald-400">
                      {item.data.verdict.recommendedOptionName}
                    </strong>{' '}
                    ({item.data.verdict.confidencePercentage}% confidence)
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      onLoadDilemma(item);
                      onClose();
                    }}
                    className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                  >
                    Open <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteDilemma(item.id)}
                    className="p-1.5 text-gray-500 hover:text-red-400 rounded-lg hover:bg-gray-800 transition"
                    title="Delete saved dossier"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
