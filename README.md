# The Tie Breaker (SUNBEAMGAIA Edition)

An AI-powered decision intelligence application built to resolve complex personal, strategic, and career dilemmas through multi-criteria scoring, behavioral decision science, paradox reconciliation, and structured qualitative matrices.

---

## Core Capabilities

- **Multi-Theory Weighted Scoring Engine**: Combines classical weighted maximizing with Herbert Simon's Satisficing aspiration floors, Kahneman's Prospect Theory loss aversion ($\lambda$), Cialdini's influence de-biasing, and Clayton Christensen's Motivator vs. Hygiene split.
- **Research & Paradox Lab**: Interactive 2D Trompenaars & Hampden-Turner Dilemma Reconciliation Grid, Wendy K. Smith "Both/And" Differentiation & Integration blueprints, Christensen Jobs-to-be-Done audits, Cialdini Pre-suasion audits, and Kahneman/Hahnemann Outside-View & Minimum-Dose Titration probes.
- **Divergence Comparison Matrix**: Side-by-side dimensional benchmarking ranked by numerical spread ($\Delta$), tagged by Motivator/Hygiene role and loss sensitivity.
- **Pros & Cons Deep-Dive**: Domain-filterable advantages and vulnerabilities with Superpower and Dealbreaker flags, plus custom user-added factors.
- **2x2 SWOT Strategic Matrix**: Option-by-option audit of Strengths, Weaknesses, Opportunities, and Threats.
- **Tie-Breaker Mental Models & Coin Oracle**: 10-10-10 temporal horizon, 80-year-old Regret Minimization, Type 1 vs. Type 2 door reversibility, and an interactive Coin Toss psychological gut-check.
- **Definitive Verdict & 48-Hour Protocol**: Clear winner synthesis, alternative pivot conditions, three immediate momentum steps, and a follow-up **Devil's Advocate Oracle** consultation drawer.
- **Dossier Library & Exports**: Curated starter presets, browser `localStorage` persistence, one-click Markdown report copy, and print/PDF styling.

---

## Architecture Overview

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide icons, Vite
- **Backend**: Express server (`server.ts`) hosting Vite middleware in development and serving static builds in production
- **AI Integration**: Server-side `@google/genai` SDK with structured JSON schema enforcement, automatic retry backoff, and multi-model fallback routing

---

## Version History

### v3.0.0 — 2026-11-12
**Resilient Multi-Model Inference & Error Handling**
- Added exponential-backoff retry logic (`generateWithRetryAndFallback`) in `server.ts` to handle transient `503 UNAVAILABLE` and `429 RESOURCE_EXHAUSTED` demand spikes.
- Implemented automatic server-side model fallback chain (`gemini-3.8-flash` → `gemini-flash-latest` → `gemini-3.1-flash-lite`) for both dilemma analysis (`/api/decision/analyze`) and Oracle follow-up consultation (`/api/decision/consult`).
- Added `formatGeminiError` to translate raw upstream API errors into clear, human-readable HTTP status responses.
- Added `README.md` version history documentation and aligned `package.json` version to `3.0.0`.

### v2.0.0 — 2026-11-12
**Multi-Theory Decision Science & Paradox Engine**
- Upgraded `src/utils/scoring.ts` and `src/types.ts` to calculate dilemma differences across seven research frameworks:
  - **Herbert A. Simon**: Non-compensatory Satisficing Aspiration Floors (`1–10` per criterion), `floorsCleared` / `bottleneckMargin` diagnostics, and Search Stopping Rules.
  - **Fons Trompenaars & Charles Hampden-Turner**: Dual-axis Value Polarity coordinates (`poleXScore`, `poleYScore`), Euclidean `(10,10)` Helix Reconciliation Index, and Polarity Skew calculation.
  - **Wendy K. Smith**: Paradox Theory Core Tension framing, Differentiation + Integration moves, and "Both/And" execution plans.
  - **Clayton M. Christensen**: Motivator vs. Hygiene score splits, Jobs-to-be-Done (Functional, Emotional, Social) audits, and Marginal-Cost Trap alerts.
  - **Robert Cialdini**: Pre-suasion framing alerts, Influence trigger detection, and toggleable De-Biased Scoring (`biasInflationPoints` adjustment).
  - **Daniel Kahneman & Samuel Hahnemann**: Prospect Theory asymmetric value curve around a neutral reference point with a live Loss Aversion slider ($\lambda \in [1.0, 2.5]$), System 1 vs. System 2 Outside-View Base Rates, and Hahnemannian Minimum-Dose Titration micro-experiments.
- Built `ParadoxSynthesisView.tsx` featuring an interactive SVG 2D Dilemma Reconciliation Grid.
- Upgraded `WeightedScoringView.tsx` with a Multi-Framework Option Comparison leaderboard and Weighted Difference Breakdown Table ranked by weighted impact gap ($\Delta \times \text{Weight}$).
- Upgraded `ComparisonTableView.tsx` with a Divergence ($\Delta$) column, spread bars, and Motivator/Hygiene filters.
- Updated `server.ts` prompts/schemas, `src/data/presets.ts`, and added `src/utils/researchFallback.ts` for backward compatibility with older saved dossiers.

### v1.1.0 — 2026-11-12
**Server Initialization & JSON Sanitization Hardening**
- Refactored Gemini client instantiation in `server.ts` (`getGeminiClient`) to dynamically read runtime `GEMINI_API_KEY` credentials.
- Added defensive markdown code-fence stripping prior to `JSON.parse` on AI responses.

### v1.0.0 — 2026-11-10
**Initial Release — The Tie Breaker (SUNBEAMGAIA Edition)**
- Built full-stack Express + React/Vite decision intelligence studio (`server.ts`, `App.tsx`, `DecisionForm.tsx`, `DecisionDashboard.tsx`).
- Implemented Weighted Scoring (MCDA), Pros & Cons Deep-Dive, Multi-Dimensional Comparison Table, 2x2 SWOT Analysis, Tie-Breaker Mental Models, Definitive Verdict with 48-hour action plan, Sunbeam Coin Toss modal, Oracle Consultation drawer, Curated Presets, and Local Library persistence.
