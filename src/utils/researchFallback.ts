import { DecisionAnalysisResult, ResearchFrameworksData } from '../types';

export function getResearchFrameworks(decision: DecisionAnalysisResult): ResearchFrameworksData {
  if (decision.researchFrameworks) {
    return decision.researchFrameworks;
  }

  const opts = decision.options;
  const optA = opts[0];
  const optB = opts[1];

  return {
    trompenaarsHampdenTurner: {
      poleXLabel: 'Exploration, Upside & Autonomy',
      poleYLabel: 'Stability, Predictability & Downside Floor',
      reconciledHelixName: 'De-Risked Asymmetric Progression',
      reconciledSynthesis:
        'True dilemma reconciliation avoids treating growth and security as a zero-sum battle. Structure staged safety checkpoints so bold exploration reinforces long-term resilience.',
      optionCoordinates: opts.map((opt, idx) => ({
        optionId: opt.id,
        optionName: opt.name,
        poleXScore: idx === 0 ? 8.5 : 4.5,
        poleYScore: idx === 0 ? 4.5 : 8.5,
        diagnosis:
          idx === 0
            ? 'Strongly favors upside & agency, leaving downside predictability exposed unless staged.'
            : 'Fortifies stability & predictability, risking under-utilization of growth potential.',
      })),
    },
    wendySmithParadox: {
      coreTension: `${optA?.name || 'Option A'} vs. ${optB?.name || 'Option B'} reflects an enduring polarity between expansion and preservation.`,
      whyEitherOrFails:
        'Treating this purely as a binary either/or choice breeds defensive regret—choosing safety sparks stagnation anxiety, while choosing pure risk sparks burnout.',
      differentiationMove:
        'Honor each pole explicitly: preserve dedicated non-negotiable reserves for stability while isolating an autonomous sandbox for bold upside.',
      integrationMove:
        'Adopt temporal oscillation—commit to a time-boxed experimental horizon with explicit review gates.',
      bothAndActionPlan:
        'Take the higher-growth vector with pre-negotiated guardrails (exit milestones, financial floor, and scheduled recovery cycles) so both poles co-exist.',
    },
    herbertSimonBounded: {
      informationGapWarning:
        'Under bounded rationality, you cannot forecast every 5-year variable. Endless data gathering yields diminishing returns.',
      satisficingRecommendation:
        'Set firm minimum aspiration floors on non-negotiable life hygiene criteria (health, runway, core integrity) and favor the option that clears every floor cleanly.',
      searchStoppingRule:
        'Stop searching for perfect certainty once you validate two independent real-world reference checks and confirm your worst-case floor holds.',
    },
    cialdiniInfluenceAudit: {
      preSuasionFramingAlert:
        'Watch for urgency framing, prestige halos, or artificial deadlines skewing what feels most salient right before you decide.',
      optionBiases: opts.map((opt, idx) => ({
        optionId: opt.id,
        optionName: opt.name,
        activeTriggers:
          idx === 0
            ? ['Scarcity (Deadline Pressure)', 'Social Proof']
            : ['Commitment & Consistency (Status Quo)', 'Authority Halo'],
        biasInflationPoints: idx === 0 ? 4.5 : 3.0,
        realityCheck:
          idx === 0
            ? 'Strip away artificial offer urgency or peer hype; verify whether intrinsic day-to-day reality still excites you.'
            : 'Watch for status-quo inertia masquerading as prudence.',
      })),
    },
    christensenJTBD: {
      coreJobToBeDone:
        'Help you make meaningful, self-authored progress in your craft and life trajectory without compromising foundational peace.',
      hygieneVsMotivatorInsight:
        'Hygiene factors (income floor, stress ceiling) prevent misery, while Motivators (autonomy, mastery, impact) drive lasting fulfillment.',
      optionAudits: opts.map((opt, idx) => ({
        optionId: opt.id,
        optionName: opt.name,
        functionalJobFit:
          idx === 0
            ? 'Strong alignment with capability stretch and direct ownership.'
            : 'Reliable execution of baseline financial and operational predictability.',
        emotionalSocialJobFit:
          idx === 0
            ? 'Delivers pride of agency and identity momentum, with elevated acute pressure.'
            : 'Delivers external prestige and calm social validation, with risk of quiet restlessness.',
        marginalCostTrap:
          'Avoid incremental "just this once" compromises on core boundaries or personal health.',
      })),
    },
    kahnemanHahnemann: {
      system1Trap:
        'System 1 overweights vivid short-term losses and immediate social awkwardness while under-weighting compounding 5-year drift.',
      system2OutsideViewBaseRate:
        'Apply the Outside View: examine how peers in your exact stage and financial cushion actually fared 24 months after making this same choice.',
      lossAversionInsight:
        'Humans experience potential losses roughly 2x more intensely than equivalent gains. Discount exaggerated fear of reversible setbacks.',
      hahnemannMinimumDoseTest:
        'Hahnemannian Minimum-Dose Titration: before full commitment, run a low-cost, small-scale micro-probe (trial sprint, shadowing, or 48h simulation) to observe real systemic resonance.',
    },
  };
}
