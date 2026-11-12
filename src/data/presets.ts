import { DecisionAnalysisResult } from '../types';

export interface PresetDilemma {
  id: string;
  category: string;
  badge: string;
  title: string;
  options: string[];
  context: string;
  priorities: string;
  decisionStyle: string;
  preloadedData: DecisionAnalysisResult;
}

export const PRESET_DILEMMAS: PresetDilemma[] = [
  {
    id: 'startup-vs-bigtech',
    category: 'Career & Ambition',
    badge: 'Popular Dilemma',
    title: 'Accept Series B AI Startup Offer vs. Stay as Staff Engineer at Big Tech',
    options: ['Join Series B AI Startup (VP/Founding Track)', 'Stay at Big Tech (Staff Level, RSUs & Stability)'],
    context: 'Currently 32 years old, 7 years in tech, $380k total comp at Big Tech. Startup is offering $220k base + 0.75% equity with high revenue growth. Have 9 months emergency fund and partner is supportive.',
    priorities: 'Long-term wealth upside, autonomous leadership impact, avoiding career stagnation, balanced mental health.',
    decisionStyle: 'Moonshot Ambition',
    preloadedData: {
      title: 'Accept Series B AI Startup Offer vs. Stay as Staff Engineer at Big Tech',
      summary: 'This dilemma pits the compounding financial stability, brand prestige, and predictable work-life balance of Big Tech against the asymmetric equity upside, executive leadership trajectory, and raw creative velocity of a Series B AI startup.',
      options: [
        {
          id: 'opt-startup',
          name: 'Join Series B AI Startup',
          tagline: 'High Velocity & Asymmetric Upside',
          shortDescription: '0.75% equity grant, direct board visibility, high ownership, 50-60 hour intense pace.',
        },
        {
          id: 'opt-bigtech',
          name: 'Stay at Big Tech',
          tagline: 'Predictable Wealth & Sustainable Balance',
          shortDescription: '$380k liquid total compensation, golden handcuffs, established tooling, corporate inertia.',
        },
      ],
      prosAndCons: [
        {
          optionId: 'opt-startup',
          optionName: 'Join Series B AI Startup',
          pros: [
            {
              title: 'Exponential Equity Upside',
              description: 'A 0.75% stake in an AI venture achieving a $2B liquidity event yields ~$15M pre-dilution.',
              category: 'Financial',
              impact: 'high',
              isCritical: true,
            },
            {
              title: 'C-Suite & Architectural Autonomy',
              description: 'Zero bureaucratic committee approvals; you directly steer technical roadmap and team culture.',
              category: 'Growth',
              impact: 'high',
              isCritical: true,
            },
            {
              title: 'Steep Skill Acquisition Curve',
              description: 'Forces mastery in product-market fit, hiring, enterprise sales engineering, and investor relations.',
              category: 'Growth',
              impact: 'medium',
              isCritical: false,
            },
            {
              title: 'High Morale and Camaraderie',
              description: 'Working with a small, high-density elite team who have intense skin in the game.',
              category: 'Wellbeing',
              impact: 'medium',
              isCritical: false,
            },
          ],
          cons: [
            {
              title: 'Substantial Base Cash Compensation Cut',
              description: '$160k reduction in annual liquid take-home pay while living in a high-cost tier-1 metro.',
              category: 'Financial',
              impact: 'high',
              isCritical: true,
            },
            {
              title: 'Venture Bankruptcy & Dilution Risks',
              description: 'Over 65% of Series B startups suffer down-rounds, recapitalization, or acqui-hire wipes.',
              category: 'Risk',
              impact: 'high',
              isCritical: true,
            },
            {
              title: 'Intense Workload & Burnout Threat',
              description: 'Uncapped urgency, firefighting outages, weekend roadmap sprints, and high emotional volatility.',
              category: 'Wellbeing',
              impact: 'high',
              isCritical: false,
            },
          ],
        },
        {
          optionId: 'opt-bigtech',
          optionName: 'Stay at Big Tech',
          pros: [
            {
              title: 'Guaranteed Liquid Wealth Engine',
              description: '$380,000 yearly comp in quarterly vesting liquid stock allows systematic index investing and home purchases.',
              category: 'Financial',
              impact: 'high',
              isCritical: true,
            },
            {
              title: 'Protected Work-Life Equilibrium',
              description: 'Predictable 38-42 hour work weeks, generous 25+ days PTO, and low emergency on-call stress.',
              category: 'Wellbeing',
              impact: 'high',
              isCritical: false,
            },
            {
              title: 'Tier-1 Resume Pedigree',
              description: 'Staff title at an industry titan acts as an evergreen credential for advisory boards or future executive roles.',
              category: 'Career',
              impact: 'medium',
              isCritical: false,
            },
          ],
          cons: [
            {
              title: 'Creative Atrophy & Political Bureaucracy',
              description: 'Months spent in design doc reviews, cross-functional alignment decks, and slow legacy migrations.',
              category: 'Growth',
              impact: 'high',
              isCritical: true,
            },
            {
              title: 'Risk of Mid-Career Complacency',
              description: 'Comfortable golden handcuffs often prevent engineers from ever taking a high-conviction entrepreneurial leap.',
              category: 'Growth',
              impact: 'high',
              isCritical: true,
            },
            {
              title: 'Corporate Re-org & Layoff Overhead',
              description: 'Large enterprise division re-prioritizations can kill multi-year projects overnight regardless of performance.',
              category: 'Risk',
              impact: 'medium',
              isCritical: false,
            },
          ],
        },
      ],
      comparisonTable: {
        dimensions: [
          { id: 'fin-upside', name: 'Financial Upside', description: 'Maximum wealth generation ceiling' },
          { id: 'fin-safety', name: 'Downside Protection', description: 'Floor and liquidity reliability' },
          { id: 'autonomy', name: 'Decision Autonomy', description: 'Freedom from bureaucracy and politics' },
          { id: 'wellness', name: 'Well-being & Sleep', description: 'Sustainable stress and health levels' },
          { id: 'reversibility', name: 'Reversibility', description: 'Ease of returning to previous status quo' },
          { id: '5yr-legacy', name: '5-Year Career Trajectory', description: 'Where you stand by 2031' },
        ],
        rows: [
          {
            dimensionId: 'fin-upside',
            dimensionName: 'Financial Upside',
            christensenType: 'Motivator',
            kahnemanSensitivity: 'Gain-Driven',
            optionEvaluations: [
              {
                optionId: 'opt-startup',
                optionName: 'Join Series B AI Startup',
                rating: 9.2,
                ratingLabel: 'Massive Potential',
                highlight: 'Asymmetric 10x-50x multiplier',
                analysis: 'Equity ownership can yield life-changing liquidity during an IPO or strategic acquisition.',
              },
              {
                optionId: 'opt-bigtech',
                optionName: 'Stay at Big Tech',
                rating: 6.8,
                ratingLabel: 'Capped Linear',
                highlight: 'Predictable high wage',
                analysis: 'Very comfortable salary with regular equity refreshers, but capped by corporate compensation bands.',
              },
            ],
          },
          {
            dimensionId: 'fin-safety',
            dimensionName: 'Downside Protection',
            christensenType: 'Hygiene',
            kahnemanSensitivity: 'Loss-Heavy',
            optionEvaluations: [
              {
                optionId: 'opt-startup',
                optionName: 'Join Series B AI Startup',
                rating: 4.5,
                ratingLabel: 'Vulnerable',
                highlight: 'Runway dependent',
                analysis: 'Vulnerable to tech market contractions, pivot failures, and zero liquidation preferences.',
              },
              {
                optionId: 'opt-bigtech',
                optionName: 'Stay at Big Tech',
                rating: 9.5,
                ratingLabel: 'Fortress',
                highlight: 'Public liquid shares',
                analysis: 'Quarterly vesting public equity, severance packages, and cash reserves protect family balance sheet.',
              },
            ],
          },
          {
            dimensionId: 'autonomy',
            dimensionName: 'Decision Autonomy',
            christensenType: 'Motivator',
            kahnemanSensitivity: 'Balanced',
            optionEvaluations: [
              {
                optionId: 'opt-startup',
                optionName: 'Join Series B AI Startup',
                rating: 9.0,
                ratingLabel: 'Unbounded',
                highlight: 'Direct architectural rule',
                analysis: 'You define the technical stack, hire founding teammates, and establish core engineering paradigms.',
              },
              {
                optionId: 'opt-bigtech',
                optionName: 'Stay at Big Tech',
                rating: 4.2,
                ratingLabel: 'Constrained',
                highlight: 'Multi-layer gatekeeping',
                analysis: 'Heavy security, legal, privacy, and architecture review committees throttle deployment velocity.',
              },
            ],
          },
          {
            dimensionId: 'wellness',
            dimensionName: 'Well-being & Sleep',
            christensenType: 'Hygiene',
            kahnemanSensitivity: 'Loss-Heavy',
            optionEvaluations: [
              {
                optionId: 'opt-startup',
                optionName: 'Join Series B AI Startup',
                rating: 4.8,
                ratingLabel: 'High Pressure',
                highlight: 'High cognitive load',
                analysis: 'Frequent context switching, urgent customer crises, and emotional entanglement with startup runway.',
              },
              {
                optionId: 'opt-bigtech',
                optionName: 'Stay at Big Tech',
                rating: 8.5,
                ratingLabel: 'Serene',
                highlight: 'Clear boundaries',
                analysis: 'Generous parental leave, health coverage, flexible remote policy, and work stays at work.',
              },
            ],
          },
          {
            dimensionId: 'reversibility',
            dimensionName: 'Reversibility',
            christensenType: 'Hygiene',
            kahnemanSensitivity: 'Loss-Heavy',
            optionEvaluations: [
              {
                optionId: 'opt-startup',
                optionName: 'Join Series B AI Startup',
                rating: 8.8,
                ratingLabel: 'High Reversibility',
                highlight: 'Two-Way Door',
                analysis: 'If the startup stumbles after 18 months, Big Tech routinely re-hires former Staff engineers with open arms.',
              },
              {
                optionId: 'opt-bigtech',
                optionName: 'Stay at Big Tech',
                rating: 7.0,
                ratingLabel: 'Moderate',
                highlight: 'Opportunity cost door',
                analysis: 'Staying keeps you safe, but passing on the AI window at Series B is a fleeting moment in industry history.',
              },
            ],
          },
          {
            dimensionId: '5yr-legacy',
            dimensionName: '5-Year Career Trajectory',
            christensenType: 'Motivator',
            kahnemanSensitivity: 'Gain-Driven',
            optionEvaluations: [
              {
                optionId: 'opt-startup',
                optionName: 'Join Series B AI Startup',
                rating: 9.4,
                ratingLabel: 'Transformative',
                highlight: 'CTO / VP Track',
                analysis: 'Transforms you into a battle-tested executive or serial venture builder regardless of outcome.',
              },
              {
                optionId: 'opt-bigtech',
                optionName: 'Stay at Big Tech',
                rating: 7.2,
                ratingLabel: 'Incremental',
                highlight: 'Principal Engineer',
                analysis: 'Likely reaches Principal or Director level with $500k+ comp, but in a very familiar environment.',
              },
            ],
          },
        ],
      },
      swotAnalysis: [
        {
          optionId: 'opt-startup',
          optionName: 'Join Series B AI Startup',
          strengths: [
            'Direct access to founders and board',
            'Freedom to build greenfield AI systems without legacy code',
            'Strong leadership title multiplier for future executive roles',
          ],
          weaknesses: [
            'Substantial base compensation sacrifice',
            'Illiquid paper equity that could take 5-8 years to cash out',
            'Unstructured organizational chaos and shifting goalposts',
          ],
          opportunities: [
            'Riding the explosive multi-billion dollar generational AI adoption cycle',
            'Building a world-class network of founders, angels, and tier-1 VCs',
            'Creating foundational tech that millions of daily users touch',
          ],
          threats: [
            'Competitors backed by mega-cap cloud providers duplicating core features',
            'Risk of venture freeze or predatory term sheets in down markets',
            'Burnout strain on personal life if boundaries fail',
          ],
          strategicTakeaway: 'The startup represents an offensive growth gambit. It maximizes learning velocity and wealth ceiling while testing your leadership ceiling.',
        },
        {
          optionId: 'opt-bigtech',
          optionName: 'Stay at Big Tech',
          strengths: [
            'Guaranteed top-percentile cash and liquid stock cashflow',
            'High psychological safety and ample rest periods',
            'Massive institutional compute and internal developer infrastructure',
          ],
          weaknesses: [
            'Sluggish decision velocity and endless political games',
            'Erosion of end-to-end founder skills and risk tolerance',
            'Zero leverage over company-wide strategic direction',
          ],
          opportunities: [
            'Use stable hours to build side projects, angel invest, or mentor',
            'Compound liquid savings aggressively in market index funds',
            'Target strategic promotion to Principal Engineer level',
          ],
          threats: [
            'Unexpected corporate restructuring or departmental downsizing',
            'Skill obsolescence if working primarily on internal legacy frameworks',
            'Mid-career regret of playing it too safe when in prime health',
          ],
          strategicTakeaway: 'Big Tech is a defensive wealth compounder. Best chosen if you desire personal peace, family dedication, or capital accumulation without emotional turbulence.',
        },
      ],
      weightedScoring: {
        criteria: [
          { id: 'crit-wealth', name: 'Long-Term Wealth Upside', description: 'Potential to reach life-changing financial freedom', defaultWeight: 9, aspirationFloor: 6, christensenRole: 'Motivator' },
          { id: 'crit-autonomy', name: 'Creative & Technical Autonomy', description: 'Freedom to execute without excessive red tape', defaultWeight: 8, aspirationFloor: 6, christensenRole: 'Motivator' },
          { id: 'crit-growth', name: 'Learning & Leadership Curve', description: 'Expansion of real-world competencies and grit', defaultWeight: 8, aspirationFloor: 5, christensenRole: 'Motivator' },
          { id: 'crit-peace', name: 'Day-to-Day Peace & Well-being', description: 'Sleep quality, personal time, and low chronic anxiety', defaultWeight: 7, aspirationFloor: 5, christensenRole: 'Hygiene' },
          { id: 'crit-downside', name: 'Downside Safety & Cash Flow', description: 'Emergency reserve preservation and immediate income', defaultWeight: 6, aspirationFloor: 4, christensenRole: 'Hygiene' },
          { id: 'crit-reversibility', name: 'Reversibility & Fallback Plan', description: 'Ability to undo the decision if conditions deteriorate', defaultWeight: 8, aspirationFloor: 6, christensenRole: 'Hygiene' },
        ],
        optionScores: [
          {
            optionId: 'opt-startup',
            optionName: 'Join Series B AI Startup',
            scores: [
              { criteriaId: 'crit-wealth', score: 9, rationale: 'Significant equity upside in an accelerating market.' },
              { criteriaId: 'crit-autonomy', score: 9, rationale: 'Immediate ownership over architecture and hiring.' },
              { criteriaId: 'crit-growth', score: 10, rationale: 'Extreme density of leadership and engineering lessons.' },
              { criteriaId: 'crit-peace', score: 4, rationale: 'Demanding work cadence and uncertain runway.' },
              { criteriaId: 'crit-downside', score: 4, rationale: 'Cash salary cut and illiquid options.' },
              { criteriaId: 'crit-reversibility', score: 8, rationale: 'Big Tech welcomes back high-performing former Staff engineers.' },
            ],
          },
          {
            optionId: 'opt-bigtech',
            optionName: 'Stay at Big Tech',
            scores: [
              { criteriaId: 'crit-wealth', score: 7, rationale: 'Solid, predictable $380k compounder, but capped.' },
              { criteriaId: 'crit-autonomy', score: 4, rationale: 'Heavy compliance reviews, RFC churn, and organizational silos.' },
              { criteriaId: 'crit-growth', score: 5, rationale: 'Deep domain specialization, but limited generalist founder growth.' },
              { criteriaId: 'crit-peace', score: 9, rationale: 'Low acute anxiety and predictable 40-hour work rhythm.' },
              { criteriaId: 'crit-downside', score: 10, rationale: 'Rock-solid balance sheet with liquid quarterly stock vests.' },
              { criteriaId: 'crit-reversibility', score: 6, rationale: 'Staying is safe, but skipping this stage in AI may not recur.' },
            ],
          },
        ],
      },
      mentalModels: {
        rule101010: {
          tenMinutes: 'Accepting the startup sparks nervous excitement mixed with dread about giving notice; staying at Big Tech brings instant comfort and relief.',
          tenMonths: 'At the startup, you are knee-deep in production challenges and shipped features with high agency; at Big Tech, you are likely writing another quarterly performance review or alignment doc.',
          tenYears: 'In 2036, you will never regret having taken a daring swing at an AI venture during its inflection point—even if it folded, you gained executive muscle. But staying purely for comfort carries high lingering regret.',
          synthesis: 'The 10-10-10 rule reveals that the discomfort of the startup is purely short-term (10 mins/weeks), while the upside and fulfillment are long-term (10 years).',
        },
        regretMinimization: {
          reflectionAt80: 'At age 80 sitting on a porch, you will remember the thrilling late nights building alongside brilliant minds into uncharted territory. You will not reminisce about an extra 18 months of corporate stock vesting.',
          biggestUnforgivableMistake: 'The unforgivable mistake is letting fear of temporary discomfort dictate your prime productive decade when your partner is supportive and your emergency fund is healthy.',
          recommendation: 'Embrace the asymmetric venture; you have the safety net and the pedigree.',
        },
        reversibilityTest: {
          doorType: 'Type 2 (Two-Way Door)',
          unwindingStrategy: 'Big Tech companies have standard boomerang rehiring pipelines. If the startup runs out of steam or culture turns toxic, former Staff engineers return within 6-12 weeks at equivalent or higher compensation.',
          downsideCap: 'Your downside is capped at 12-18 months of lower base salary, which your 9-month reserve and partner support comfortably buffer. Your upside is mathematically uncapped.',
        },
        gutCheckOracle: {
          coinFlipInsight: 'Assign Heads to Startup, Tails to Big Tech. When the coin is in the air, if your heart races hoping for Heads to give you permission to take the leap, your intuition has already spoken.',
          subconsciousClues: 'You requested this tie-breaker because you feel the quiet ache of golden handcuffs and know you are ready for a bigger playground.',
        },
      },
      researchFrameworks: {
        trompenaarsHampdenTurner: {
          poleXLabel: 'Entrepreneurial Autonomy & Asymmetric Upside',
          poleYLabel: 'Financial Fortress & Sustainable Balance',
          reconciledHelixName: 'Capital-Cushioned Venture Leadership',
          reconciledSynthesis:
            'Instead of treating Big Tech security (1,10) and Startup velocity (10,1) as mortal enemies, reconcile them toward (10,10): convert your 9-month liquid reserve + negotiated base floor into a calm runway that empowers fearless startup execution without panic.',
          optionCoordinates: [
            {
              optionId: 'opt-startup',
              optionName: 'Join Series B AI Startup',
              poleXScore: 9.2,
              poleYScore: 4.5,
              diagnosis: 'Dominates Autonomy & Upside (X=9.2) but leaves Sustainable Balance exposed (Y=4.5) unless boundaries are engineered upfront.',
            },
            {
              optionId: 'opt-bigtech',
              optionName: 'Stay at Big Tech',
              poleXScore: 4.2,
              poleYScore: 9.1,
              diagnosis: 'Maximizes Fortress Security (Y=9.1) while starving Creative Autonomy (X=4.2), creating golden-handcuff inertia.',
            },
          ],
        },
        wendySmithParadox: {
          coreTension: 'Exploration (building uncharted AI leadership) vs. Exploitation (harvesting peak Big Tech cashflow).',
          whyEitherOrFails:
            'Pure Exploitation breeds mid-career stagnation; pure Exploration without personal guardrails leads to burnout and resentment.',
          differentiationMove:
            'Separate financial baseline from venture upside: ring-fence your 9-month emergency fund untouched in T-bills so startup volatility never threatens household peace.',
          integrationMove:
            'Negotiate "Structured Autonomy" at the startup—commit to intense 4-day deep sprints paired with strict protected Sunday recovery and an 18-month executive milestone review.',
          bothAndActionPlan:
            'Join the startup while preserving Big Tech boomerang relationships and automating passive index contributions from your $220k base.',
        },
        herbertSimonBounded: {
          informationGapWarning:
            'Under bounded rationality, you cannot verify true Series B exit multiples or future competitor roadmaps—stop chasing illusory spreadsheet precision.',
          satisficingRecommendation:
            'Notice that the Startup clears 5 of 6 floors cleanly but dips 1 point below your Well-being aspiration floor (4 vs. 5). Big Tech fails Autonomy (4 vs. 6). Raising the Startup well-being floor via hard boundary negotiation resolves the satisficing deadlock.',
          searchStoppingRule:
            'Halt deliberation immediately after completing 2 independent engineering backchannels and verifying 18+ months of net cash runway.',
        },
        cialdiniInfluenceAudit: {
          preSuasionFramingAlert:
            'AI venture hype and exploding signing deadlines trigger Scarcity and Social Proof biases—making startups appear artificially shinier than baseline operational reality.',
          optionBiases: [
            {
              optionId: 'opt-startup',
              optionName: 'Join Series B AI Startup',
              activeTriggers: ['Scarcity ("Exploding AI Window")', 'Social Proof (Peer Founders)', 'Liking (Founder Charisma)'],
              biasInflationPoints: 6.0,
              realityCheck: 'Discount 6 points of AI hype FOMO: ask whether debugging messy legacy customer pipelines on a Tuesday night still energizes you if the hype cools.',
            },
            {
              optionId: 'opt-bigtech',
              optionName: 'Stay at Big Tech',
              activeTriggers: ['Commitment & Consistency (7-Year Tenure)', 'Authority Halo (Brand Prestige)'],
              biasInflationPoints: 3.5,
              realityCheck: 'Discount 3.5 points of status-quo attachment: prestige badges lose marginal value once you already have 7 years on your resume.',
            },
          ],
        },
        christensenJTBD: {
          coreJobToBeDone:
            'Transition from high-earning corporate implementer into an autonomous technical leader shaping consequential products.',
          hygieneVsMotivatorInsight:
            'Money above $220k and corporate perks act primarily as Hygiene Factors (preventing misery), whereas architectural ownership and steep growth are true Motivators (driving life fulfillment).',
          optionAudits: [
            {
              optionId: 'opt-startup',
              optionName: 'Join Series B AI Startup',
              functionalJobFit: 'Directly fulfills executive-track ownership and end-to-end product impact.',
              emotionalSocialJobFit: 'Satisfies deep pride in agency, though it demands trading external Big Tech status comfort.',
              marginalCostTrap: 'Beware the "just this one weekend" habit—incremental boundary concessions compound silently into chronic burnout.',
            },
            {
              optionId: 'opt-bigtech',
              optionName: 'Stay at Big Tech',
              functionalJobFit: 'Over-delivers on financial hygiene while chronically under-delivering on creative ownership.',
              emotionalSocialJobFit: 'Provides effortless family reassurance and social prestige, masking quiet intellectual restlessness.',
              marginalCostTrap: '"Just one more RSU vest cycle" is Clayton Christensen’s classic marginal trap—4 quarters silently become 4 lost prime years.',
            },
          ],
        },
        kahnemanHahnemann: {
          system1Trap:
            'System 1 exaggerates the immediate emotional pain of a $160k pay drop (loss aversion) while ignoring the invisible multi-year erosion of staying stagnant.',
          system2OutsideViewBaseRate:
            'Outside View Reference Class: Staff engineers with 7+ yrs Big Tech pedigree who join growing Series B ventures achieve positive career NPV >80% of the time—even when the startup itself exits modestly—via accelerated VP/CTO placement.',
          lossAversionInsight:
            'Under Kahneman Prospect Theory (λ = 2.0), the 4/10 cashflow & peace scores pull the Startup down sharply. Framing the cash cut as an intentional 18-month tuition investment neutralizes irrational loss aversion.',
          hahnemannMinimumDoseTest:
            'Hahnemannian Minimum-Dose Probe: Before giving notice, offer to do a paid/unpaid 10-hour architectural advisory deep-dive with their founding team over one weekend to test real-world chemistry and code hygiene.',
        },
      },
      verdict: {
        recommendedOptionId: 'opt-startup',
        recommendedOptionName: 'Join Series B AI Startup',
        confidencePercentage: 84,
        verdictHeadline: 'Take the Asymmetric Leap: Your Downside is Capped, Your Upside is Unbounded',
        coreRationale: 'Because you have 9 months of liquid emergency funds, a supportive home environment, and 7 years of Big Tech credibility, you are in the 1% position best equipped to absorb venture risk. The startup decision is a Type-2 reversible door: the market value of an experienced Staff engineer who also navigated Series B scale is astronomically high.',
        whenToPickAlternative: 'Stay at Big Tech IF you or your family anticipate immediate medical crises requiring specialized corporate coverage, if you plan to buy a primary residence within the next 6 months requiring bank mortgage income verification, or if severe sleep deprivation triggers acute health problems.',
        immediateActions: [
          {
            step: 1,
            action: 'Negotiate early exercise / 83(b) election terms and push for an extra 0.15% equity or a 6-month performance review salary bump.',
            timeframe: 'Next 24 Hours',
            purpose: 'Maximize financial upside and de-risk tax liability before signing.',
          },
          {
            step: 2,
            action: 'Backchannel with 2 current non-founding engineers at the startup to verify leadership integrity, burn rate, and runway length.',
            timeframe: 'Next 36 Hours',
            purpose: 'Eliminate blind spots regarding runway and internal culture friction.',
          },
          {
            step: 3,
            action: 'Draft a gracious resignation letter leaving the Big Tech bridge completely open for future boomerang opportunities.',
            timeframe: 'Within 48 Hours',
            purpose: 'Cement your two-way door fallback guarantee.',
          },
        ],
      },
    },
  },
  {
    id: 'tokyo-vs-sf',
    category: 'Lifestyle & Relocation',
    badge: 'Life Transformation',
    title: 'Relocate to Tokyo on Global Talent Visa vs. Remain in San Francisco Bay Area',
    options: ['Relocate to Tokyo (Global Talent Track)', 'Remain in San Francisco Bay Area'],
    context: 'Single, 29, working remotely for a US tech company allowing international time zones. Rent in SF is $3,400/mo. Tokyo offers safety, rich transit, world-class food, but time zone differences and language hurdles.',
    priorities: 'Personal expansion, cost of living optimization, sensory richness, dating/social vitality, maintaining tech network.',
    decisionStyle: 'Radiant Balance',
    preloadedData: {
      title: 'Relocate to Tokyo on Global Talent Visa vs. Remain in San Francisco Bay Area',
      summary: 'A clash between the raw serendipity, venture concentration, and familiar network of San Francisco versus the exceptional urban design, safety, culinary mastery, and life adventure of Tokyo.',
      options: [
        {
          id: 'opt-tokyo',
          name: 'Relocate to Tokyo',
          tagline: 'Sensory Wonder & Life Adventure',
          shortDescription: 'High purchasing power with strong USD, immaculate transit, low crime, deep cultural immersion.',
        },
        {
          id: 'opt-sf',
          name: 'Remain in SF Bay Area',
          tagline: 'Venture Gravity & Frictionless Network',
          shortDescription: 'Epicenter of AI tech founders, familiar social circle, high living costs, street cleanliness challenges.',
        },
      ],
      prosAndCons: [
        {
          optionId: 'opt-tokyo',
          optionName: 'Relocate to Tokyo',
          pros: [
            {
              title: '3x Purchasing Power & Quality of Life',
              description: 'Luxury apartments in Shibuya/Minato cost a fraction of SF; world-class dining is affordable on a US income.',
              category: 'Financial',
              impact: 'high',
              isCritical: true,
            },
            {
              title: 'Unrivaled Safety & Flawless Infrastructure',
              description: 'Zero fear walking late at night; clean trains, pristine public spaces, and virtually zero petty crime.',
              category: 'Wellbeing',
              impact: 'high',
              isCritical: true,
            },
            {
              title: 'Profound Neuroplasticity & Novelty',
              description: 'Living in a foreign language environment forces rapid cognitive adaptation and broadens life perspective.',
              category: 'Growth',
              impact: 'high',
              isCritical: false,
            },
          ],
          cons: [
            {
              title: 'Time Zone Misalignment with US Teams',
              description: 'Working late night or very early morning calls with California teammates disrupts circadian rhythm.',
              category: 'Career',
              impact: 'high',
              isCritical: true,
            },
            {
              title: 'Language & Bureaucracy Barrier',
              description: 'Renting apartments, opening bank accounts, and health care navigation can be tedious without Japanese fluency.',
              category: 'Friction',
              impact: 'medium',
              isCritical: false,
            },
            {
              title: 'Distance from Family & Lifelong Friends',
              description: '11-hour transpacific flights make spontaneous visits home difficult and expensive.',
              category: 'Relationships',
              impact: 'high',
              isCritical: false,
            },
          ],
        },
        {
          optionId: 'opt-sf',
          optionName: 'Remain in San Francisco',
          pros: [
            {
              title: 'Incomparable AI & Tech Density',
              description: 'Coffee meetings, hackathons, and accidental encounters on Hayes St drive unmatched deal flow.',
              category: 'Career',
              impact: 'high',
              isCritical: true,
            },
            {
              title: 'Established Social Safety Net',
              description: 'Deep friendships, gym communities, and effortless cultural familiarity.',
              category: 'Relationships',
              impact: 'high',
              isCritical: false,
            },
          ],
          cons: [
            {
              title: 'Excessive Cost of Living Drain',
              description: '$3,400 rent plus CA state taxes burns over $60k/year that could otherwise be invested in assets.',
              category: 'Financial',
              impact: 'high',
              isCritical: true,
            },
            {
              title: 'Urban Fatigue & Monoculture',
              description: 'Every dinner party revolves around tech, valuation multiples, and startup politics.',
              category: 'Wellbeing',
              impact: 'medium',
              isCritical: false,
            },
          ],
        },
      ],
      comparisonTable: {
        dimensions: [
          { id: 'cost', name: 'Cost of Living & Savings Rate', description: 'Net disposable cash flow' },
          { id: 'safety', name: 'Urban Safety & Cleanliness', description: 'Peace of mind in daily movement' },
          { id: 'network', name: 'Tech Career Networking', description: 'Proximity to founders and capital' },
          { id: 'adventure', name: 'Sensory Novelty & Adventure', description: 'Memories created per square day' },
          { id: 'reversibility', name: 'Reversibility', description: 'Ability to move back' },
        ],
        rows: [
          {
            dimensionId: 'cost',
            dimensionName: 'Cost of Living & Savings Rate',
            christensenType: 'Hygiene',
            kahnemanSensitivity: 'Gain-Driven',
            optionEvaluations: [
              {
                optionId: 'opt-tokyo',
                optionName: 'Relocate to Tokyo',
                rating: 9.3,
                ratingLabel: 'Phenomenal',
                highlight: 'US salary in Yen is god-tier',
                analysis: 'Enables saving $40,000+ extra per year while upgrading lifestyle standards.',
              },
              {
                optionId: 'opt-sf',
                optionName: 'Remain in SF',
                rating: 3.5,
                ratingLabel: 'Punishing',
                highlight: 'Extreme burn rate',
                analysis: 'High rents and high local taxes take a heavy toll on personal wealth building.',
              },
            ],
          },
          {
            dimensionId: 'safety',
            dimensionName: 'Urban Safety & Cleanliness',
            christensenType: 'Hygiene',
            kahnemanSensitivity: 'Loss-Heavy',
            optionEvaluations: [
              {
                optionId: 'opt-tokyo',
                optionName: 'Relocate to Tokyo',
                rating: 9.9,
                ratingLabel: 'World Standard',
                highlight: 'Pristine tranquility',
                analysis: 'Leave your phone on the cafe table to hold your seat without fear of theft.',
              },
              {
                optionId: 'opt-sf',
                optionName: 'Remain in SF',
                rating: 4.8,
                ratingLabel: 'Fragmented',
                highlight: 'Property crime worries',
                analysis: 'Car break-ins and street crises inject subtle baseline anxiety into daily commutes.',
              },
            ],
          },
          {
            dimensionId: 'network',
            dimensionName: 'Tech Career Networking',
            christensenType: 'Motivator',
            kahnemanSensitivity: 'Balanced',
            optionEvaluations: [
              {
                optionId: 'opt-tokyo',
                optionName: 'Relocate to Tokyo',
                rating: 5.2,
                ratingLabel: 'Niche',
                highlight: 'Isolated from Bay bubble',
                analysis: 'Growing expat tech community, but disconnected from daily Silicon Valley chatter.',
              },
              {
                optionId: 'opt-sf',
                optionName: 'Remain in SF',
                rating: 9.8,
                ratingLabel: 'Global Epicenter',
                highlight: 'Unrivaled serendipity',
                analysis: 'Every week brings founders, VCs, and AI researchers to your neighborhood.',
              },
            ],
          },
          {
            dimensionId: 'adventure',
            dimensionName: 'Sensory Novelty & Adventure',
            christensenType: 'Motivator',
            kahnemanSensitivity: 'Gain-Driven',
            optionEvaluations: [
              {
                optionId: 'opt-tokyo',
                optionName: 'Relocate to Tokyo',
                rating: 9.7,
                ratingLabel: 'Unforgettable',
                highlight: 'Peak exploratory joy',
                analysis: 'Every alleyway, izakaya, shinkansen day-trip, and season provides profound awe.',
              },
              {
                optionId: 'opt-sf',
                optionName: 'Remain in SF',
                rating: 6.0,
                ratingLabel: 'Familiar',
                highlight: 'Predictable routines',
                analysis: 'Beautiful nature nearby (Marin, Tahoe), but city life feels thoroughly mapped.',
              },
            ],
          },
          {
            dimensionId: 'reversibility',
            dimensionName: 'Reversibility',
            christensenType: 'Hygiene',
            kahnemanSensitivity: 'Loss-Heavy',
            optionEvaluations: [
              {
                optionId: 'opt-tokyo',
                optionName: 'Relocate to Tokyo',
                rating: 8.5,
                ratingLabel: 'Easily Reversible',
                highlight: '1-Year Experiment',
                analysis: 'Can take a 12-month lease in Tokyo. If homesick or career feels disconnected, return to SF with memories for life.',
              },
              {
                optionId: 'opt-sf',
                optionName: 'Remain in SF',
                rating: 8.0,
                ratingLabel: 'High',
                highlight: 'Status quo default',
                analysis: 'Default inertia, but youth in your late 20s is an asset with an expiration date.',
              },
            ],
          },
        ],
      },
      swotAnalysis: [
        {
          optionId: 'opt-tokyo',
          optionName: 'Relocate to Tokyo',
          strengths: ['Extraordinary safety and public transit', 'Huge financial arbitrage earning USD', 'Immense cultural richness'],
          weaknesses: ['Challenging time zones for US work', 'Expat outsider status', 'Bureaucracy and language barrier'],
          opportunities: ['Build bridgehead between US tech and Japanese startup ecosystem', 'Travel across East Asia effortlessly', 'Learn conversational Japanese'],
          threats: ['Natural disaster readiness (earthquakes)', 'Isolation if expat community proves transient'],
          strategicTakeaway: 'An unmatched 1-2 year chapter that will enrich your worldview and compound your savings.',
        },
        {
          optionId: 'opt-sf',
          optionName: 'Remain in SF Bay Area',
          strengths: ['Unmatched tech ecosystem', 'Deep existing social network', 'Effortless corporate time zone alignment'],
          weaknesses: ['High cost of living', 'Quality of life friction in urban core', 'Echo chamber fatigue'],
          opportunities: ['Catch next wave of AI startup co-founder opportunities', 'Invest in Bay Area property if market cools'],
          threats: ['Complacency and watching another year pass in routine', 'High burnout rates in the local tech pressure cooker'],
          strategicTakeaway: 'A safe choice for career maximization that sacrifices novel sensory joy and savings rate.',
        },
      ],
      weightedScoring: {
        criteria: [
          { id: 'crit-adventure', name: 'Life Adventure & Novelty', description: 'Memories and expanding world perspective', defaultWeight: 9, aspirationFloor: 6, christensenRole: 'Motivator' },
          { id: 'crit-fin-sav', name: 'Savings & Purchasing Power', description: 'Rate of wealth accumulation after expenses', defaultWeight: 8, aspirationFloor: 5, christensenRole: 'Hygiene' },
          { id: 'crit-safety', name: 'Urban Peace & Safety', description: 'Freedom from street stress and noise', defaultWeight: 8, aspirationFloor: 6, christensenRole: 'Hygiene' },
          { id: 'crit-career-opp', name: 'Career Opportunities', description: 'Immediate network growth and serendipity', defaultWeight: 7, aspirationFloor: 5, christensenRole: 'Motivator' },
          { id: 'crit-social', name: 'Social Ease & Belonging', description: 'Effortless friendships and communication', defaultWeight: 6, aspirationFloor: 5, christensenRole: 'Hygiene' },
        ],
        optionScores: [
          {
            optionId: 'opt-tokyo',
            optionName: 'Relocate to Tokyo',
            scores: [
              { criteriaId: 'crit-adventure', score: 10, rationale: 'One of the most extraordinary urban adventures on earth.' },
              { criteriaId: 'crit-fin-sav', score: 9, rationale: 'Drastically lower rent and cost of dining on US remote salary.' },
              { criteriaId: 'crit-safety', score: 10, rationale: 'Safest mega-metropolis in the world.' },
              { criteriaId: 'crit-career-opp', score: 5, rationale: 'Detached from Bay Area AI core.' },
              { criteriaId: 'crit-social', score: 5, rationale: 'Takes intentional effort to build an English-speaking tribe.' },
            ],
          },
          {
            optionId: 'opt-sf',
            optionName: 'Remain in SF',
            scores: [
              { criteriaId: 'crit-adventure', score: 5, rationale: 'Familiar territory and routine routines.' },
              { criteriaId: 'crit-fin-sav', score: 4, rationale: 'Extreme rent and lifestyle drain.' },
              { criteriaId: 'crit-safety', score: 5, rationale: 'Daily petty crime and street blight realities.' },
              { criteriaId: 'crit-career-opp', score: 10, rationale: 'The undisputed center of the tech universe.' },
              { criteriaId: 'crit-social', score: 8, rationale: 'Familiar culture and established friendship base.' },
            ],
          },
        ],
      },
      mentalModels: {
        rule101010: {
          tenMinutes: 'Committing to Tokyo brings sudden butterflies about packing and leases; staying in SF feels warm and effortless.',
          tenMonths: 'In Tokyo, you are taking weekend bullet trains to Kyoto and eating Michelin-level ramen for $9; in SF, you are on the same routine route.',
          tenYears: 'In 2036, you will never say "I really regret spending a year in Tokyo in my late 20s." It will be one of the crown-jewel stories of your youth.',
          synthesis: 'The Tokyo leap yields lifelong narrative capital that cannot be purchased once family obligations tie you down later in life.',
        },
        regretMinimization: {
          reflectionAt80: 'Looking back from older age, the greatest regrets are almost never what we tried and abandoned; they are the adventures we postponed until the window closed.',
          biggestUnforgivableMistake: 'Staying in an overpriced city out of pure inertia while possessing a remote job and zero dependent commitments.',
          recommendation: 'Give yourself a defined 12-month expedition to Tokyo.',
        },
        reversibilityTest: {
          doorType: 'Type 2 (Two-Way Door)',
          unwindingStrategy: 'Treat it as a 1-year experiment. Put non-essential possessions in storage. If you want to return to SF next year, landlords and tech employers will be waiting.',
          downsideCap: 'Cost of a plane ticket and breaking a lease—easily covered by the savings generated in your first 4 months in Japan.',
        },
        gutCheckOracle: {
          coinFlipInsight: 'When thinking about stepping off the plane at Haneda Airport at midnight, does your chest expand or tighten? That is your compass.',
          subconsciousClues: 'You are 29, single, and remote. This is the exact life window people reminisce about for decades.',
        },
      },
      researchFrameworks: {
        trompenaarsHampdenTurner: {
          poleXLabel: 'Global Cultural Expansion & Financial Arbitrage',
          poleYLabel: 'Silicon Valley Network Density & Belonging',
          reconciledHelixName: 'Transpacific Networked Nomad',
          reconciledSynthesis:
            'Reconcile Tokyo (9,5) and SF (4,9) toward (10,10) by turning Tokyo into a high-savings base while flying back to SF quarterly for key founder summits and cultivating Tokyo’s surging AI builder scene.',
          optionCoordinates: [
            {
              optionId: 'opt-tokyo',
              optionName: 'Relocate to Tokyo',
              poleXScore: 9.5,
              poleYScore: 5.5,
              diagnosis: 'Unmatched cultural wonder and financial arbitrage (X=9.5), moderate SF career distance (Y=5.5).',
            },
            {
              optionId: 'opt-sf',
              optionName: 'Remain in SF Bay Area',
              poleXScore: 4.5,
              poleYScore: 9.2,
              diagnosis: 'Maximum venture gravity (Y=9.2) at heavy personal wealth and novelty cost (X=4.5).',
            },
          ],
        },
        wendySmithParadox: {
          coreTension: 'Global Wanderlust & Savings Arbitrage vs. Local Ecosystem Gravity & Established Tribe.',
          whyEitherOrFails:
            'Treating Tokyo as permanent exile creates social anxiety; staying in SF forever breeds quiet resentment over missed youth.',
          differentiationMove:
            'Maintain a digital/quarterly Bay Area presence while immersing deeply in Tokyo local communities (language meetups, climbing gyms, design salons).',
          integrationMove:
            'Time-boxed 12-month chapter with quarterly "SF Bridge Weeks" funded easily by your $40k+ annual rent savings.',
          bothAndActionPlan:
            'Sign a 1-year furnished Tokyo lease, pre-book two SF conference return trips, and turn geographic distance into an exotic connector superpower.',
        },
        herbertSimonBounded: {
          informationGapWarning:
            'No amount of Reddit threads or YouTube vlogs can simulate how you personally feel working async US hours from Minato.',
          satisficingRecommendation:
            'Both options hit 5/5 on your minimum Career & Social floors while Tokyo dramatically outperforms SF on Urban Safety (10 vs 5) and Savings (9 vs 4)—making Tokyo both the Maximizing AND Satisficing winner.',
          searchStoppingRule:
            'Stop researching neighborhoods once HR signs off on remote residency and you shortlist 2 furnished month-to-month apartments.',
        },
        cialdiniInfluenceAudit: {
          preSuasionFramingAlert:
            'Travel romanticism ("Tokyo Aesthetic") and Bay Area FOMO ("If I leave, I will miss the next unicorn") pull in opposite directions.',
          optionBiases: [
            {
              optionId: 'opt-tokyo',
              optionName: 'Relocate to Tokyo',
              activeTriggers: ['Social Proof (Expat Creators)', 'Scarcity (Youth Window)'],
              biasInflationPoints: 4.0,
              realityCheck: 'Even subtracting 4 pts of travel-vlog romanticism, USD/JPY financial math and crime safety remain objectively superior.',
            },
            {
              optionId: 'opt-sf',
              optionName: 'Remain in SF Bay Area',
              activeTriggers: ['Social Proof (Tech Herd)', 'Commitment & Consistency (Existing Lease)'],
              biasInflationPoints: 5.5,
              realityCheck: 'SF’s pull relies heavily on FOMO and sunk-cost routine rather than genuine daily happiness.',
            },
          ],
        },
        christensenJTBD: {
          coreJobToBeDone:
            'Reclaim daily joy, physical safety, and wealth velocity before settling into heavier mid-30s obligations.',
          hygieneVsMotivatorInsight:
            'SF rent stress and street safety erode Hygiene every single morning; Tokyo restores Hygiene to 10/10 while igniting the Adventure Motivator.',
          optionAudits: [
            {
              optionId: 'opt-tokyo',
              optionName: 'Relocate to Tokyo',
              functionalJobFit: 'Supercharges savings rate and daily urban ease on identical remote output.',
              emotionalSocialJobFit: 'Creates lifelong identity expansion and awe, requiring intentional social outreach.',
              marginalCostTrap: 'Do not compromise sleep hygiene on late-night US Zoom calls—set clear async boundaries upfront.',
            },
            {
              optionId: 'opt-sf',
              optionName: 'Remain in SF Bay Area',
              functionalJobFit: 'Frictionless career serendipity at unsustainable housing burn.',
              emotionalSocialJobFit: 'Maintains comfortable friend proximity while risking slow lifestyle stagnation.',
              marginalCostTrap: 'Renewing another 12-month SF lease "just until the next promo cycle" silently locks away your 20s.',
            },
          ],
        },
        kahnemanHahnemann: {
          system1Trap:
            'System 1 fears the logistics of moving abroad (visas, shipping boxes) disproportionately relative to the silent ongoing cost of staying.',
          system2OutsideViewBaseRate:
            'Outside View: Nearly 90% of remote engineers who take a 1-year abroad chapter in their late 20s report it as a top-3 life highlight, regardless of whether they stay or return.',
          lossAversionInsight:
            'SF feels safer purely due to status-quo bias, yet paying $40k+ extra for lower urban safety is a guaranteed real-world loss.',
          hahnemannMinimumDoseTest:
            'Hahnemannian Minimum-Dose Probe: Spend 21 consecutive working days in a furnished Shibuya studio before terminating your SF lease to test real sleep and async team cadence.',
        },
      },
      verdict: {
        recommendedOptionId: 'opt-tokyo',
        recommendedOptionName: 'Relocate to Tokyo (12-Month Horizon)',
        confidencePercentage: 88,
        verdictHeadline: 'Execute the 12-Month Tokyo Expedition: Frame It as an Experiment, Not a Forever Move',
        coreRationale: 'You possess the rarest trifecta of adult life: location-independent income, zero dependents, and prime physical health. Staying in San Francisco generates incremental comfort at astronomical financial cost. Moving to Tokyo generates massive wealth savings and indelible life memories with near-zero downside risk.',
        whenToPickAlternative: 'Remain in SF only if your US employer strictly mandates Pacific Standard Time collaboration with 8 AM meetings every day, or if you are in the middle of active seed funding rounds that require weekly in-person meetings on Sand Hill Road.',
        immediateActions: [
          {
            step: 1,
            action: 'Secure written confirmation from your company HR regarding remote international residency limits and tax compliance.',
            timeframe: 'Next 24 Hours',
            purpose: 'Confirm there are zero administrative blockers to working abroad.',
          },
          {
            step: 2,
            action: 'Book a 3-week furnished trial stay in Shibuya or Roppongi during upcoming PTO to test the time zone overlap firsthand.',
            timeframe: 'Next 48 Hours',
            purpose: 'De-risk the transition with empirical evidence before shipping your life.',
          },
          {
            step: 3,
            action: 'Calculate your exact net savings differential using current USD/JPY exchange rates.',
            timeframe: 'Within 48 Hours',
            purpose: 'Lock in mathematical certainty on your financial upside.',
          },
        ],
      },
    },
  },
];
