import React, { useState } from 'react';
import {
  WeightedCriteria,
  OptionScoreItem,
  DecisionOption,
  ResearchFrameworksData,
} from '../types';
import {
  calculateWeightedScores,
  calculateCriteriaDifferences,
} from '../utils/scoring';
import {
  Sliders,
  Plus,
  Trash2,
  RotateCcw,
  Trophy,
  Check,
  AlertTriangle,
  Scale,
  ShieldAlert,
  ArrowUpDown,
} from 'lucide-react';

interface WeightedScoringViewProps {
  initialCriteria: WeightedCriteria[];
  initialOptionScores: OptionScoreItem[];
  options: DecisionOption[];
  researchFrameworks: ResearchFrameworksData;
}

export const WeightedScoringView: React.FC<WeightedScoringViewProps> = ({
  initialCriteria,
  initialOptionScores,
  options,
  researchFrameworks,
}) => {
  const [criteria, setCriteria] = useState<WeightedCriteria[]>(
    initialCriteria.map((c) => ({
      ...c,
      aspirationFloor: c.aspirationFloor ?? 5,
      christensenRole: c.christensenRole ?? 'Motivator',
    }))
  );
  const [optionScores, setOptionScores] = useState<OptionScoreItem[]>(initialOptionScores);

  // Behavioral engine controls (Kahneman & Cialdini)
  const [lossAversionLambda, setLossAversionLambda] = useState<number>(2.0);
  const [applyCialdiniDebias, setApplyCialdiniDebias] = useState<boolean>(true);
  const [sortByDivergence, setSortByDivergence] = useState<boolean>(false);

  // Add custom criterion form
  const [newCritName, setNewCritName] = useState('');
  const [newCritDesc, setNewCritDesc] = useState('');
  const [newCritWeight, setNewCritWeight] = useState(7);
  const [newCritFloor, setNewCritFloor] = useState(5);
  const [newCritRole, setNewCritRole] = useState<'Motivator' | 'Hygiene'>('Motivator');
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Compute multi-framework scores
  const scoreResults = calculateWeightedScores(criteria, optionScores, {
    lossAversionLambda,
    applyCialdiniDebias,
    cialdiniBiases: researchFrameworks.cialdiniInfluenceAudit.optionBiases,
    trompenaarsCoordinates: researchFrameworks.trompenaarsHampdenTurner.optionCoordinates,
  });

  const criteriaDiffs = calculateCriteriaDifferences(criteria, optionScores);

  const linearWinner = scoreResults.find((s) => s.isWinner);
  const satisficingWinner = scoreResults.find((s) => s.isSatisficingWinner);
  const prospectWinner = scoreResults.find((s) => s.isProspectWinner);
  const debiasedWinner = scoreResults.find((s) => s.isDebiasedWinner);

  const modelsDiverge =
    linearWinner &&
    satisficingWinner &&
    prospectWinner &&
    debiasedWinner &&
    new Set([
      linearWinner.optionId,
      satisficingWinner.optionId,
      prospectWinner.optionId,
      debiasedWinner.optionId,
    ]).size > 1;

  // Handlers
  const handleWeightChange = (critId: string, newWeight: number) => {
    setCriteria((prev) =>
      prev.map((c) => (c.id === critId ? { ...c, defaultWeight: newWeight } : c))
    );
  };

  const handleFloorChange = (critId: string, newFloor: number) => {
    setCriteria((prev) =>
      prev.map((c) => (c.id === critId ? { ...c, aspirationFloor: newFloor } : c))
    );
  };

  const handleRoleToggle = (critId: string) => {
    setCriteria((prev) =>
      prev.map((c) =>
        c.id === critId
          ? { ...c, christensenRole: c.christensenRole === 'Hygiene' ? 'Motivator' : 'Hygiene' }
          : c
      )
    );
  };

  const handleScoreChange = (optId: string, critId: string, newScore: number) => {
    setOptionScores((prev) =>
      prev.map((opt) => {
        if (opt.optionId !== optId) return opt;
        const existingScoreIdx = opt.scores.findIndex((s) => s.criteriaId === critId);
        const updatedScores = [...opt.scores];
        if (existingScoreIdx >= 0) {
          updatedScores[existingScoreIdx] = {
            ...updatedScores[existingScoreIdx],
            score: newScore,
          };
        } else {
          updatedScores.push({
            criteriaId: critId,
            score: newScore,
            rationale: 'User adjusted score',
          });
        }
        return { ...opt, scores: updatedScores };
      })
    );
  };

  const handleAddCriterion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCritName.trim()) return;

    const newId = `crit-user-${Date.now()}`;
    const newCrit: WeightedCriteria = {
      id: newId,
      name: newCritName.trim(),
      description: newCritDesc.trim() || 'Custom user evaluation factor',
      defaultWeight: Number(newCritWeight) || 5,
      aspirationFloor: Number(newCritFloor) || 5,
      christensenRole: newCritRole,
    };

    setCriteria((prev) => [...prev, newCrit]);

    setOptionScores((prev) =>
      prev.map((opt) => ({
        ...opt,
        scores: [
          ...opt.scores,
          {
            criteriaId: newId,
            score: 6,
            rationale: 'Initial balanced score for custom factor',
          },
        ],
      }))
    );

    setNewCritName('');
    setNewCritDesc('');
    setNewCritWeight(7);
    setNewCritFloor(5);
    setNewCritRole('Motivator');
    setIsAddingNew(false);
  };

  const handleDeleteCriterion = (critId: string) => {
    setCriteria((prev) => prev.filter((c) => c.id !== critId));
    setOptionScores((prev) =>
      prev.map((opt) => ({
        ...opt,
        scores: opt.scores.filter((s) => s.criteriaId !== critId),
      }))
    );
  };

  const handleResetToBaseline = () => {
    setCriteria(
      initialCriteria.map((c) => ({
        ...c,
        aspirationFloor: c.aspirationFloor ?? 5,
        christensenRole: c.christensenRole ?? 'Motivator',
      }))
    );
    setOptionScores(initialOptionScores);
    setLossAversionLambda(2.0);
    setApplyCialdiniDebias(true);
  };

  const orderedCriteria = sortByDivergence
    ? [...criteria].sort((a, b) => {
        const diffA = criteriaDiffs.find((d) => d.criterionId === a.id)?.weightedImpactDelta ?? 0;
        const diffB = criteriaDiffs.find((d) => d.criterionId === b.id)?.weightedImpactDelta ?? 0;
        return diffB - diffA;
      })
    : criteria;

  return (
    <div className="space-y-6">
      {/* Header & Behavioral Calibration Controls */}
      <div className="p-5 rounded-2xl bg-gray-900 border border-gray-800 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              <h3 className="text-base font-semibold text-white">
                Multi-Theory Decision Calculus Engine
              </h3>
            </div>
            <p className="text-xs text-gray-400 max-w-2xl leading-relaxed">
              Combines classical weighted maximizing with Herbert Simon’s Satisficing Floors, Kahneman’s Prospect Theory loss aversion, Cialdini’s influence de-biasing, and Christensen’s Motivator/Hygiene split.
            </p>
          </div>

          <button
            onClick={handleResetToBaseline}
            className="flex items-center gap-1.5 px-3 py-2 text-xs text-gray-300 hover:text-amber-300 bg-gray-950 hover:bg-gray-850 rounded-lg border border-gray-800 transition shrink-0 whitespace-nowrap self-start lg:self-auto cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Calibration
          </button>
        </div>

        {/* Calibration Controls Strip */}
        <div className="pt-3 border-t border-gray-800 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="text-gray-300 font-medium whitespace-nowrap">
                Kahneman Loss Aversion (λ):
              </span>
              <input
                type="range"
                min="1.0"
                max="2.5"
                step="0.1"
                value={lossAversionLambda}
                onChange={(e) => setLossAversionLambda(Number(e.target.value))}
                className="w-28 accent-amber-500 cursor-pointer"
              />
              <span className="font-mono tabular-nums font-bold text-amber-400 w-10">
                {lossAversionLambda.toFixed(1)}x
              </span>
            </div>

            <button
              type="button"
              onClick={() => setApplyCialdiniDebias(!applyCialdiniDebias)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition whitespace-nowrap cursor-pointer ${
                applyCialdiniDebias
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                  : 'bg-gray-950 border-gray-800 text-gray-400 hover:text-gray-200'
              }`}
            >
              Cialdini Bias Adjustment: {applyCialdiniDebias ? 'Active' : 'Off'}
            </button>
          </div>

          <button
            type="button"
            onClick={() => setSortByDivergence(!sortByDivergence)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition whitespace-nowrap cursor-pointer ${
              sortByDivergence
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                : 'bg-gray-950 border-gray-800 text-gray-400 hover:text-gray-200'
            }`}
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            {sortByDivergence ? 'Sorted by Highest Gap' : 'Sort by Difference Gap'}
          </button>
        </div>
      </div>

      {/* Model Divergence Alert if Frameworks Disagree */}
      {modelsDiverge && (
        <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 flex items-start gap-3 text-xs">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-semibold text-amber-300">
              Analytical Tension Detected Across Decision Frameworks
            </div>
            <p className="text-gray-300 leading-relaxed">
              Linear maximizing favors <strong className="text-white">{linearWinner?.optionName}</strong>, while{' '}
              {prospectWinner?.optionId !== linearWinner?.optionId && (
                <span>
                  Kahneman Prospect Theory (λ={lossAversionLambda.toFixed(1)}x) shifts toward{' '}
                  <strong className="text-white">{prospectWinner?.optionName}</strong>{' '}
                </span>
              )}
              {satisficingWinner?.optionId !== linearWinner?.optionId && (
                <span>
                  and Simon’s Satisficing Check favors{' '}
                  <strong className="text-white">{satisficingWinner?.optionName}</strong>{' '}
                </span>
              )}
              due to threshold floors or asymmetric downside sensitivity. Inspect the failing floors below or explore the Research & Paradox Lab to reconcile both poles.
            </p>
          </div>
        </div>
      )}

      {/* Multi-Framework Comparison Leaderboard */}
      <div className="p-5 rounded-2xl bg-gray-900 border border-gray-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-800 pb-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <h4 className="text-sm font-semibold text-white">
              Multi-Framework Option Comparison
            </h4>
          </div>
          {linearWinner && (
            <span className="text-xs text-gray-400 font-mono tabular-nums">
              Linear Lead: {linearWinner.optionName} (+{linearWinner.scoreDifference}% margin)
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {scoreResults.map((result, idx) => {
            const optMeta = options.find((o) => o.id === result.optionId);
            return (
              <div
                key={result.optionId}
                className={`p-4 rounded-xl border transition-colors space-y-4 ${
                  result.isWinner
                    ? 'bg-gray-950/80 border-amber-500/50'
                    : 'bg-gray-950/40 border-gray-800'
                }`}
              >
                {/* Option Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span className="font-mono">Rank #{idx + 1}</span>
                      <span aria-hidden="true">·</span>
                      <span className="truncate">{optMeta?.tagline || 'Option Candidate'}</span>
                    </div>
                    <h5 className="text-base font-bold text-white mt-0.5 truncate">
                      {result.optionName}
                    </h5>
                  </div>
                  <div className="text-right shrink-0">
                    <div
                      className={`text-2xl font-bold font-mono tabular-nums ${
                        result.isWinner ? 'text-amber-400' : 'text-gray-200'
                      }`}
                    >
                      {result.percentage}%
                    </div>
                    <div className="text-[11px] text-gray-400 font-mono tabular-nums">
                      {result.totalWeightedScore} / {result.maxPossibleScore} pts
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 rounded-full ${
                      result.isWinner ? 'bg-amber-400' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(0, result.percentage))}%` }}
                  />
                </div>

                {/* 4-Column Multi-Theory Metrics Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-gray-800/80 text-xs">
                  <div>
                    <div className="text-[11px] text-gray-400">Simon Floors</div>
                    <div
                      className={`font-mono tabular-nums font-semibold mt-0.5 flex items-center gap-1 ${
                        result.clearsAllFloors ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {result.clearsAllFloors ? (
                        <Check className="w-3.5 h-3.5 shrink-0" />
                      ) : (
                        <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                      )}
                      {result.floorsCleared}/{result.totalFloors} Pass
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] text-gray-400">Kahneman Utility</div>
                    <div className="font-mono tabular-nums font-semibold text-gray-200 mt-0.5">
                      {result.prospectAdjustedScore}%
                      {result.isProspectWinner && (
                        <span className="text-amber-400 ml-1 text-[10px]">Lead</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] text-gray-400">Cialdini De-Biased</div>
                    <div className="font-mono tabular-nums font-semibold text-gray-200 mt-0.5">
                      {result.debiasedScore}%
                      {result.biasPenaltyApplied > 0 && (
                        <span className="text-gray-400 ml-1 text-[10px]">
                          (-{result.biasPenaltyApplied})
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] text-gray-400">Trompenaars Helix</div>
                    <div className="font-mono tabular-nums font-semibold text-cyan-300 mt-0.5">
                      {result.reconciliationIndex}%
                    </div>
                  </div>
                </div>

                {/* Christensen Split & Simon Floor Failure Diagnostics */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] pt-2 border-t border-gray-800/60 text-gray-400">
                  <div className="font-mono tabular-nums">
                    Christensen Motivators:{' '}
                    <span className="text-emerald-300 font-semibold">{result.motivatorScore}%</span>
                    <span className="mx-1.5" aria-hidden="true">·</span>
                    Hygiene:{' '}
                    <span className="text-amber-300 font-semibold">{result.hygieneScore}%</span>
                  </div>

                  {!result.clearsAllFloors && (
                    <div className="text-rose-300">
                      Below floor on:{' '}
                      {result.failedFloors
                        .map((f) => `${f.criterionName} (${f.score}<${f.floor})`)
                        .join(', ')}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Criteria Divergence Diagnostic Table */}
      <div className="p-5 rounded-2xl bg-gray-900 border border-gray-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-amber-400" />
            <h4 className="text-sm font-semibold text-white">
              Where the Dilemma Diverges (Weighted Difference Breakdown)
            </h4>
          </div>
          <span className="text-xs text-gray-400">Ranked by weighted impact gap</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400">
                <th className="py-2 pr-3 font-medium">Criterion</th>
                <th className="py-2 px-3 font-medium">Christensen Role</th>
                <th className="py-2 px-3 font-medium text-right">Weight</th>
                <th className="py-2 px-3 font-medium text-right">Simon Floor</th>
                <th className="py-2 px-3 font-medium text-right">Raw Gap (Δ)</th>
                <th className="py-2 px-3 font-medium text-right">Weighted Gap</th>
                <th className="py-2 pl-3 font-medium">Advantage & Signal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {[...criteriaDiffs]
                .sort((a, b) => b.weightedImpactDelta - a.weightedImpactDelta)
                .map((diff) => (
                  <tr key={diff.criterionId} className="hover:bg-gray-950/40">
                    <td className="py-2.5 pr-3 font-medium text-gray-200">
                      {diff.criterionName}
                    </td>
                    <td className="py-2.5 px-3 text-gray-400">{diff.christensenRole}</td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums text-gray-300">
                      {diff.weight}/10
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums text-gray-300">
                      ≥ {diff.aspirationFloor}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums font-semibold text-amber-300">
                      {diff.spreadDelta} pts
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums font-bold text-white">
                      {diff.weightedImpactDelta}
                    </td>
                    <td className="py-2.5 pl-3">
                      <span className={diff.isTie ? 'text-gray-400' : 'text-emerald-400 font-medium'}>
                        {diff.isTie ? 'Dead Tie' : diff.leaderOptionName}
                      </span>
                      {diff.hasFloorViolation && (
                        <span className="ml-2 text-rose-400 font-mono text-[11px]">
                          · Floor Breached
                        </span>
                      )}
                      {diff.hasLossSpike && (
                        <span className="ml-2 text-amber-400 font-mono text-[11px]">
                          · Loss-Aversion Spike
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Criteria Breakdown & Interactive Sliders */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="text-sm font-semibold text-gray-200">
            Interactive Weights, Simon Aspiration Floors & Option Ratings
          </h4>
          <button
            onClick={() => setIsAddingNew(!isAddingNew)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 rounded-lg border border-amber-500/30 transition cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Custom Criterion
          </button>
        </div>

        {/* Add custom criterion form */}
        {isAddingNew && (
          <form
            onSubmit={handleAddCriterion}
            className="p-4 rounded-xl bg-gray-900 border border-amber-500/30 space-y-3"
          >
            <div className="flex items-center justify-between text-xs font-semibold text-amber-400">
              <span>Define New Decision Factor</span>
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Factor Name (e.g., Family Relocation Stress)"
                value={newCritName}
                onChange={(e) => setNewCritName(e.target.value)}
                required
                className="px-3 py-2 text-xs rounded-lg bg-gray-950 border border-gray-700 text-white focus:outline-none focus:border-amber-400"
              />
              <input
                type="text"
                placeholder="Description / Why it matters to you"
                value={newCritDesc}
                onChange={(e) => setNewCritDesc(e.target.value)}
                className="px-3 py-2 text-xs rounded-lg bg-gray-950 border border-gray-700 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-1 text-xs">
              <div className="flex items-center gap-3">
                <span className="text-gray-300">
                  Weight: <strong className="text-amber-400 font-mono">{newCritWeight}/10</strong>
                </span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={newCritWeight}
                  onChange={(e) => setNewCritWeight(Number(e.target.value))}
                  className="w-24 accent-amber-500"
                />
              </div>

              <div className="flex items-center gap-3">
                <span className="text-gray-300">
                  Simon Floor: <strong className="text-emerald-400 font-mono">≥{newCritFloor}</strong>
                </span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={newCritFloor}
                  onChange={(e) => setNewCritFloor(Number(e.target.value))}
                  className="w-24 accent-emerald-500"
                />
              </div>

              <select
                value={newCritRole}
                onChange={(e) => setNewCritRole(e.target.value as 'Motivator' | 'Hygiene')}
                className="px-2.5 py-1.5 rounded-lg bg-gray-950 border border-gray-700 text-gray-200 text-xs"
              >
                <option value="Motivator">Christensen: Motivator</option>
                <option value="Hygiene">Christensen: Hygiene</option>
              </select>

              <button
                type="submit"
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-gray-950 font-semibold text-xs rounded-lg transition cursor-pointer"
              >
                Save Factor
              </button>
            </div>
          </form>
        )}

        {/* List of criteria rows */}
        <div className="space-y-3">
          {orderedCriteria.map((crit) => {
            const diffMeta = criteriaDiffs.find((d) => d.criterionId === crit.id);
            const floor = crit.aspirationFloor ?? 5;

            return (
              <div
                key={crit.id}
                className="p-4 rounded-xl bg-gray-900 border border-gray-800 space-y-3"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-gray-800/80 pb-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="text-sm font-semibold text-white">
                        {crit.name}
                      </span>
                      <span aria-hidden="true" className="text-gray-600">·</span>
                      <button
                        type="button"
                        onClick={() => handleRoleToggle(crit.id)}
                        className="text-xs text-gray-400 hover:text-amber-300 underline decoration-dotted cursor-pointer"
                        title="Toggle Christensen Motivator vs Hygiene classification"
                      >
                        {crit.christensenRole === 'Hygiene'
                          ? 'Christensen Hygiene Factor'
                          : 'Christensen Motivator'}
                      </button>
                      {diffMeta && (
                        <>
                          <span aria-hidden="true" className="text-gray-600">·</span>
                          <span className="font-mono tabular-nums text-amber-400">
                            Gap Δ {diffMeta.spreadDelta}
                          </span>
                        </>
                      )}
                    </div>
                    <p className="text-xs text-gray-400">{crit.description}</p>
                  </div>

                  {/* Weight & Simon Aspiration Floor Sliders */}
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2 bg-gray-950 px-3 py-1.5 rounded-lg border border-gray-800">
                      <span className="text-xs text-gray-400">Weight:</span>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={crit.defaultWeight}
                        onChange={(e) => handleWeightChange(crit.id, Number(e.target.value))}
                        className="w-20 accent-amber-500 cursor-pointer"
                      />
                      <span className="text-xs font-mono tabular-nums font-bold text-amber-400 w-9 text-right">
                        {crit.defaultWeight}/10
                      </span>
                    </div>

                    <div className="flex items-center gap-2 bg-gray-950 px-3 py-1.5 rounded-lg border border-gray-800">
                      <span className="text-xs text-gray-400">Simon Floor:</span>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={floor}
                        onChange={(e) => handleFloorChange(crit.id, Number(e.target.value))}
                        className="w-20 accent-emerald-500 cursor-pointer"
                      />
                      <span className="text-xs font-mono tabular-nums font-bold text-emerald-400 w-7 text-right">
                        ≥{floor}
                      </span>
                    </div>

                    {criteria.length > 2 && (
                      <button
                        onClick={() => handleDeleteCriterion(crit.id)}
                        className="text-gray-500 hover:text-red-400 p-1.5 transition cursor-pointer"
                        title="Remove criterion"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Individual option rating sliders */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                  {optionScores.map((opt) => {
                    const scoreObj = opt.scores.find((s) => s.criteriaId === crit.id);
                    const currentScore = scoreObj ? scoreObj.score : 5;
                    const belowFloor = currentScore < floor;

                    return (
                      <div
                        key={opt.optionId}
                        className={`p-3 rounded-lg border text-xs space-y-2 ${
                          belowFloor
                            ? 'bg-rose-950/20 border-rose-500/40'
                            : 'bg-gray-950/60 border-gray-800/80'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-gray-200 truncate">
                            {opt.optionName}
                          </span>
                          <div className="flex items-center gap-2 shrink-0">
                            {belowFloor && (
                              <span className="text-[11px] font-medium text-rose-400">
                                Below Floor
                              </span>
                            )}
                            <span
                              className={`font-mono tabular-nums font-bold ${
                                belowFloor ? 'text-rose-400' : 'text-amber-400'
                              }`}
                            >
                              {currentScore}/10
                            </span>
                          </div>
                        </div>

                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={currentScore}
                          onChange={(e) =>
                            handleScoreChange(opt.optionId, crit.id, Number(e.target.value))
                          }
                          className={`w-full cursor-pointer ${
                            belowFloor ? 'accent-rose-500' : 'accent-amber-500'
                          }`}
                        />

                        {scoreObj?.rationale && (
                          <p className="text-[11px] text-gray-400 leading-snug">
                            {scoreObj.rationale}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
