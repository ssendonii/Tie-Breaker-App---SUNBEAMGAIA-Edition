import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Initialize Gemini SDK with User-Agent header as required
function getGeminiClient() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error('GEMINI_API_KEY environment variable is not set. Please ensure it is provided in Settings > Secrets.');
  }
  return new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const PRIMARY_MODEL = 'gemini-3.8-flash';
const FALLBACK_MODELS = ['gemini-3.1-flash-lite'];

function isTransientHighDemandError(error: any): boolean {
  const status = error?.status ?? error?.error?.code;
  const msg = String(error?.message || '');
  return (
    status === 503 ||
    status === 429 ||
    msg.includes('"code":503') ||
    msg.includes('UNAVAILABLE') ||
    msg.includes('high demand') ||
    msg.includes('RESOURCE_EXHAUSTED') ||
    msg.includes('timed out')
  );
}

function isModelUnavailableError(error: any): boolean {
  const status = error?.status ?? error?.error?.code;
  const msg = String(error?.message || '');
  return status === 404 || msg.includes('NOT_FOUND') || msg.includes('is not found');
}

function formatGeminiError(error: any): { statusCode: number; message: string } {
  const rawMsg = String(error?.message || '');
  if (isTransientHighDemandError(error)) {
    return {
      statusCode: 503,
      message:
        'The AI model is temporarily experiencing high demand. Please wait a few seconds and try again.',
    };
  }
  return {
    statusCode: 500,
    message: rawMsg || 'Failed to synthesize decision analysis. Please try again.',
  };
}

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`${label} timed out after ${Math.round(ms / 1000)}s`));
    }, ms);
    promise.then(
      (val) => {
        clearTimeout(timer);
        resolve(val);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      }
    );
  });
}

async function generateWithRetryAndFallback(
  ai: GoogleGenAI,
  contents: string,
  config: Record<string, any>
) {
  const modelsToTry = [PRIMARY_MODEL, ...FALLBACK_MODELS];
  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      const modelConfig = {
        ...config,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      };
      return await withTimeout(
        ai.models.generateContent({
          model,
          contents,
          config: modelConfig,
        }),
        18000,
        `Model ${model}`
      );
    } catch (err: any) {
      lastError = err;
      if (!isTransientHighDemandError(err) && !isModelUnavailableError(err)) {
        throw err;
      }
      console.warn(`Failover triggered from model "${model}":`, err?.message || err);
    }
  }

  throw lastError;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  // Health check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', hasKey: Boolean(process.env.GEMINI_API_KEY) });
  });

  // Main Decision Analysis Endpoint
  app.post('/api/decision/analyze', async (req: Request, res: Response) => {
    try {
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({
          error: 'Gemini API key is not configured. Please ensure GEMINI_API_KEY is available.',
        });
      }

      const {
        title,
        options,
        context,
        priorities,
        decisionStyle,
      } = req.body;

      if (!title || !options || !Array.isArray(options) || options.length < 2) {
        return res.status(400).json({
          error: 'Please provide a decision title and at least two options to evaluate.',
        });
      }

      const systemPrompt = `You are "The Tie Breaker (SUNBEAMGAIA Edition)", an elite decision strategist, cognitive counselor, and rational decision architect.
Your mission is to bring radiant clarity, eliminate decision paralysis, uncover hidden trade-offs, and provide high-conviction decision intelligence grounded in peer-reviewed decision science:
1. Herbert A. Simon (Bounded Rationality & Satisficing vs. Maximizing, aspiration thresholds, stopping rules).
2. Fons Trompenaars & Charles Hampden-Turner (Dilemma Reconciliation Theory: mapping opposing value poles on a 1-10 dual-axis grid and designing a synergistic (10,10) helix instead of either/or extremes or weak (5,5) compromise).
3. Wendy K. Smith (Paradox Theory & "Both/And" Mindset: Differentiation + Integration moves for persistent tensions).
4. Clayton M. Christensen (Jobs-to-be-Done functional/emotional/social alignment, Hygiene Factors vs. Motivators, and Marginal-Cost vs. Full-Cost traps).
5. Robert Cialdini (Influence Triggers & Pre-suasion Audit: quantifying artificial FOMO/Scarcity/Social Proof/Authority/Sunk-Cost inflation points).
6. Daniel Kahneman & Samuel Hahnemann (Prospect Theory Loss Aversion ~2x, System 1 vs. System 2 Outside-View Base Rates, plus the Hahnemannian Minimum-Dose Titration Probe—testing a low-shock micro-dose before full irreversible commitment).

Style / Persona:
- Authoritative yet warm, grounded, realistic, unsparing about hidden risks, inspiring clarity.
- Decision lens selected by user: ${decisionStyle || 'Balanced Wisdom'}.
- Tone: Sunbeam Gaia (radiant illumination, grounded practical truth, actionable).

Always return valid JSON strictly complying with the requested schema. Provide rich, insightful, specific rationales, not generic platitudes.`;

      const userPrompt = `Analyze the following decision dilemma:
Decision Title / Question: "${title}"
Options to compare: ${JSON.stringify(options)}
Additional Context / Constraints: "${context || 'No specific background provided'}"
Personal Priorities & Values: "${priorities || 'General well-being, long-term flourishing, and risk management'}"

Produce a complete, deep decision intelligence dossier containing:
1. Executive summary of the dilemma dynamics.
2. Comprehensive Pros & Cons for EACH option (at least 3-5 distinct pros and 3-5 distinct cons per option, labeled by category and impact level, highlighting critical dealbreakers or superpowers).
3. A multi-dimensional comparison table comparing all options across standard key dimensions, classifying each dimension by Clayton Christensen's role ("Motivator" vs "Hygiene") and Kahneman's Prospect sensitivity ("Loss-Heavy", "Gain-Driven", or "Balanced").
4. Full SWOT analysis for each option (Strengths, Weaknesses, Opportunities, Threats) with strategic quadrant summaries.
5. A weighted scoring system (MCDA) with 5 to 7 tailored evaluation criteria. For EACH criterion, specify: defaultWeight (1-10), Herbert Simon's aspirationFloor (1-10 minimum acceptable threshold), and Christensen's christensenRole ("Motivator" or "Hygiene"). Score every option (1-10) with specific rationales.
6. The Tie Breaker Mental Models (10-10-10 Rule, Regret Minimization at 80, Reversibility Type 1 vs Type 2, Gut Check Coin Flip).
7. Research Frameworks Synthesis ("researchFrameworks"):
   - trompenaarsHampdenTurner: Identify the two core opposing value poles (poleXLabel, poleYLabel), assign each option coordinates (poleXScore 1-10, poleYScore 1-10), and craft the (10,10) reconciledHelixName & synthesis.
   - wendySmithParadox: Core tension, why Either/Or fails, differentiationMove, integrationMove, and Both/And action plan.
   - herbertSimonBounded: Information gap warning, satisficing recommendation, and concrete search stopping rule.
   - cialdiniInfluenceAudit: Pre-suasion framing alert, plus for each option list active Cialdini triggers and biasInflationPoints (0-15 points of artificial psychological inflation).
   - christensenJTBD: Core Job-to-be-Done, Hygiene vs. Motivator insight, and per-option JTBD + marginal cost trap audit.
   - kahnemanHahnemann: System 1 trap, System 2 Outside-View Base Rate, Loss Aversion insight, and a concrete Hahnemannian Minimum-Dose Titration micro-experiment.
8. The Definitive Tie-Breaker Verdict (winner, confidence %, headline, rationale, when to pick alternative, and 3 immediate 48h actions).`;

      const ai = getGeminiClient();

      const response = await generateWithRetryAndFallback(ai, userPrompt, {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              summary: { type: Type.STRING, description: 'Executive dilemma synthesis' },
              options: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    name: { type: Type.STRING },
                    tagline: { type: Type.STRING },
                    shortDescription: { type: Type.STRING },
                  },
                  required: ['id', 'name', 'tagline', 'shortDescription'],
                },
              },
              prosAndCons: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    optionId: { type: Type.STRING },
                    optionName: { type: Type.STRING },
                    pros: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          title: { type: Type.STRING },
                          description: { type: Type.STRING },
                          category: { type: Type.STRING },
                          impact: { type: Type.STRING, description: 'high, medium, low' },
                          isCritical: { type: Type.BOOLEAN },
                        },
                        required: ['title', 'description', 'category', 'impact', 'isCritical'],
                      },
                    },
                    cons: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          title: { type: Type.STRING },
                          description: { type: Type.STRING },
                          category: { type: Type.STRING },
                          impact: { type: Type.STRING, description: 'high, medium, low' },
                          isCritical: { type: Type.BOOLEAN },
                        },
                        required: ['title', 'description', 'category', 'impact', 'isCritical'],
                      },
                    },
                  },
                  required: ['optionId', 'optionName', 'pros', 'cons'],
                },
              },
              comparisonTable: {
                type: Type.OBJECT,
                properties: {
                  dimensions: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        name: { type: Type.STRING },
                        description: { type: Type.STRING },
                      },
                      required: ['id', 'name', 'description'],
                    },
                  },
                  rows: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        dimensionId: { type: Type.STRING },
                        dimensionName: { type: Type.STRING },
                        christensenType: { type: Type.STRING, description: 'Motivator or Hygiene' },
                        kahnemanSensitivity: { type: Type.STRING, description: 'Loss-Heavy, Gain-Driven, or Balanced' },
                        optionEvaluations: {
                          type: Type.ARRAY,
                          items: {
                            type: Type.OBJECT,
                            properties: {
                              optionId: { type: Type.STRING },
                              optionName: { type: Type.STRING },
                              rating: { type: Type.NUMBER, description: 'Score 1 to 10' },
                              ratingLabel: { type: Type.STRING, description: 'e.g. Excellent, High, Moderate, Poor' },
                              highlight: { type: Type.STRING },
                              analysis: { type: Type.STRING },
                            },
                            required: ['optionId', 'optionName', 'rating', 'ratingLabel', 'highlight', 'analysis'],
                          },
                        },
                      },
                      required: ['dimensionId', 'dimensionName', 'christensenType', 'kahnemanSensitivity', 'optionEvaluations'],
                    },
                  },
                },
                required: ['dimensions', 'rows'],
              },
              swotAnalysis: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    optionId: { type: Type.STRING },
                    optionName: { type: Type.STRING },
                    strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                    weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                    opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
                    threats: { type: Type.ARRAY, items: { type: Type.STRING } },
                    strategicTakeaway: { type: Type.STRING },
                  },
                  required: ['optionId', 'optionName', 'strengths', 'weaknesses', 'opportunities', 'threats', 'strategicTakeaway'],
                },
              },
              weightedScoring: {
                type: Type.OBJECT,
                properties: {
                  criteria: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        name: { type: Type.STRING },
                        description: { type: Type.STRING },
                        defaultWeight: { type: Type.NUMBER, description: '1 to 10' },
                        aspirationFloor: { type: Type.NUMBER, description: 'Herbert Simon minimum acceptable threshold 1 to 10' },
                        christensenRole: { type: Type.STRING, description: 'Motivator or Hygiene' },
                      },
                      required: ['id', 'name', 'description', 'defaultWeight', 'aspirationFloor', 'christensenRole'],
                    },
                  },
                  optionScores: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        optionId: { type: Type.STRING },
                        optionName: { type: Type.STRING },
                        scores: {
                          type: Type.ARRAY,
                          items: {
                            type: Type.OBJECT,
                            properties: {
                              criteriaId: { type: Type.STRING },
                              score: { type: Type.NUMBER, description: 'Score 1 to 10' },
                              rationale: { type: Type.STRING },
                            },
                            required: ['criteriaId', 'score', 'rationale'],
                          },
                        },
                      },
                      required: ['optionId', 'optionName', 'scores'],
                    },
                  },
                },
                required: ['criteria', 'optionScores'],
              },
              mentalModels: {
                type: Type.OBJECT,
                properties: {
                  rule101010: {
                    type: Type.OBJECT,
                    properties: {
                      tenMinutes: { type: Type.STRING },
                      tenMonths: { type: Type.STRING },
                      tenYears: { type: Type.STRING },
                      synthesis: { type: Type.STRING },
                    },
                    required: ['tenMinutes', 'tenMonths', 'tenYears', 'synthesis'],
                  },
                  regretMinimization: {
                    type: Type.OBJECT,
                    properties: {
                      reflectionAt80: { type: Type.STRING },
                      biggestUnforgivableMistake: { type: Type.STRING },
                      recommendation: { type: Type.STRING },
                    },
                    required: ['reflectionAt80', 'biggestUnforgivableMistake', 'recommendation'],
                  },
                  reversibilityTest: {
                    type: Type.OBJECT,
                    properties: {
                      doorType: { type: Type.STRING, description: 'Type 1 (One-Way) or Type 2 (Two-Way)' },
                      unwindingStrategy: { type: Type.STRING },
                      downsideCap: { type: Type.STRING },
                    },
                    required: ['doorType', 'unwindingStrategy', 'downsideCap'],
                  },
                  gutCheckOracle: {
                    type: Type.OBJECT,
                    properties: {
                      coinFlipInsight: { type: Type.STRING },
                      subconsciousClues: { type: Type.STRING },
                    },
                    required: ['coinFlipInsight', 'subconsciousClues'],
                  },
                },
                required: ['rule101010', 'regretMinimization', 'reversibilityTest', 'gutCheckOracle'],
              },
              researchFrameworks: {
                type: Type.OBJECT,
                properties: {
                  trompenaarsHampdenTurner: {
                    type: Type.OBJECT,
                    properties: {
                      poleXLabel: { type: Type.STRING },
                      poleYLabel: { type: Type.STRING },
                      reconciledHelixName: { type: Type.STRING },
                      reconciledSynthesis: { type: Type.STRING },
                      optionCoordinates: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            optionId: { type: Type.STRING },
                            optionName: { type: Type.STRING },
                            poleXScore: { type: Type.NUMBER, description: '1 to 10' },
                            poleYScore: { type: Type.NUMBER, description: '1 to 10' },
                            diagnosis: { type: Type.STRING },
                          },
                          required: ['optionId', 'optionName', 'poleXScore', 'poleYScore', 'diagnosis'],
                        },
                      },
                    },
                    required: ['poleXLabel', 'poleYLabel', 'reconciledHelixName', 'reconciledSynthesis', 'optionCoordinates'],
                  },
                  wendySmithParadox: {
                    type: Type.OBJECT,
                    properties: {
                      coreTension: { type: Type.STRING },
                      whyEitherOrFails: { type: Type.STRING },
                      differentiationMove: { type: Type.STRING },
                      integrationMove: { type: Type.STRING },
                      bothAndActionPlan: { type: Type.STRING },
                    },
                    required: ['coreTension', 'whyEitherOrFails', 'differentiationMove', 'integrationMove', 'bothAndActionPlan'],
                  },
                  herbertSimonBounded: {
                    type: Type.OBJECT,
                    properties: {
                      informationGapWarning: { type: Type.STRING },
                      satisficingRecommendation: { type: Type.STRING },
                      searchStoppingRule: { type: Type.STRING },
                    },
                    required: ['informationGapWarning', 'satisficingRecommendation', 'searchStoppingRule'],
                  },
                  cialdiniInfluenceAudit: {
                    type: Type.OBJECT,
                    properties: {
                      preSuasionFramingAlert: { type: Type.STRING },
                      optionBiases: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            optionId: { type: Type.STRING },
                            optionName: { type: Type.STRING },
                            activeTriggers: { type: Type.ARRAY, items: { type: Type.STRING } },
                            biasInflationPoints: { type: Type.NUMBER, description: '0 to 15' },
                            realityCheck: { type: Type.STRING },
                          },
                          required: ['optionId', 'optionName', 'activeTriggers', 'biasInflationPoints', 'realityCheck'],
                        },
                      },
                    },
                    required: ['preSuasionFramingAlert', 'optionBiases'],
                  },
                  christensenJTBD: {
                    type: Type.OBJECT,
                    properties: {
                      coreJobToBeDone: { type: Type.STRING },
                      hygieneVsMotivatorInsight: { type: Type.STRING },
                      optionAudits: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            optionId: { type: Type.STRING },
                            optionName: { type: Type.STRING },
                            functionalJobFit: { type: Type.STRING },
                            emotionalSocialJobFit: { type: Type.STRING },
                            marginalCostTrap: { type: Type.STRING },
                          },
                          required: ['optionId', 'optionName', 'functionalJobFit', 'emotionalSocialJobFit', 'marginalCostTrap'],
                        },
                      },
                    },
                    required: ['coreJobToBeDone', 'hygieneVsMotivatorInsight', 'optionAudits'],
                  },
                  kahnemanHahnemann: {
                    type: Type.OBJECT,
                    properties: {
                      system1Trap: { type: Type.STRING },
                      system2OutsideViewBaseRate: { type: Type.STRING },
                      lossAversionInsight: { type: Type.STRING },
                      hahnemannMinimumDoseTest: { type: Type.STRING },
                    },
                    required: ['system1Trap', 'system2OutsideViewBaseRate', 'lossAversionInsight', 'hahnemannMinimumDoseTest'],
                  },
                },
                required: [
                  'trompenaarsHampdenTurner',
                  'wendySmithParadox',
                  'herbertSimonBounded',
                  'cialdiniInfluenceAudit',
                  'christensenJTBD',
                  'kahnemanHahnemann',
                ],
              },
              verdict: {
                type: Type.OBJECT,
                properties: {
                  recommendedOptionId: { type: Type.STRING },
                  recommendedOptionName: { type: Type.STRING },
                  confidencePercentage: { type: Type.NUMBER },
                  verdictHeadline: { type: Type.STRING },
                  coreRationale: { type: Type.STRING },
                  whenToPickAlternative: { type: Type.STRING },
                  immediateActions: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        step: { type: Type.NUMBER },
                        action: { type: Type.STRING },
                        timeframe: { type: Type.STRING },
                        purpose: { type: Type.STRING },
                      },
                      required: ['step', 'action', 'timeframe', 'purpose'],
                    },
                  },
                },
                required: [
                  'recommendedOptionId',
                  'recommendedOptionName',
                  'confidencePercentage',
                  'verdictHeadline',
                  'coreRationale',
                  'whenToPickAlternative',
                  'immediateActions',
                ],
              },
            },
            required: [
              'title',
              'summary',
              'options',
              'prosAndCons',
              'comparisonTable',
              'swotAnalysis',
              'weightedScoring',
              'mentalModels',
              'researchFrameworks',
              'verdict',
            ],
          },
        });

      let rawText = (response.text || '{}').trim();
      if (rawText.startsWith('```json')) {
        rawText = rawText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (rawText.startsWith('```')) {
        rawText = rawText.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      const parsedData = JSON.parse(rawText);

      return res.json({
        success: true,
        data: parsedData,
      });
    } catch (error: any) {
      console.error('Error in /api/decision/analyze:', error);
      const formatted = formatGeminiError(error);
      return res.status(formatted.statusCode).json({
        error: formatted.message,
      });
    }
  });

  // Drill-down / Devil's Advocate / Follow-up Q&A
  app.post('/api/decision/consult', async (req: Request, res: Response) => {
    try {
      const { dilemmaTitle, decisionData, userQuestion } = req.body;

      if (!userQuestion) {
        return res.status(400).json({ error: 'Question is required.' });
      }

      const ai = getGeminiClient();

      const systemPrompt = `You are the SunbeamGaia Decision Oracle & Devil's Advocate.
You have the complete analysis of the user's dilemma: "${dilemmaTitle}".
Answer the user's specific follow-up question or challenge directly with sharp, high-conviction decision analysis, pointing out blind spots, stress-testing assumptions, or suggesting mitigating actions.
Keep responses articulate, structured, and under 250 words.`;

      const consultPrompt = `Dilemma Context: ${dilemmaTitle}
Summary of analysis: ${JSON.stringify({
        verdict: decisionData?.verdict?.verdictHeadline,
        winner: decisionData?.verdict?.recommendedOptionName,
        keyRationale: decisionData?.verdict?.coreRationale,
      })}

User Follow-Up Question / Challenge:
"${userQuestion}"`;

      const response = await generateWithRetryAndFallback(ai, consultPrompt, {
        systemInstruction: systemPrompt,
      });

      return res.json({
        success: true,
        answer: response.text || 'Unable to generate response.',
      });
    } catch (error: any) {
      console.error('Error in /api/decision/consult:', error);
      const formatted = formatGeminiError(error);
      return res.status(formatted.statusCode).json({
        error: formatted.message,
      });
    }
  });

  // Serve static files or Vite middlewares
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  const PORT = Number(process.env.PORT) || 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SunbeamGaia Tie Breaker server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
