import React, { useState } from 'react';
import { DecisionAnalysisResult } from '../types';
import { WeightedScoringView } from './WeightedScoringView';
import { ProsConsView } from './ProsConsView';
import { ComparisonTableView } from './ComparisonTableView';
import { SWOTAnalysisView } from './SWOTAnalysisView';
import { MentalModelsView } from './MentalModelsView';
import { ParadoxSynthesisView } from './ParadoxSynthesisView';
import { VerdictView } from './VerdictView';
import { getResearchFrameworks } from '../utils/researchFallback';
import {
  Sliders,
  ListCheck,
  Table,
  Compass,
  Sparkles,
  Award,
  Bookmark,
  Copy,
  Check,
  MessageSquareCode,
  ArrowLeft,
  GitMerge,
} from 'lucide-react';

interface DecisionDashboardProps {
  decision: DecisionAnalysisResult;
  onSaveToLibrary: () => void;
  isSaved: boolean;
  onOpenConsult: () => void;
  onOpenCoinToss: () => void;
  onReset: () => void;
}

export const DecisionDashboard: React.FC<DecisionDashboardProps> = ({
  decision,
  onSaveToLibrary,
  isSaved,
  onOpenConsult,
  onOpenCoinToss,
  onReset,
}) => {
  const [activeTab, setActiveTab] = useState<
    'scoring' | 'paradox' | 'proscons' | 'comparison' | 'swot' | 'mental' | 'verdict'
  >('scoring');
  const [copied, setCopied] = useState(false);

  const researchData = getResearchFrameworks(decision);

  interface TabItem {
    id: 'scoring' | 'paradox' | 'proscons' | 'comparison' | 'swot' | 'mental' | 'verdict';
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }

  const tabs: TabItem[] = [
    { id: 'scoring', label: 'Multi-Theory Scoring', icon: Sliders, badge: 'Interactive' },
    { id: 'paradox', label: 'Research & Paradox Lab', icon: GitMerge, badge: '7 Models' },
    { id: 'comparison', label: 'Divergence Matrix', icon: Table },
    { id: 'proscons', label: 'Pros & Cons Deep-Dive', icon: ListCheck },
    { id: 'swot', label: 'SWOT Analysis', icon: Compass },
    { id: 'mental', label: 'Tie-Breaker Models', icon: Sparkles },
    { id: 'verdict', label: 'Oracle Verdict & 48h Plan', icon: Award, badge: 'Winner' },
  ];

  const handleCopySummary = () => {
    const textReport = `# The Tie Breaker (SUNBEAMGAIA Edition)
## Decision Dossier: ${decision.title}

### Executive Synthesis:
${decision.summary}

### Paradox & Dilemma Reconciliation (Trompenaars, Hampden-Turner & Wendy K. Smith):
- Reconciled Apex: ${researchData.trompenaarsHampdenTurner.reconciledHelixName}
- Synthesis: ${researchData.trompenaarsHampdenTurner.reconciledSynthesis}
- Both/And Plan: ${researchData.wendySmithParadox.bothAndActionPlan}

### Behavioral & Rationality Audit (Simon, Cialdini, Christensen, Kahneman/Hahnemann):
- Simon Satisficing Rule: ${researchData.herbertSimonBounded.satisficingRecommendation}
- Christensen Core JTBD: ${researchData.christensenJTBD.coreJobToBeDone}
- Minimum-Dose Titration Probe: ${researchData.kahnemanHahnemann.hahnemannMinimumDoseTest}

### Definitive Verdict:
Winner: ${decision.verdict.recommendedOptionName} (${decision.verdict.confidencePercentage}% Confidence)
Headline: "${decision.verdict.verdictHeadline}"

Rationale:
${decision.verdict.coreRationale}

When to pick alternative:
${decision.verdict.whenToPickAlternative}

Immediate 48h Steps:
${decision.verdict.immediateActions.map((a) => `- Step ${a.step} [${a.timeframe}]: ${a.action} (Goal: ${a.purpose})`).join('\n')}
`;

    navigator.clipboard.writeText(textReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation & Dossier Overview */}
      <div className="p-6 rounded-3xl bg-gray-900 border border-gray-800 shadow-xl space-y-4 print-page">
        <div className="flex flex-wrap items-center justify-between gap-3 no-print">
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Analyze Another Dilemma
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySummary}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-800 hover:bg-gray-750 text-gray-300 border border-gray-700 transition"
              title="Copy Summary Markdown"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied Markdown' : 'Copy Report'}
            </button>

            <button
              onClick={onSaveToLibrary}
              disabled={isSaved}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                isSaved
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 cursor-default'
                  : 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 text-amber-300'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              {isSaved ? 'Saved in Library' : 'Save Dossier'}
            </button>

            <button
              onClick={onOpenConsult}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-gray-950 transition shadow-md shadow-amber-500/20"
            >
              <MessageSquareCode className="w-3.5 h-3.5" />
              Consult Oracle
            </button>
          </div>
        </div>

        {/* Title and summary */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
              Active Decision Dossier
            </span>
            <span className="text-xs text-gray-400 font-mono">
              {decision.options.length} Options Benchmarked
            </span>
          </div>

          <h2 className="text-xl md:text-2xl font-cinzel font-bold text-white leading-tight">
            {decision.title}
          </h2>

          <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-normal">
            {decision.summary}
          </p>
        </div>

        {/* Candidate options chips */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-800/80">
          {decision.options.map((opt, idx) => (
            <div
              key={opt.id}
              className="px-3 py-1.5 rounded-xl bg-gray-950/70 border border-gray-800 flex items-center gap-2"
            >
              <span className="w-5 h-5 rounded-md bg-amber-500/20 text-amber-400 font-mono text-[11px] font-bold flex items-center justify-center">
                {String.fromCharCode(65 + idx)}
              </span>
              <div>
                <span className="text-xs font-semibold text-white block">
                  {opt.name}
                </span>
                <span className="text-[10px] text-gray-400 block">{opt.tagline}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs Switcher Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-print">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-amber-500 text-gray-950 font-bold shadow-lg shadow-amber-500/20'
                  : 'bg-gray-900 text-gray-300 hover:bg-gray-850 hover:text-white border border-gray-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded ${
                    isActive
                      ? 'bg-gray-950/20 text-gray-950 font-bold'
                      : 'bg-amber-500/20 text-amber-400'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Tab Panel */}
      <div className="min-h-[500px]">
        {activeTab === 'scoring' && (
          <WeightedScoringView
            initialCriteria={decision.weightedScoring.criteria}
            initialOptionScores={decision.weightedScoring.optionScores}
            options={decision.options}
            researchFrameworks={researchData}
          />
        )}

        {activeTab === 'paradox' && (
          <ParadoxSynthesisView
            research={researchData}
            options={decision.options}
          />
        )}

        {activeTab === 'verdict' && (
          <VerdictView
            verdict={decision.verdict}
            options={decision.options}
            onOpenConsult={onOpenConsult}
          />
        )}

        {activeTab === 'proscons' && (
          <ProsConsView
            initialProsAndCons={decision.prosAndCons}
            options={decision.options}
          />
        )}

        {activeTab === 'comparison' && (
          <ComparisonTableView
            comparisonData={decision.comparisonTable}
            options={decision.options}
          />
        )}

        {activeTab === 'swot' && (
          <SWOTAnalysisView
            swotData={decision.swotAnalysis}
            options={decision.options}
          />
        )}

        {activeTab === 'mental' && (
          <MentalModelsView
            mentalModels={decision.mentalModels}
            options={decision.options}
            onOpenCoinToss={onOpenCoinToss}
          />
        )}
      </div>
    </div>
  );
};
