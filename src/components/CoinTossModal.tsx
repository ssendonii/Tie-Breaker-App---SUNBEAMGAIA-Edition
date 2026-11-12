import React, { useState } from 'react';
import { Sparkles, X, RotateCw, Heart, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CoinTossModalProps {
  isOpen: boolean;
  onClose: () => void;
  optionA: string;
  optionB: string;
}

export const CoinTossModal: React.FC<CoinTossModalProps> = ({
  isOpen,
  onClose,
  optionA,
  optionB,
}) => {
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<'A' | 'B' | null>(null);
  const [flippedCount, setFlippedCount] = useState(0);

  if (!isOpen) return null;

  const handleFlip = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    setResult(null);

    // Simulate 1.8s flip animation
    setTimeout(() => {
      const outcome = Math.random() > 0.5 ? 'A' : 'B';
      setResult(outcome);
      setIsFlipping(false);
      setFlippedCount((prev) => prev + 1);

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#10B981', '#FBBF24'],
      });
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-gray-900 border border-amber-500/30 rounded-2xl shadow-2xl p-6 overflow-hidden">
        {/* Radiant glow accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-24 bg-amber-500/10 blur-3xl pointer-events-none rounded-full" />

        <div className="flex items-center justify-between pb-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-semibold text-white tracking-wide">
                The Sunbeam Coin Toss Oracle
              </h3>
              <p className="text-xs text-gray-400">Psychological Subconscious Clarity Test</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* The Psychology Insight Box */}
        <div className="my-4 p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/20 text-xs text-amber-200/90 flex gap-3">
          <Heart className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-amber-300 block mb-0.5">The Secret of the Coin:</strong>
            Do not look only at how the coin lands. Pay attention to <em>what your heart hoped for</em> while the coin was suspended in the air. That hope is your true subconscious conviction.
          </div>
        </div>

        {/* Choice Mapping */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div
            className={`p-3 rounded-xl border transition-all ${
              result === 'A'
                ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/50'
                : 'bg-gray-800/60 border-gray-700'
            }`}
          >
            <div className="text-[11px] font-mono text-amber-400 uppercase tracking-wider mb-1">
              Side Heads (A)
            </div>
            <div className="text-sm font-medium text-gray-200 line-clamp-2">
              {optionA || 'Option A'}
            </div>
          </div>

          <div
            className={`p-3 rounded-xl border transition-all ${
              result === 'B'
                ? 'bg-emerald-500/20 border-emerald-400 ring-2 ring-emerald-400/50'
                : 'bg-gray-800/60 border-gray-700'
            }`}
          >
            <div className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider mb-1">
              Side Tails (B)
            </div>
            <div className="text-sm font-medium text-gray-200 line-clamp-2">
              {optionB || 'Option B'}
            </div>
          </div>
        </div>

        {/* Animated Coin */}
        <div className="flex flex-col items-center justify-center my-6">
          <div
            className={`w-28 h-28 rounded-full border-4 border-amber-400/80 bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 shadow-xl shadow-amber-500/30 flex items-center justify-center text-gray-950 font-bold transition-all duration-300 select-none ${
              isFlipping ? 'animate-spin scale-110' : ''
            }`}
            style={{
              boxShadow: isFlipping
                ? '0 0 40px rgba(245, 158, 11, 0.6)'
                : '0 10px 25px -5px rgba(245, 158, 11, 0.4)',
            }}
          >
            <div className="w-24 h-24 rounded-full border-2 border-dashed border-amber-200 flex flex-col items-center justify-center text-center p-2">
              {isFlipping ? (
                <RotateCw className="w-8 h-8 animate-spin text-amber-950" />
              ) : result ? (
                <>
                  <span className="text-2xl font-cinzel font-extrabold text-amber-950">
                    {result === 'A' ? 'HEADS' : 'TAILS'}
                  </span>
                  <span className="text-[10px] font-mono text-amber-900 tracking-tighter">
                    {result === 'A' ? 'Option A' : 'Option B'}
                  </span>
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6 text-amber-950 mb-0.5" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-950">
                    Sunbeam
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Outcome Announcement */}
          {result && !isFlipping && (
            <div className="mt-4 text-center animate-in zoom-in-95 duration-200">
              <span className="text-xs font-mono text-gray-400">Oracle Outcome:</span>
              <h4 className="text-lg font-bold text-amber-300">
                {result === 'A' ? optionA : optionB}
              </h4>
              <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
                Did you feel relieved or disappointed when this landed? If disappointed, you know your true answer is the alternative.
              </p>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="flex gap-3">
          <button
            onClick={handleFlip}
            disabled={isFlipping}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-gray-950 font-semibold flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.98] transition disabled:opacity-50"
          >
            <RotateCw className={`w-4 h-4 ${isFlipping ? 'animate-spin' : ''}`} />
            {isFlipping ? 'Flipping through the Aethers...' : flippedCount > 0 ? 'Flip Again' : 'Toss the Sunbeam Coin'}
          </button>
        </div>
      </div>
    </div>
  );
};
