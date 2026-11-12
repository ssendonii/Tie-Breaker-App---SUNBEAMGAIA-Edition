import {
  WeightedCriteria,
  OptionScoreItem,
  CialdiniOptionBias,
  TrompenaarsOptionCoordinate,
} from '../types';

export interface FailedFloorDetail {
  criterionId: string;
  criterionName: string;
  score: number;
  floor: number;
  deficit: number;
}

export interface CalculatedOptionScore {
  optionId: string;
  optionName: string;
  // Linear Maximizing (Compensatory)
  totalWeightedScore: number;
  maxPossibleScore: number;
  percentage: number; // 0 to 100
  isWinner: boolean;
  scoreDifference: number;
  // Herbert Simon (Bounded Rationality / Satisficing)
  clearsAllFloors: boolean;
  floorsCleared: number;
  totalFloors: number;
  failedFloors: FailedFloorDetail[];
  bottleneckMargin: number; // min(score - floor) across all criteria
  isSatisficingWinner: boolean;
  // Kahneman Prospect Theory (Asymmetric Loss Aversion)
  prospectAdjustedScore: number; // 0 to 100
  isProspectWinner: boolean;
  // Robert Cialdini (Influence Bias Adjustment)
  biasPenaltyApplied: number;
  debiasedScore: number; // 0 to 100
  isDebiasedWinner: boolean;
  // Clayton Christensen (Motivator vs Hygiene)
  motivatorScore: number; // 0 to 100
  hygieneScore: number; // 0 to 100
  // Trompenaars & Hampden-Turner (Reconciliation Proximity to 10,10)
  reconciliationIndex: number; // 0 to 100
  polaritySkew: number; // |x - y|
}

export interface CriterionDifferenceMetric {
  criterionId: string;
  criterionName: string;
  weight: number;
  aspirationFloor: number;
  christensenRole: 'Motivator' | 'Hygiene';
  spreadDelta: number; // max - min raw score
  weightedImpactDelta: number; // weight * spreadDelta
  leaderOptionId: string | null;
  leaderOptionName: string;
  isTie: boolean;
  hasFloorViolation: boolean;
  hasLossSpike: boolean; // score <= 4 on high-weight criterion
}

export interface ScoringEngineOptions {
  lossAversionLambda?: number; // Default 2.0 (Kahneman & Tversky)
  applyCialdiniDebias?: boolean; // Default true
  cialdiniBiases?: CialdiniOptionBias[];
  trompenaarsCoordinates?: TrompenaarsOptionCoordinate[];
}

export function calculateWeightedScores(
  criteria: WeightedCriteria[],
  optionScores: OptionScoreItem[],
  engineOpts: ScoringEngineOptions = {}
): CalculatedOptionScore[] {
  const {
    lossAversionLambda = 2.0,
    applyCialdiniDebias = true,
    cialdiniBiases = [],
    trompenaarsCoordinates = [],
  } = engineOpts;

  const totalWeight = criteria.reduce((sum, c) => sum + (c.defaultWeight || 1), 0);
  const maxPossible = totalWeight * 10;

  if (totalWeight === 0 || maxPossible === 0) {
    return optionScores.map((opt) => ({
      optionId: opt.optionId,
      optionName: opt.optionName,
      totalWeightedScore: 0,
      maxPossibleScore: 0,
      percentage: 0,
      isWinner: false,
      scoreDifference: 0,
      clearsAllFloors: true,
      floorsCleared: 0,
      totalFloors: 0,
      failedFloors: [],
      bottleneckMargin: 0,
      isSatisficingWinner: false,
      prospectAdjustedScore: 0,
      isProspectWinner: false,
      biasPenaltyApplied: 0,
      debiasedScore: 0,
      isDebiasedWinner: false,
      motivatorScore: 0,
      hygieneScore: 0,
      reconciliationIndex: 50,
      polaritySkew: 0,
    }));
  }

  // Kahneman Prospect Theory constants around neutral reference point 5.5
  const refPoint = 5.5;
  const alpha = 0.88;
  const maxSingleGain = Math.pow(10 - refPoint, alpha); // +4.5^0.88
  const maxSingleLoss = lossAversionLambda * Math.pow(refPoint - 1, alpha); // -lambda * 4.5^0.88

  const results: CalculatedOptionScore[] = optionScores.map((option) => {
    let earned = 0;
    let prospectWeightedSum = 0;
    let maxProspectSum = 0;
    let minProspectSum = 0;

    let motivatorEarned = 0;
    let motivatorMax = 0;
    let hygieneEarned = 0;
    let hygieneMax = 0;

    const failedFloors: FailedFloorDetail[] = [];
    let bottleneckMargin = Infinity;

    criteria.forEach((crit) => {
      const weight = crit.defaultWeight || 1;
      const floor = crit.aspirationFloor ?? 5;
      const role = crit.christensenRole ?? 'Motivator';

      const match = option.scores.find((s) => s.criteriaId === crit.id);
      const scoreVal = match ? match.score : 5;

      // 1. Standard linear maximizing
      earned += weight * scoreVal;

      // 2. Simon satisficing floor check
      const margin = scoreVal - floor;
      if (margin < bottleneckMargin) bottleneckMargin = margin;
      if (scoreVal < floor) {
        failedFloors.push({
          criterionId: crit.id,
          criterionName: crit.name,
          score: scoreVal,
          floor,
          deficit: floor - scoreVal,
        });
      }

      // 3. Kahneman Prospect Theory value function
      let prospectVal = 0;
      if (scoreVal >= refPoint) {
        prospectVal = Math.pow(scoreVal - refPoint, alpha);
      } else {
        prospectVal = -lossAversionLambda * Math.pow(refPoint - scoreVal, alpha);
      }
      prospectWeightedSum += weight * prospectVal;
      maxProspectSum += weight * maxSingleGain;
      minProspectSum += weight * -maxSingleLoss;

      // 4. Christensen Motivator vs Hygiene split
      if (role === 'Hygiene') {
        hygieneEarned += weight * scoreVal;
        hygieneMax += weight * 10;
      } else {
        motivatorEarned += weight * scoreVal;
        motivatorMax += weight * 10;
      }
    });

    const percentage = Math.round((earned / maxPossible) * 1000) / 10;

    const prospectSpan = maxProspectSum - minProspectSum;
    const prospectAdjustedScore =
      prospectSpan > 0
        ? Math.round(((prospectWeightedSum - minProspectSum) / prospectSpan) * 1000) / 10
        : percentage;

    // 5. Cialdini Influence De-biasing
    const biasEntry = cialdiniBiases.find((b) => b.optionId === option.optionId);
    const biasPenaltyApplied = applyCialdiniDebias && biasEntry ? biasEntry.biasInflationPoints : 0;
    const debiasedScore = Math.max(
      0,
      Math.round((percentage - biasPenaltyApplied) * 10) / 10
    );

    // 6. Christensen percentages
    const motivatorScore =
      motivatorMax > 0 ? Math.round((motivatorEarned / motivatorMax) * 1000) / 10 : percentage;
    const hygieneScore =
      hygieneMax > 0 ? Math.round((hygieneEarned / hygieneMax) * 1000) / 10 : percentage;

    // 7. Trompenaars & Hampden-Turner (10,10) Helix Reconciliation Index
    const coord = trompenaarsCoordinates.find((c) => c.optionId === option.optionId);
    let reconciliationIndex = 50;
    let polaritySkew = 0;
    if (coord) {
      const dx = 10 - coord.poleXScore;
      const dy = 10 - coord.poleYScore;
      const distToApex = Math.sqrt(dx * dx + dy * dy);
      const maxDist = Math.sqrt(9 * 9 + 9 * 9); // Distance from (1,1) to (10,10)
      reconciliationIndex = Math.round((1 - distToApex / maxDist) * 1000) / 10;
      polaritySkew = Math.round(Math.abs(coord.poleXScore - coord.poleYScore) * 10) / 10;
    }

    return {
      optionId: option.optionId,
      optionName: option.optionName,
      totalWeightedScore: Math.round(earned * 10) / 10,
      maxPossibleScore: maxPossible,
      percentage,
      isWinner: false,
      scoreDifference: 0,
      clearsAllFloors: failedFloors.length === 0,
      floorsCleared: criteria.length - failedFloors.length,
      totalFloors: criteria.length,
      failedFloors,
      bottleneckMargin: bottleneckMargin === Infinity ? 0 : bottleneckMargin,
      isSatisficingWinner: false,
      prospectAdjustedScore,
      isProspectWinner: false,
      biasPenaltyApplied,
      debiasedScore,
      isDebiasedWinner: false,
      motivatorScore,
      hygieneScore,
      reconciliationIndex,
      polaritySkew,
    };
  });

  // Determine leaders under each theoretical framework
  const sortedMax = [...results].sort((a, b) => b.percentage - a.percentage);
  const highestMax = sortedMax[0]?.percentage ?? 0;
  const runnerUpMax = sortedMax[1]?.percentage ?? highestMax;

  const sortedProspect = [...results].sort(
    (a, b) => b.prospectAdjustedScore - a.prospectAdjustedScore
  );
  const highestProspect = sortedProspect[0]?.prospectAdjustedScore ?? 0;

  const sortedDebiased = [...results].sort((a, b) => b.debiasedScore - a.debiasedScore);
  const highestDebiased = sortedDebiased[0]?.debiasedScore ?? 0;

  // Simon Satisficing Winner: first priority = clearsAllFloors; tie-break by percentage
  const satisficingCandidates = [...results].sort((a, b) => {
    if (a.clearsAllFloors !== b.clearsAllFloors) {
      return a.clearsAllFloors ? -1 : 1;
    }
    if (a.floorsCleared !== b.floorsCleared) {
      return b.floorsCleared - a.floorsCleared;
    }
    return b.percentage - a.percentage;
  });
  const topSatisficingId = satisficingCandidates[0]?.optionId;

  return results.map((r) => {
    const isWinner = r.percentage === highestMax && sortedMax.length > 0;
    const scoreDifference = isWinner
      ? Math.round((highestMax - runnerUpMax) * 10) / 10
      : Math.round((highestMax - r.percentage) * 10) / 10;

    return {
      ...r,
      isWinner,
      scoreDifference,
      isSatisficingWinner: r.optionId === topSatisficingId,
      isProspectWinner: r.prospectAdjustedScore === highestProspect && sortedProspect.length > 0,
      isDebiasedWinner: r.debiasedScore === highestDebiased && sortedDebiased.length > 0,
    };
  });
}

export function calculateCriteriaDifferences(
  criteria: WeightedCriteria[],
  optionScores: OptionScoreItem[]
): CriterionDifferenceMetric[] {
  return criteria.map((crit) => {
    const weight = crit.defaultWeight || 1;
    const floor = crit.aspirationFloor ?? 5;
    const role = crit.christensenRole ?? 'Motivator';

    const scoresForCrit = optionScores.map((opt) => {
      const match = opt.scores.find((s) => s.criteriaId === crit.id);
      return {
        optionId: opt.optionId,
        optionName: opt.optionName,
        score: match ? match.score : 5,
      };
    });

    const sorted = [...scoresForCrit].sort((a, b) => b.score - a.score);
    const maxScore = sorted[0]?.score ?? 5;
    const minScore = sorted[sorted.length - 1]?.score ?? 5;
    const spreadDelta = Math.round((maxScore - minScore) * 10) / 10;
    const isTie = sorted.length >= 2 && sorted[0].score === sorted[1].score;

    const hasFloorViolation = scoresForCrit.some((s) => s.score < floor);
    const hasLossSpike = weight >= 7 && scoresForCrit.some((s) => s.score <= 4);

    return {
      criterionId: crit.id,
      criterionName: crit.name,
      weight,
      aspirationFloor: floor,
      christensenRole: role,
      spreadDelta,
      weightedImpactDelta: Math.round(spreadDelta * weight * 10) / 10,
      leaderOptionId: isTie ? null : sorted[0]?.optionId ?? null,
      leaderOptionName: isTie ? 'Tied' : sorted[0]?.optionName ?? 'Tied',
      isTie,
      hasFloorViolation,
      hasLossSpike,
    };
  });
}
