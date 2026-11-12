import React from 'react';
import { MentalModelsData, DecisionOption } from '../types';
import { Clock, HeartHandshake, DoorOpen, Sparkles, Coins, ArrowRight } from 'lucide-react';

interface MentalModelsViewProps {
  mentalModels: MentalModelsData;
  options: DecisionOption[];
  onOpenCoinToss: () => void;
}

export const MentalModelsView: React.FC<MentalModelsViewProps> = ({
  mentalModels,
  options,
  onOpenCoinToss,
}) => {
  return (
    <div className="space-y-6">
      {/* Intro banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-gray-900 to-amber-900/20 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-amber-500/20 text-amber-400">
              <Sparkles className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-semibold text-white">
              The Tie-Breaker Mental Models & Intuition Oracles
            </h3>
          </div>
          <p className="text-xs text-gray-300 max-w-xl">
            When analytical data produces a dead tie, cognitive clarity comes from zooming out across time, regret, reversibility, and subconscious truth.
          </p>
        </div>

        <button
          onClick={onOpenCoinToss}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-gray-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition active:scale-95 shrink-0"
        >
          <Coins className="w-4 h-4" />
          Launch Gut Check Coin Flip
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Model 1: The 10-10-10 Rule */}
        <div className="p-5 rounded-2xl bg-gray-900 border border-gray-800 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-amber-400 border-b border-gray-800 pb-3">
            <Clock className="w-4 h-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider">
              1. The 10-10-10 Temporal Horizon
            </h4>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-gray-950/60 border border-gray-800">
              <span className="font-mono text-amber-400 font-semibold block mb-0.5">
                In 10 Minutes:
              </span>
              <p className="text-gray-300 leading-relaxed">
                {mentalModels.rule101010.tenMinutes}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-gray-950/60 border border-gray-800">
              <span className="font-mono text-teal-400 font-semibold block mb-0.5">
                In 10 Months:
              </span>
              <p className="text-gray-300 leading-relaxed">
                {mentalModels.rule101010.tenMonths}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-gray-950/60 border border-gray-800">
              <span className="font-mono text-emerald-400 font-semibold block mb-0.5">
                In 10 Years:
              </span>
              <p className="text-gray-300 leading-relaxed">
                {mentalModels.rule101010.tenYears}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200">
              <strong className="block text-amber-300 mb-0.5">Synthesis:</strong>
              {mentalModels.rule101010.synthesis}
            </div>
          </div>
        </div>

        {/* Model 2: Regret Minimization Framework */}
        <div className="p-5 rounded-2xl bg-gray-900 border border-gray-800 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-rose-400 border-b border-gray-800 pb-3">
            <HeartHandshake className="w-4 h-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider">
              2. Regret Minimization (The 80-Year-Old Self)
            </h4>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-gray-950/60 border border-gray-800">
              <span className="font-mono text-rose-400 font-semibold block mb-0.5">
                Reflection at Age 80:
              </span>
              <p className="text-gray-300 leading-relaxed italic">
                "{mentalModels.regretMinimization.reflectionAt80}"
              </p>
            </div>

            <div className="p-3 rounded-xl bg-gray-950/60 border border-gray-800">
              <span className="font-mono text-amber-400 font-semibold block mb-0.5">
                The Fatal Mistake to Avoid:
              </span>
              <p className="text-gray-300 leading-relaxed">
                {mentalModels.regretMinimization.biggestUnforgivableMistake}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-200">
              <strong className="block text-rose-300 mb-0.5">Recommendation:</strong>
              {mentalModels.regretMinimization.recommendation}
            </div>
          </div>
        </div>

        {/* Model 3: Reversibility (Type 1 vs Type 2 Doors) */}
        <div className="p-5 rounded-2xl bg-gray-900 border border-gray-800 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-cyan-400 border-b border-gray-800 pb-3">
            <DoorOpen className="w-4 h-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider">
              3. Door Classification & Reversibility Test
            </h4>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30">
              <span className="text-gray-300 font-medium">Door Classification:</span>
              <span className="font-mono font-bold text-cyan-300 px-2 py-0.5 bg-cyan-500/20 rounded">
                {mentalModels.reversibilityTest.doorType}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-gray-950/60 border border-gray-800">
              <span className="font-mono text-gray-400 font-semibold block mb-0.5">
                Exit & Unwinding Strategy:
              </span>
              <p className="text-gray-300 leading-relaxed">
                {mentalModels.reversibilityTest.unwindingStrategy}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-gray-950/60 border border-gray-800">
              <span className="font-mono text-gray-400 font-semibold block mb-0.5">
                Downside Risk Cap:
              </span>
              <p className="text-gray-300 leading-relaxed">
                {mentalModels.reversibilityTest.downsideCap}
              </p>
            </div>
          </div>
        </div>

        {/* Model 4: Subconscious Gut Truth */}
        <div className="p-5 rounded-2xl bg-gray-900 border border-gray-800 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-emerald-400 border-b border-gray-800 pb-3">
            <Sparkles className="w-4 h-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider">
              4. Subconscious Gut Clues
            </h4>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-gray-950/60 border border-gray-800">
              <span className="font-mono text-emerald-400 font-semibold block mb-0.5">
                The Coin Toss Principle:
              </span>
              <p className="text-gray-300 leading-relaxed">
                {mentalModels.gutCheckOracle.coinFlipInsight}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200">
              <strong className="block text-emerald-300 mb-0.5">Hidden Tell:</strong>
              {mentalModels.gutCheckOracle.subconsciousClues}
            </div>

            <button
              onClick={onOpenCoinToss}
              className="w-full py-2.5 rounded-xl bg-gray-800 hover:bg-gray-750 text-gray-200 font-semibold flex items-center justify-center gap-2 border border-gray-700 transition"
            >
              <Coins className="w-4 h-4 text-amber-400" />
              Flip Coin Between Options Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
