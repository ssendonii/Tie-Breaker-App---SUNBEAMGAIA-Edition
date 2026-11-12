import React from 'react';
import { Sun, Bookmark, Sparkles, Coins, PlusCircle, Printer } from 'lucide-react';

interface HeaderProps {
  onOpenPresets: () => void;
  onOpenSaved: () => void;
  onOpenCoinToss: () => void;
  onNewDilemma: () => void;
  savedCount: number;
  hasActiveDecision: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenPresets,
  onOpenSaved,
  onOpenCoinToss,
  onNewDilemma,
  savedCount,
  hasActiveDecision,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-gray-950/80 backdrop-blur-md border-b border-gray-800/80 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand identity */}
        <div
          onClick={onNewDilemma}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-400 to-emerald-500 p-0.5 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition">
            <div className="w-full h-full bg-gray-950 rounded-[10px] flex items-center justify-center">
              <Sun className="w-5 h-5 text-amber-400 animate-pulse" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-bold text-white tracking-wide font-cinzel">
                The Tie Breaker
              </h1>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
                SUNBEAMGAIA
              </span>
            </div>
            <p className="text-[11px] text-gray-400 hidden sm:block">
              Cognitive Decision Intelligence & Resolution Matrix
            </p>
          </div>
        </div>

        {/* Right utility buttons */}
        <div className="flex items-center gap-2">
          {hasActiveDecision && (
            <>
              <button
                onClick={onNewDilemma}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gray-300 hover:text-white bg-gray-900 hover:bg-gray-850 border border-gray-800 transition"
              >
                <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
                New Choice
              </button>

              <button
                onClick={handlePrint}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gray-300 hover:text-white bg-gray-900 hover:bg-gray-850 border border-gray-800 transition"
                title="Print or Save PDF"
              >
                <Printer className="w-3.5 h-3.5" />
                Print / PDF
              </button>
            </>
          )}

          <button
            onClick={onOpenCoinToss}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gray-300 hover:text-amber-300 bg-gray-900 hover:bg-gray-850 border border-gray-800 transition"
            title="Instant Coin Flip Gut Check"
          >
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Gut Flip</span>
          </button>

          <button
            onClick={onOpenPresets}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gray-300 hover:text-amber-300 bg-gray-900 hover:bg-gray-850 border border-gray-800 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Presets</span>
          </button>

          <button
            onClick={onOpenSaved}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gray-300 hover:text-white bg-gray-900 hover:bg-gray-850 border border-gray-800 transition relative"
          >
            <Bookmark className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Library</span>
            {savedCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-emerald-500 text-gray-950 font-mono text-[10px] font-bold flex items-center justify-center">
                {savedCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
