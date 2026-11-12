import React, { useState } from 'react';
import { SWOTAnalysisItem, DecisionOption } from '../types';
import { Shield, AlertCircle, Compass, Zap, Sparkles } from 'lucide-react';

interface SWOTAnalysisViewProps {
  swotData: SWOTAnalysisItem[];
  options: DecisionOption[];
}

export const SWOTAnalysisView: React.FC<SWOTAnalysisViewProps> = ({
  swotData,
  options,
}) => {
  const [activeOptionId, setActiveOptionId] = useState<string>(
    swotData[0]?.optionId || ''
  );

  const activeSWOT = swotData.find((s) => s.optionId === activeOptionId) || swotData[0];

  return (
    <div className="space-y-6">
      {/* Option selector pill tabs */}
      <div className="p-4 rounded-xl bg-gray-900 border border-gray-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-semibold text-white">
            Strategic SWOT Matrix (Internal & External Audit)
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {swotData.map((s) => (
            <button
              key={s.optionId}
              onClick={() => setActiveOptionId(s.optionId)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                activeOptionId === s.optionId
                  ? 'bg-amber-500 text-gray-950 shadow-md shadow-amber-500/20'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-750'
              }`}
            >
              {s.optionName}
            </button>
          ))}
        </div>
      </div>

      {activeSWOT && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* Strategic Takeaway Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/40 via-gray-900 to-amber-950/20 border border-amber-500/30 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-semibold block mb-0.5">
                Strategic Takeaway for {activeSWOT.optionName}
              </span>
              <p className="text-xs text-gray-200 leading-relaxed font-medium">
                {activeSWOT.strategicTakeaway}
              </p>
            </div>
          </div>

          {/* 2x2 Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Strengths (Internal Positives) */}
            <div className="p-5 rounded-2xl bg-gradient-to-b from-emerald-950/20 to-gray-900/90 border border-emerald-500/30 shadow-lg space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 border-b border-emerald-500/20 pb-2">
                <Shield className="w-4 h-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider">
                  Strengths (Internal Advantages)
                </h4>
              </div>
              <ul className="space-y-2 text-xs text-gray-300">
                {activeSWOT.strengths.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses (Internal Challenges) */}
            <div className="p-5 rounded-2xl bg-gradient-to-b from-amber-950/20 to-gray-900/90 border border-amber-500/30 shadow-lg space-y-3">
              <div className="flex items-center gap-2 text-amber-400 border-b border-amber-500/20 pb-2">
                <AlertCircle className="w-4 h-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider">
                  Weaknesses (Internal Vulnerabilities)
                </h4>
              </div>
              <ul className="space-y-2 text-xs text-gray-300">
                {activeSWOT.weaknesses.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Opportunities (External Tailwinds) */}
            <div className="p-5 rounded-2xl bg-gradient-to-b from-cyan-950/20 to-gray-900/90 border border-cyan-500/30 shadow-lg space-y-3">
              <div className="flex items-center gap-2 text-cyan-400 border-b border-cyan-500/20 pb-2">
                <Zap className="w-4 h-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider">
                  Opportunities (External Upsides)
                </h4>
              </div>
              <ul className="space-y-2 text-xs text-gray-300">
                {activeSWOT.opportunities.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Threats (External Risks) */}
            <div className="p-5 rounded-2xl bg-gradient-to-b from-rose-950/20 to-gray-900/90 border border-rose-500/30 shadow-lg space-y-3">
              <div className="flex items-center gap-2 text-rose-400 border-b border-rose-500/20 pb-2">
                <AlertCircle className="w-4 h-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider">
                  Threats (External Hazards)
                </h4>
              </div>
              <ul className="space-y-2 text-xs text-gray-300">
                {activeSWOT.threats.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
