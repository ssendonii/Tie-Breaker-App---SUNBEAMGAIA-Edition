export interface DecisionOption {
  id: string;
  name: string;
  tagline: string;
  shortDescription: string;
}

export interface ProConItem {
  title: string;
  description: string;
  category: string;
  impact: 'high' | 'medium' | 'low';
  isCritical: boolean;
}

export interface OptionProsCons {
  optionId: string;
  optionName: string;
  pros: ProConItem[];
  cons: ProConItem[];
}

export interface OptionEvaluation {
  optionId: string;
  optionName: string;
  rating: number; // 1-10
  ratingLabel: string;
  highlight: string;
  analysis: string;
}

export interface ComparisonRow {
  dimensionId: string;
  dimensionName: string;
  christensenType?: 'Motivator' | 'Hygiene';
  kahnemanSensitivity?: 'Loss-Heavy' | 'Gain-Driven' | 'Balanced';
  optionEvaluations: OptionEvaluation[];
}

export interface ComparisonDimension {
  id: string;
  name: string;
  description: string;
}

export interface ComparisonTableData {
  dimensions: ComparisonDimension[];
  rows: ComparisonRow[];
}

export interface SWOTAnalysisItem {
  optionId: string;
  optionName: string;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  strategicTakeaway: string;
}

export interface WeightedCriteria {
  id: string;
  name: string;
  description: string;
  defaultWeight: number; // 1 to 10
  aspirationFloor?: number; // Herbert Simon Satisficing minimum acceptable score (1 to 10)
  christensenRole?: 'Motivator' | 'Hygiene'; // Clayton Christensen distinction
}

export interface OptionCriteriaScore {
  criteriaId: string;
  score: number; // 1 to 10
  rationale: string;
}

export interface OptionScoreItem {
  optionId: string;
  optionName: string;
  scores: OptionCriteriaScore[];
}

export interface WeightedScoringData {
  criteria: WeightedCriteria[];
  optionScores: OptionScoreItem[];
}

export interface ImmediateAction {
  step: number;
  action: string;
  timeframe: string;
  purpose: string;
}

export interface DecisionVerdict {
  recommendedOptionId: string;
  recommendedOptionName: string;
  confidencePercentage: number;
  verdictHeadline: string;
  coreRationale: string;
  whenToPickAlternative: string;
  immediateActions: ImmediateAction[];
}

export interface MentalModelsData {
  rule101010: {
    tenMinutes: string;
    tenMonths: string;
    tenYears: string;
    synthesis: string;
  };
  regretMinimization: {
    reflectionAt80: string;
    biggestUnforgivableMistake: string;
    recommendation: string;
  };
  reversibilityTest: {
    doorType: string;
    unwindingStrategy: string;
    downsideCap: string;
  };
  gutCheckOracle: {
    coinFlipInsight: string;
    subconsciousClues: string;
  };
}

// --- New Research Frameworks Data ---

export interface TrompenaarsOptionCoordinate {
  optionId: string;
  optionName: string;
  poleXScore: number; // 1 to 10
  poleYScore: number; // 1 to 10
  diagnosis: string;
}

export interface CialdiniOptionBias {
  optionId: string;
  optionName: string;
  activeTriggers: string[]; // e.g., ["Scarcity", "Social Proof"]
  biasInflationPoints: number; // 0 to 15 percentage points of artificial FOMO/status inflation
  realityCheck: string;
}

export interface ChristensenOptionAudit {
  optionId: string;
  optionName: string;
  functionalJobFit: string;
  emotionalSocialJobFit: string;
  marginalCostTrap: string;
}

export interface ResearchFrameworksData {
  trompenaarsHampdenTurner: {
    poleXLabel: string; // e.g., "Asymmetric Growth & Autonomy"
    poleYLabel: string; // e.g., "Stability & Predictable Security"
    reconciledHelixName: string; // e.g., "De-Risked Entrepreneurial Mastery"
    reconciledSynthesis: string;
    optionCoordinates: TrompenaarsOptionCoordinate[];
  };
  wendySmithParadox: {
    coreTension: string;
    whyEitherOrFails: string;
    differentiationMove: string;
    integrationMove: string;
    bothAndActionPlan: string;
  };
  herbertSimonBounded: {
    informationGapWarning: string;
    satisficingRecommendation: string;
    searchStoppingRule: string;
  };
  cialdiniInfluenceAudit: {
    preSuasionFramingAlert: string;
    optionBiases: CialdiniOptionBias[];
  };
  christensenJTBD: {
    coreJobToBeDone: string;
    hygieneVsMotivatorInsight: string;
    optionAudits: ChristensenOptionAudit[];
  };
  kahnemanHahnemann: {
    system1Trap: string;
    system2OutsideViewBaseRate: string;
    lossAversionInsight: string;
    hahnemannMinimumDoseTest: string;
  };
}

export interface DecisionAnalysisResult {
  title: string;
  summary: string;
  options: DecisionOption[];
  prosAndCons: OptionProsCons[];
  comparisonTable: ComparisonTableData;
  swotAnalysis: SWOTAnalysisItem[];
  weightedScoring: WeightedScoringData;
  mentalModels: MentalModelsData;
  researchFrameworks?: ResearchFrameworksData;
  verdict: DecisionVerdict;
}

export interface SavedDilemma {
  id: string;
  createdAt: string;
  title: string;
  decisionStyle: string;
  options: string[];
  data: DecisionAnalysisResult;
}
