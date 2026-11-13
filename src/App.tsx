import React, { useState, useEffect } from 'react';
import { DecisionAnalysisResult, SavedDilemma } from './types';
import { PRESET_DILEMMAS, PresetDilemma } from './data/presets';
import { Header } from './components/Header';
import { DecisionForm } from './components/DecisionForm';
import { DecisionDashboard } from './components/DecisionDashboard';
import { PresetPickerModal } from './components/PresetPickerModal';
import { SavedDecisionsModal } from './components/SavedDecisionsModal';
import { CoinTossModal } from './components/CoinTossModal';
import { ConsultationDrawer } from './components/ConsultationDrawer';
import { AlertCircle, CheckCircle2, Sparkles, Shield, Scale, X } from 'lucide-react';
import { exportDecisionToPdf } from './utils/pdfExport';

export default function App() {
  const [currentDecision, setCurrentDecision] = useState<DecisionAnalysisResult | null>(
    PRESET_DILEMMAS[0].preloadedData // Preload with the rich Startup vs Big Tech dilemma so the user instantly sees full value!
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pdfNotice, setPdfNotice] = useState<string | null>(null);

  // Modals & Drawers state
  const [isPresetsOpen, setIsPresetsOpen] = useState<boolean>(false);
  const [isSavedOpen, setIsSavedOpen] = useState<boolean>(false);
  const [isCoinTossOpen, setIsCoinTossOpen] = useState<boolean>(false);
  const [isConsultOpen, setIsConsultOpen] = useState<boolean>(false);

  // Saved dilemmas in localStorage
  const [savedList, setSavedList] = useState<SavedDilemma[]>(() => {
    try {
      const stored = localStorage.getItem('sunbeam_tie_breaker_library');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to load saved library from localStorage:', e);
    }
    return [];
  });

  // Save to localStorage when list changes
  useEffect(() => {
    try {
      localStorage.setItem('sunbeam_tie_breaker_library', JSON.stringify(savedList));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [savedList]);

  useEffect(() => {
    if (!pdfNotice) return;
    const timer = window.setTimeout(() => setPdfNotice(null), 5000);
    return () => window.clearTimeout(timer);
  }, [pdfNotice]);

  // Form submission handler
  const handleAnalyzeDecision = async (formData: {
    title: string;
    options: string[];
    context: string;
    priorities: string;
    decisionStyle: string;
  }) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/decision/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const rawBody = await res.text();
      let json: any = null;
      try {
        json = JSON.parse(rawBody);
      } catch {
        // The upstream proxy/gateway returned an HTML page (e.g., 502/504 timeout or auth refresh)
        const trimmed = rawBody.trim().toLowerCase();
        if (trimmed.startsWith('<!doctype') || trimmed.startsWith('<html')) {
          throw new Error(
            `The server connection was interrupted or timed out (HTTP ${res.status}). If you are using the shared preview URL, try refreshing the page or submitting again.`
          );
        }
        throw new Error(`Received an unexpected non-JSON response (HTTP ${res.status}).`);
      }

      if (!res.ok || !json?.success || !json?.data) {
        throw new Error(json?.error || `Failed to synthesize decision analysis (HTTP ${res.status}).`);
      }

      setCurrentDecision(json.data);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Decision analysis failure:', err);
      setErrorMessage(
        err.message || 'An unexpected error occurred while analyzing the dilemma.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToLibrary = () => {
    if (!currentDecision) return;

    // Check if already saved
    const exists = savedList.some((item) => item.title === currentDecision.title);
    if (exists) return;

    const newSaved: SavedDilemma = {
      id: `saved-${Date.now()}`,
      createdAt: new Date().toISOString(),
      title: currentDecision.title,
      decisionStyle: 'Strategic Dossier',
      options: currentDecision.options.map((o) => o.name),
      data: currentDecision,
    };

    setSavedList((prev) => [newSaved, ...prev]);
  };

  const handleDeleteSaved = (id: string) => {
    setSavedList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSelectPreset = (preset: PresetDilemma) => {
    setCurrentDecision(preset.preloadedData);
    setErrorMessage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrintPdf = () => {
    if (!currentDecision) return;
    setErrorMessage(null);
    try {
      const fileName = exportDecisionToPdf(currentDecision);
      setPdfNotice(`Exported PDF dossier: ${fileName}`);
      if (window.self === window.top) {
        window.print();
      }
    } catch (err: any) {
      console.error('PDF export failure:', err);
      setErrorMessage(
        err?.message || 'Unable to generate PDF dossier. Please try again.'
      );
    }
  };

  const isCurrentSaved = Boolean(
    currentDecision && savedList.some((item) => item.title === currentDecision.title)
  );

  return (
    <div className="min-h-screen bg-[#0c0f12] text-gray-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Radiant celestial ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] sunbeam-glow blur-3xl opacity-60" />
        <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] gaia-aura blur-3xl opacity-40" />
      </div>

      {/* Navigation Header */}
      <Header
        onOpenPresets={() => setIsPresetsOpen(true)}
        onOpenSaved={() => setIsSavedOpen(true)}
        onOpenCoinToss={() => setIsCoinTossOpen(true)}
        onNewDilemma={() => setCurrentDecision(null)}
        onPrintPdf={handlePrintPdf}
        savedCount={savedList.length}
        hasActiveDecision={Boolean(currentDecision)}
      />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Error Alert if any */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs flex items-start justify-between gap-3 animate-in fade-in">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-rose-300 font-semibold mb-0.5">
                  Analysis Notice:
                </strong>
                {errorMessage}
              </div>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-gray-400 hover:text-white text-xs font-semibold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* View Toggle: Form or Active Dashboard */}
        {!currentDecision ? (
          <div className="max-w-4xl mx-auto space-y-8">
            <DecisionForm
              onSubmit={handleAnalyzeDecision}
              isLoading={isLoading}
              onOpenPresets={() => setIsPresetsOpen(true)}
            />

            {/* Quick Value Props Banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="p-4 rounded-2xl bg-gray-900/60 border border-gray-800 space-y-1.5">
                <div className="flex items-center gap-2 text-amber-400">
                  <Scale className="w-4 h-4" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">
                    Weighted MCDA Engine
                  </h4>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Assign dynamic weights to personal factors and discover which option mathematically maximizes your values.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-gray-900/60 border border-gray-800 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-400">
                  <Sparkles className="w-4 h-4" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">
                    SWOT & Dimensional Matrix
                  </h4>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Benchmark options across stress, financial upside, irreversibility, and 5-year compounding trajectory.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-gray-900/60 border border-gray-800 space-y-1.5">
                <div className="flex items-center gap-2 text-cyan-400">
                  <Shield className="w-4 h-4" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">
                    Tie-Breaker Protocols
                  </h4>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Apply the 10-10-10 rule, 80-year-old regret minimization, and subconscious gut tests to unlock conviction.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <DecisionDashboard
            decision={currentDecision}
            onSaveToLibrary={handleSaveToLibrary}
            isSaved={isCurrentSaved}
            onOpenConsult={() => setIsConsultOpen(true)}
            onOpenCoinToss={() => setIsCoinTossOpen(true)}
            onReset={() => setCurrentDecision(null)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-900/80 bg-gray-950/60 py-6 text-center text-xs text-gray-400 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span className="font-cinzel font-semibold text-gray-300">
              The Tie Breaker (SUNBEAMGAIA Edition)
            </span>
          </div>
          <p className="text-[11px] text-gray-400">
            Powered by Gemini 3.8 Flash • Illuminating Decisions with Clarity & Grace
          </p>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <PresetPickerModal
        isOpen={isPresetsOpen}
        onClose={() => setIsPresetsOpen(false)}
        onSelectPreset={handleSelectPreset}
      />

      <SavedDecisionsModal
        isOpen={isSavedOpen}
        onClose={() => setIsSavedOpen(false)}
        savedList={savedList}
        onLoadDilemma={(item) => setCurrentDecision(item.data)}
        onDeleteDilemma={handleDeleteSaved}
      />

      <CoinTossModal
        isOpen={isCoinTossOpen}
        onClose={() => setIsCoinTossOpen(false)}
        optionA={currentDecision?.options[0]?.name || 'Option A'}
        optionB={currentDecision?.options[1]?.name || 'Option B'}
      />

      {currentDecision && (
        <ConsultationDrawer
          isOpen={isConsultOpen}
          onClose={() => setIsConsultOpen(false)}
          decisionData={currentDecision}
        />
      )}

      {pdfNotice && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-50 max-w-md px-4 py-3 rounded-xl bg-gray-900 border border-emerald-500/40 text-emerald-200 text-xs shadow-xl flex items-center gap-3 no-print"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="truncate">{pdfNotice}</span>
          <button
            type="button"
            onClick={() => setPdfNotice(null)}
            aria-label="Dismiss PDF export notification"
            className="text-gray-400 hover:text-white shrink-0 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
