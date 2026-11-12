import React, { useState } from 'react';
import { ResearchFrameworksData, DecisionOption } from '../types';
import {
  Compass,
  GitMerge,
  Brain,
  Briefcase,
  Eye,
  FlaskConical,
  AlertCircle,
} from 'lucide-react';

interface ParadoxSynthesisViewProps {
  research: ResearchFrameworksData;
  options: DecisionOption[];
}

export const ParadoxSynthesisView: React.FC<ParadoxSynthesisViewProps> = ({
  research,
  options,
}) => {
  const [activeSection, setActiveSection] = useState<
    'all' | 'reconciliation' | 'behavioral' | 'jtbd'
  >('all');

  const tromp = research.trompenaarsHampdenTurner;
  const smith = research.wendySmithParadox;
  const simon = research.herbertSimonBounded;
  const cialdini = research.cialdiniInfluenceAudit;
  const christensen = research.christensenJTBD;
  const kahneman = research.kahnemanHahnemann;

  // Compute SVG coordinates inside a 320x320 plot area (padding 40)
  const plotMin = 44;
  const plotSize = 240;
  const toSvgX = (val: number) => plotMin + ((Math.min(10, Math.max(0, val)) / 10) * plotSize);
  const toSvgY = (val: number) =>
    plotMin + plotSize - ((Math.min(10, Math.max(0, val)) / 10) * plotSize);

  const optionColors = ['#F59E0B', '#10B981', '#38BDF8', '#F472B6', '#A78BFA'];

  const computeReconciliation = (x: number, y: number) => {
    const dist = Math.sqrt(Math.pow(10 - x, 2) + Math.pow(10 - y, 2));
    const maxDist = Math.sqrt(162); // (1,1) to (10,10)
    return Math.round((1 - dist / maxDist) * 1000) / 10;
  };

  return (
    <div className="space-y-6">
      {/* Section Header & Segmented Filter */}
      <div className="p-4 rounded-xl bg-gray-900 border border-gray-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <Compass className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <h3 className="text-sm font-semibold text-white">
              Decision Science & Paradox Reconciliation Lab
            </h3>
            <p className="text-xs text-gray-400">
              Synthesizing Trompenaars, Hampden-Turner, Wendy K. Smith, Herbert Simon, Christensen, Cialdini & Kahneman / Hahnemann
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1 p-1 bg-gray-950 rounded-lg border border-gray-800 text-xs">
          <button
            type="button"
            onClick={() => setActiveSection('all')}
            className={`px-3 py-1.5 rounded-md font-medium transition whitespace-nowrap cursor-pointer ${
              activeSection === 'all'
                ? 'bg-amber-500 text-gray-950 font-semibold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            All Frameworks
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('reconciliation')}
            className={`px-3 py-1.5 rounded-md font-medium transition whitespace-nowrap cursor-pointer ${
              activeSection === 'reconciliation'
                ? 'bg-amber-500 text-gray-950 font-semibold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Paradox & Reconciliation
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('behavioral')}
            className={`px-3 py-1.5 rounded-md font-medium transition whitespace-nowrap cursor-pointer ${
              activeSection === 'behavioral'
                ? 'bg-amber-500 text-gray-950 font-semibold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Bias & Behavioral Math
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('jtbd')}
            className={`px-3 py-1.5 rounded-md font-medium transition whitespace-nowrap cursor-pointer ${
              activeSection === 'jtbd'
                ? 'bg-amber-500 text-gray-950 font-semibold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Jobs-to-be-Done
          </button>
        </div>
      </div>

      {/* 1. Trompenaars & Hampden-Turner Dilemma Reconciliation Grid + Wendy K. Smith Paradox */}
      {(activeSection === 'all' || activeSection === 'reconciliation') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Interactive 2D Dilemma Grid (SVG) */}
          <div className="lg:col-span-6 p-6 rounded-2xl bg-gray-900 border border-gray-800 space-y-4 flex flex-col justify-between">
            <div className="space-y-1">
              <div className="text-xs font-medium text-amber-400">
                Trompenaars & Hampden-Turner
              </div>
              <h4 className="text-base font-bold text-white">
                Dilemma Reconciliation Grid (10 × 10 Helix)
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Either/or extremes trap you along the axes; weak compromise stalls at (5,5). True reconciliation connects both poles toward the synergistic (10,10) apex.
              </p>
            </div>

            {/* SVG Cartesian Reconciliation Plot */}
            <div className="flex justify-center py-2">
              <svg
                viewBox="0 0 330 330"
                className="w-full max-w-[330px] h-auto bg-gray-950 rounded-xl border border-gray-800"
                role="img"
                aria-label="Trompenaars and Hampden-Turner Dilemma Reconciliation Grid"
              >
                {/* Grid lines */}
                {[2, 4, 6, 8, 10].map((tick) => (
                  <g key={tick}>
                    <line
                      x1={toSvgX(tick)}
                      y1={toSvgY(0)}
                      x2={toSvgX(tick)}
                      y2={toSvgY(10)}
                      stroke="#1F2937"
                      strokeWidth="1"
                    />
                    <line
                      x1={toSvgX(0)}
                      y1={toSvgY(tick)}
                      x2={toSvgX(10)}
                      y2={toSvgY(tick)}
                      stroke="#1F2937"
                      strokeWidth="1"
                    />
                  </g>
                ))}

                {/* Main Axes */}
                <line
                  x1={toSvgX(0)}
                  y1={toSvgY(0)}
                  x2={toSvgX(10)}
                  y2={toSvgY(0)}
                  stroke="#4B5563"
                  strokeWidth="1.5"
                />
                <line
                  x1={toSvgX(0)}
                  y1={toSvgY(0)}
                  x2={toSvgX(0)}
                  y2={toSvgY(10)}
                  stroke="#4B5563"
                  strokeWidth="1.5"
                />

                {/* Compromise Diagonal (10,0) -> (0,10) */}
                <line
                  x1={toSvgX(0)}
                  y1={toSvgY(10)}
                  x2={toSvgX(10)}
                  y2={toSvgY(0)}
                  stroke="#374151"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />

                {/* Synergistic Helix Vectors from options to (10,10) */}
                {tromp.optionCoordinates.map((coord, idx) => (
                  <line
                    key={`vec-${coord.optionId}`}
                    x1={toSvgX(coord.poleXScore)}
                    y1={toSvgY(coord.poleYScore)}
                    x2={toSvgX(10)}
                    y2={toSvgY(10)}
                    stroke={optionColors[idx % optionColors.length]}
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                    opacity="0.65"
                  />
                ))}

                {/* Compromise Point (5,5) */}
                <circle cx={toSvgX(5)} cy={toSvgY(5)} r="5" fill="#6B7280" />
                <text
                  x={toSvgX(5) + 8}
                  y={toSvgY(5) + 12}
                  fill="#9CA3AF"
                  fontSize="9"
                  fontFamily="JetBrains Mono, monospace"
                >
                  Compromise (5,5)
                </text>

                {/* Reconciled Apex (10,10) */}
                <circle
                  cx={toSvgX(10)}
                  cy={toSvgY(10)}
                  r="8"
                  fill="#FBBF24"
                  fillOpacity="0.2"
                  stroke="#FBBF24"
                  strokeWidth="2"
                />
                <circle cx={toSvgX(10)} cy={toSvgY(10)} r="3.5" fill="#FBBF24" />
                <text
                  x={toSvgX(10) - 86}
                  y={toSvgY(10) - 10}
                  fill="#FDE68A"
                  fontSize="9.5"
                  fontWeight="bold"
                  fontFamily="JetBrains Mono, monospace"
                >
                  Helix Apex (10,10)
                </text>

                {/* Plotted Options */}
                {tromp.optionCoordinates.map((coord, idx) => {
                  const cx = toSvgX(coord.poleXScore);
                  const cy = toSvgY(coord.poleYScore);
                  const color = optionColors[idx % optionColors.length];
                  const labelX = coord.poleXScore > 6 ? cx - 64 : cx + 9;
                  const labelY = coord.poleYScore > 8 ? cy + 14 : cy - 8;
                  return (
                    <g key={coord.optionId}>
                      <circle
                        cx={cx}
                        cy={cy}
                        r="7"
                        fill={color}
                        stroke="#0C0F12"
                        strokeWidth="2"
                      />
                      <text
                        x={labelX}
                        y={labelY}
                        fill="#F3F4F6"
                        fontSize="10"
                        fontWeight="bold"
                      >
                        Option {String.fromCharCode(65 + idx)} ({coord.poleXScore.toFixed(1)},
                        {coord.poleYScore.toFixed(1)})
                      </text>
                    </g>
                  );
                })}

                {/* Axis Titles */}
                <text
                  x={plotMin + plotSize / 2}
                  y={312}
                  textAnchor="middle"
                  fill="#D1D5DB"
                  fontSize="10"
                  fontWeight="600"
                >
                  X: {tromp.poleXLabel.slice(0, 38)}
                </text>
                <text
                  x={16}
                  y={plotMin + plotSize / 2}
                  textAnchor="middle"
                  fill="#D1D5DB"
                  fontSize="10"
                  fontWeight="600"
                  transform={`rotate(-90 16 ${plotMin + plotSize / 2})`}
                >
                  Y: {tromp.poleYLabel.slice(0, 34)}
                </text>
              </svg>
            </div>

            {/* Option Coordinate Breakdown */}
            <div className="space-y-2 pt-2 border-t border-gray-800 text-xs">
              {tromp.optionCoordinates.map((coord, idx) => {
                const idxPct = computeReconciliation(coord.poleXScore, coord.poleYScore);
                const skew = Math.abs(coord.poleXScore - coord.poleYScore).toFixed(1);
                return (
                  <div
                    key={coord.optionId}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 py-1.5"
                  >
                    <div>
                      <span className="font-semibold text-white">
                        {String.fromCharCode(65 + idx)}. {coord.optionName}
                      </span>
                      <p className="text-[11px] text-gray-400">{coord.diagnosis}</p>
                    </div>
                    <div className="font-mono tabular-nums text-[11px] text-right shrink-0">
                      <span className="text-cyan-300 font-semibold">
                        Helix {idxPct}%
                      </span>
                      <span className="mx-1.5 text-gray-600">·</span>
                      <span className="text-gray-400">Skew {skew}</span>
                    </div>
                  </div>
                );
              })}

              <div className="pt-2 border-t border-gray-800/70">
                <div className="font-semibold text-amber-300">
                  Target Synthesis: {tromp.reconciledHelixName}
                </div>
                <p className="text-gray-300 mt-0.5 leading-relaxed">
                  {tromp.reconciledSynthesis}
                </p>
              </div>
            </div>
          </div>

          {/* Wendy K. Smith Paradox Theory & Both/And Architecture */}
          <div className="lg:col-span-6 p-6 rounded-2xl bg-gray-900 border border-gray-800 space-y-5 flex flex-col justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-medium text-emerald-400">
                <GitMerge className="w-4 h-4" />
                <span>Wendy K. Smith · Paradox Theory</span>
              </div>
              <h4 className="text-base font-bold text-white">
                Escaping the False Binary via "Both/And" Thinking
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Persistent competing demands cannot be eliminated once and for all. Breakthroughs come from honoring both poles through Differentiation and Integration.
              </p>
            </div>

            <div className="space-y-4 text-xs flex-1">
              <div className="pb-3 border-b border-gray-800">
                <div className="text-gray-400 font-medium mb-1">Core Persistent Tension</div>
                <p className="text-white font-medium leading-relaxed">{smith.coreTension}</p>
              </div>

              <div className="pb-3 border-b border-gray-800">
                <div className="text-rose-300 font-medium mb-1">Why Pure Either/Or Fails</div>
                <p className="text-gray-300 leading-relaxed">{smith.whyEitherOrFails}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-3 border-b border-gray-800">
                <div>
                  <div className="text-cyan-300 font-semibold mb-1">
                    01. Differentiation Move
                  </div>
                  <p className="text-gray-300 leading-relaxed">{smith.differentiationMove}</p>
                </div>
                <div>
                  <div className="text-emerald-300 font-semibold mb-1">
                    02. Integration Move
                  </div>
                  <p className="text-gray-300 leading-relaxed">{smith.integrationMove}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-950/25 border border-emerald-500/30">
                <div className="text-emerald-300 font-semibold mb-1">
                  Integrated "Both/And" Execution Strategy
                </div>
                <p className="text-gray-200 leading-relaxed">{smith.bothAndActionPlan}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Herbert Simon, Robert Cialdini & Kahneman / Hahnemann Behavioral Audit */}
      {(activeSection === 'all' || activeSection === 'behavioral') && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Herbert A. Simon: Bounded Rationality & Satisficing */}
          <div className="p-6 rounded-2xl bg-gray-900 border border-gray-800 space-y-4">
            <div className="space-y-1 border-b border-gray-800 pb-3">
              <div className="flex items-center gap-2 text-xs font-medium text-amber-400">
                <Brain className="w-4 h-4" />
                <span>Herbert A. Simon</span>
              </div>
              <h4 className="text-sm font-bold text-white">
                Bounded Rationality & Satisficing
              </h4>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="text-gray-400 font-medium mb-1">Information Boundary</div>
                <p className="text-gray-300 leading-relaxed">{simon.informationGapWarning}</p>
              </div>
              <div className="pt-2 border-t border-gray-800/70">
                <div className="text-emerald-300 font-medium mb-1">
                  Satisficing vs. Maximizing
                </div>
                <p className="text-gray-300 leading-relaxed">{simon.satisficingRecommendation}</p>
              </div>
              <div className="pt-2 border-t border-gray-800/70">
                <div className="text-amber-300 font-medium mb-1">Search Stopping Rule</div>
                <p className="text-gray-200 leading-relaxed">{simon.searchStoppingRule}</p>
              </div>
            </div>
          </div>

          {/* Robert Cialdini: Influence & Pre-suasion Distortion Audit */}
          <div className="p-6 rounded-2xl bg-gray-900 border border-gray-800 space-y-4">
            <div className="space-y-1 border-b border-gray-800 pb-3">
              <div className="flex items-center gap-2 text-xs font-medium text-rose-400">
                <Eye className="w-4 h-4" />
                <span>Robert Cialdini</span>
              </div>
              <h4 className="text-sm font-bold text-white">
                Influence & Pre-Suasion Bias Audit
              </h4>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-500/20 text-gray-200 leading-relaxed">
                <strong className="text-rose-300 block mb-0.5">Pre-Suasion Alert</strong>
                {cialdini.preSuasionFramingAlert}
              </div>

              <div className="space-y-3">
                {cialdini.optionBiases.map((bias) => (
                  <div
                    key={bias.optionId}
                    className="pt-2 border-t border-gray-800/70 space-y-1"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-white">{bias.optionName}</span>
                      <span className="font-mono tabular-nums text-rose-300 font-semibold">
                        -{bias.biasInflationPoints} pts inflation
                      </span>
                    </div>
                    <div className="text-[11px] text-amber-300/90">
                      Triggers: {bias.activeTriggers.join(' · ')}
                    </div>
                    <p className="text-gray-400 leading-relaxed">{bias.realityCheck}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Daniel Kahneman + Samuel Hahnemann */}
          <div className="p-6 rounded-2xl bg-gray-900 border border-gray-800 space-y-4">
            <div className="space-y-1 border-b border-gray-800 pb-3">
              <div className="flex items-center gap-2 text-xs font-medium text-cyan-400">
                <FlaskConical className="w-4 h-4" />
                <span>Kahneman & Hahnemannian Probe</span>
              </div>
              <h4 className="text-sm font-bold text-white">
                Prospect Theory, Outside View & Titration
              </h4>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="text-rose-300 font-medium mb-0.5">System 1 Cognitive Trap</div>
                <p className="text-gray-300 leading-relaxed">{kahneman.system1Trap}</p>
              </div>
              <div className="pt-2 border-t border-gray-800/70">
                <div className="text-cyan-300 font-medium mb-0.5">
                  System 2 Outside-View Base Rate
                </div>
                <p className="text-gray-300 leading-relaxed">
                  {kahneman.system2OutsideViewBaseRate}
                </p>
              </div>
              <div className="pt-2 border-t border-gray-800/70">
                <div className="text-amber-300 font-medium mb-0.5">Loss Aversion Asymmetry</div>
                <p className="text-gray-300 leading-relaxed">{kahneman.lossAversionInsight}</p>
              </div>
              <div className="p-3 rounded-lg bg-emerald-950/25 border border-emerald-500/30">
                <div className="text-emerald-300 font-semibold mb-0.5">
                  Minimum-Dose Titration Probe
                </div>
                <p className="text-gray-200 leading-relaxed">
                  {kahneman.hahnemannMinimumDoseTest}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Clayton M. Christensen Jobs-to-be-Done & Marginal Cost Audit */}
      {(activeSection === 'all' || activeSection === 'jtbd') && (
        <div className="p-6 rounded-2xl bg-gray-900 border border-gray-800 space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-gray-800 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-medium text-amber-400">
                <Briefcase className="w-4 h-4" />
                <span>Clayton M. Christensen · Jobs-to-be-Done & Motivation Theory</span>
              </div>
              <h4 className="text-base font-bold text-white">
                Core Job-to-be-Done & Marginal-Cost Trap Audit
              </h4>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pb-2 border-b border-gray-800/80">
            <div>
              <div className="text-gray-400 font-medium mb-1">
                The Real "Job" You Are Hiring This Decision to Do
              </div>
              <p className="text-sm text-white font-medium leading-relaxed">
                {christensen.coreJobToBeDone}
              </p>
            </div>
            <div>
              <div className="text-gray-400 font-medium mb-1">
                Hygiene Factors vs. True Motivators
              </div>
              <p className="text-gray-300 leading-relaxed">
                {christensen.hygieneVsMotivatorInsight}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {christensen.optionAudits.map((audit, idx) => (
              <div
                key={audit.optionId}
                className="p-4 rounded-xl bg-gray-950/60 border border-gray-800 space-y-3 text-xs"
              >
                <div className="font-bold text-sm text-white">
                  {String.fromCharCode(65 + idx)}. {audit.optionName}
                </div>

                <div>
                  <span className="text-emerald-300 font-medium block mb-0.5">
                    Functional Job Fit
                  </span>
                  <p className="text-gray-300 leading-relaxed">{audit.functionalJobFit}</p>
                </div>

                <div>
                  <span className="text-cyan-300 font-medium block mb-0.5">
                    Emotional & Social Job Fit
                  </span>
                  <p className="text-gray-300 leading-relaxed">{audit.emotionalSocialJobFit}</p>
                </div>

                <div className="pt-2 border-t border-gray-800/70 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-amber-300 font-semibold block">
                      Christensen Marginal-Cost Trap
                    </span>
                    <p className="text-gray-300 leading-relaxed">{audit.marginalCostTrap}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
