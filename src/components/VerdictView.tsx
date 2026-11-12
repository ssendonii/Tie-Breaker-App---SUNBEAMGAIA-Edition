import React, { useEffect } from 'react';
import { DecisionVerdict, DecisionOption } from '../types';
import { Award, CheckCircle2, AlertOctagon, Calendar, Sparkles, ArrowRight, Share2, Printer } from 'lucide-react';
import confetti from 'canvas-confetti';

interface VerdictViewProps {
  verdict: DecisionVerdict;
  options: DecisionOption[];
  onOpenConsult: () => void;
}

export const VerdictView: React.FC<VerdictViewProps> = ({
  verdict,
  options,
  onOpenConsult,
}) => {
  useEffect(() => {
    // Subtle celebratory confetti on initial render of verdict
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F59E0B', '#10B981', '#FBBF24'],
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* Champion Banner */}
      <div className="relative p-6 md:p-8 rounded-3xl bg-gradient-to-br from-amber-950/60 via-gray-900 to-emerald-950/50 border-2 border-amber-500/50 shadow-2xl overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 blur-3xl rounded-full pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
                <Award className="w-6 h-6" />
              </span>
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                  Definitive Tie-Breaker Verdict
                </span>
                <h3 className="text-xl md:text-2xl font-cinzel font-bold text-white">
                  The Oracle Chooses: {verdict.recommendedOptionName}
                </h3>
              </div>
            </div>

            {/* Confidence Gauge */}
            <div className="flex items-center gap-3 bg-gray-900/90 px-4 py-2 rounded-2xl border border-amber-500/30">
              <div className="text-right">
                <span className="text-[10px] uppercase font-mono text-gray-400 block">
                  Model Conviction
                </span>
                <span className="text-lg font-bold font-mono text-amber-400">
                  {verdict.confidencePercentage}%
                </span>
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-amber-400/30 flex items-center justify-center p-1">
                <div
                  className="w-full h-full rounded-full bg-gradient-to-tr from-amber-500 to-emerald-400"
                  style={{ opacity: verdict.confidencePercentage / 100 }}
                />
              </div>
            </div>
          </div>

          {/* Verdict Headline */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
            <p className="text-sm md:text-base font-semibold text-amber-200">
              "{verdict.verdictHeadline}"
            </p>
          </div>

          {/* Core Rationale */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">
              Strategic Rationale & Synthesis
            </h4>
            <p className="text-xs md:text-sm text-gray-200 leading-relaxed font-normal">
              {verdict.coreRationale}
            </p>
          </div>

          {/* Under What Conditions to Pivot */}
          <div className="p-4 rounded-xl bg-gray-950/70 border border-rose-500/20 space-y-1.5">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
              <AlertOctagon className="w-4 h-4" />
              Intellectual Honesty: When to Choose the Alternative
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              {verdict.whenToPickAlternative}
            </p>
          </div>
        </div>
      </div>

      {/* Immediate 48-Hour Action Plan */}
      <div className="p-6 rounded-2xl bg-gray-900 border border-gray-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-400" />
            <div>
              <h4 className="text-sm font-bold text-white">
                The 48-Hour Execution Protocol
              </h4>
              <p className="text-xs text-gray-400">
                Overcome decision inertia with three low-risk momentum steps
              </p>
            </div>
          </div>

          <button
            onClick={onOpenConsult}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Consult Sunbeam Oracle
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {verdict.immediateActions.map((step) => (
            <div
              key={step.step}
              className="p-4 rounded-xl bg-gray-950/60 border border-gray-800 hover:border-gray-700 transition flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-mono text-xs font-bold flex items-center justify-center">
                    #{step.step}
                  </span>
                  <span className="text-[11px] font-mono text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-500/10">
                    {step.timeframe}
                  </span>
                </div>
                <h5 className="text-xs font-bold text-gray-200 leading-snug">
                  {step.action}
                </h5>
              </div>

              <div className="text-[11px] text-gray-400 border-t border-gray-800/80 pt-2 italic">
                <strong>Why:</strong> {step.purpose}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
