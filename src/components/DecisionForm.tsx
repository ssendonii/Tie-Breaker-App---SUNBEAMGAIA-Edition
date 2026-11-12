import React, { useState } from 'react';
import { Sparkles, Plus, Trash2, Sliders, ChevronDown, ChevronUp, Sun, Flame, Shield, ArrowRight, Lightbulb } from 'lucide-react';

interface DecisionFormProps {
  onSubmit: (formData: {
    title: string;
    options: string[];
    context: string;
    priorities: string;
    decisionStyle: string;
  }) => void;
  isLoading: boolean;
  onOpenPresets: () => void;
}

export const DecisionForm: React.FC<DecisionFormProps> = ({
  onSubmit,
  isLoading,
  onOpenPresets,
}) => {
  const [title, setTitle] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [context, setContext] = useState('');
  const [priorities, setPriorities] = useState('');
  const [decisionStyle, setDecisionStyle] = useState('Radiant Balance');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const suggestionPrompts = [
    'Accept Series B AI startup vs Stay at Big Tech Staff level',
    'Relocate to Tokyo on Global Talent visa vs Stay in San Francisco',
    'Buy a Fixer-Upper property vs Rent & Dollar-Cost Average into Index Funds',
    'Build Proprietary In-House AI tooling vs Buy Enterprise SaaS licenses',
  ];

  const handleOptionChange = (index: number, val: string) => {
    const updated = [...options];
    updated[index] = val;
    setOptions(updated);
  };

  const handleAddOption = () => {
    if (options.length >= 5) return;
    setOptions([...options, '']);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length <= 2) return;
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Filter non-empty options
    const validOptions = options.map((o) => o.trim()).filter(Boolean);
    if (validOptions.length < 2) {
      alert('Please provide at least 2 distinct options to compare.');
      return;
    }

    onSubmit({
      title: title.trim(),
      options: validOptions,
      context: context.trim(),
      priorities: priorities.trim(),
      decisionStyle,
    });
  };

  const applySuggestion = (prompt: string) => {
    setTitle(prompt);
    if (prompt.includes(' vs ')) {
      const parts = prompt.split(' vs ');
      setOptions([parts[0].trim(), parts[1].trim()]);
    }
  };

  const styles = [
    {
      id: 'Radiant Balance',
      icon: Sun,
      label: 'Radiant Balance',
      desc: 'Holistic wisdom, sustainability, and balanced upside.',
    },
    {
      id: 'Moonshot Ambition',
      icon: Flame,
      label: 'Moonshot Ambition',
      desc: 'Maximizing upside, exponential growth & regret minimization.',
    },
    {
      id: 'Fortress & Resilience',
      icon: Shield,
      label: 'Fortress & Peace',
      desc: 'Downside safety, emotional health & stress minimization.',
    },
    {
      id: 'Speed & Reversibility',
      icon: Sliders,
      label: 'Agile & Reversible',
      desc: 'Two-way doors, testable experiments & swift iterations.',
    },
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 md:p-8 rounded-3xl bg-gray-900/90 border border-amber-500/30 shadow-2xl space-y-6 relative overflow-hidden"
    >
      {/* Background ambient radiance */}
      <div className="absolute top-0 right-1/4 w-80 h-40 bg-amber-500/10 blur-3xl pointer-events-none rounded-full" />

      {/* Header section */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400 font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Decision Intelligence Studio
          </span>

          <button
            type="button"
            onClick={onOpenPresets}
            className="text-xs text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/30 transition flex items-center gap-1"
          >
            <Lightbulb className="w-3 h-3" />
            Browse Sample Dilemmas
          </button>
        </div>

        <h2 className="text-xl md:text-2xl font-cinzel font-bold text-white">
          What High-Stakes Choice Lies Before You?
        </h2>
        <p className="text-xs text-gray-400">
          State your dilemma. The Tie Breaker will illuminate hidden trade-offs, construct a weighted scoring engine, map a SWOT matrix, and deliver a definitive verdict.
        </p>
      </div>

      {/* Suggested chips */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-mono text-gray-500 uppercase">
          Quick Inspirations:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {suggestionPrompts.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applySuggestion(s)}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-gray-800/60 hover:bg-gray-800 text-gray-300 border border-gray-750 transition truncate max-w-xs"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Decision Question Input */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-gray-300 block">
          Decision Title or Core Dilemma Question <span className="text-amber-400">*</span>
        </label>
        <input
          type="text"
          placeholder="e.g. Should I accept the Founding Engineer role or accept Google's Staff offer?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-xl bg-gray-950/80 border border-gray-700 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
        />
      </div>

      {/* Options Inputs */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-gray-300">
            Options to Compare (Minimum 2) <span className="text-amber-400">*</span>
          </label>
          {options.length < 5 && (
            <button
              type="button"
              onClick={handleAddOption}
              className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Another Option
            </button>
          )}
        </div>

        <div className="space-y-2.5">
          {options.map((opt, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-gray-800 text-amber-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 border border-gray-700">
                {String.fromCharCode(65 + idx)}
              </span>
              <input
                type="text"
                placeholder={`Option ${String.fromCharCode(65 + idx)} (e.g. ${
                  idx === 0 ? 'Accept Startup Offer' : 'Stay at Current Employer'
                })`}
                value={opt}
                onChange={(e) => handleOptionChange(idx, e.target.value)}
                required
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-gray-950/80 border border-gray-700 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-amber-400 transition"
              />
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => handleRemoveOption(idx)}
                  className="p-2 text-gray-500 hover:text-rose-400 transition"
                  title="Remove option"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Decision Lens Selector */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-300 block">
          Strategic Philosophy & Decision Lens
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {styles.map((st) => {
            const Icon = st.icon;
            const isSelected = decisionStyle === st.id;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => setDecisionStyle(st.id)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-400 ring-1 ring-amber-400/50'
                    : 'bg-gray-950/60 border-gray-800 hover:border-gray-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon
                    className={`w-4 h-4 ${
                      isSelected ? 'text-amber-400' : 'text-gray-400'
                    }`}
                  />
                  <span
                    className={`text-xs font-bold ${
                      isSelected ? 'text-amber-300' : 'text-gray-200'
                    }`}
                  >
                    {st.label}
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 leading-snug">{st.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Advanced / Context Accordion */}
      <div className="border-t border-gray-800 pt-4">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center justify-between w-full text-xs font-semibold text-gray-400 hover:text-white transition"
        >
          <span>
            {showAdvanced ? 'Hide' : 'Add'} Personal Context, Runway & Priorities
            (Optional, but sharpens AI depth)
          </span>
          {showAdvanced ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        {showAdvanced && (
          <div className="mt-4 space-y-4 animate-in fade-in duration-200">
            <div className="space-y-1.5">
              <label className="text-xs text-gray-300 font-medium">
                Personal Background, Runway & Constraints:
              </label>
              <textarea
                rows={2}
                placeholder="e.g. 32 years old, have 8 months emergency savings, partner works remotely, high tolerance for hard work but need weekends for kids..."
                value={context}
                onChange={(e) => setContext(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-950/80 border border-gray-700 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-amber-400 transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-gray-300 font-medium">
                Non-Negotiable Core Values:
              </label>
              <input
                type="text"
                placeholder="e.g. Autonomy > Salary, Sleep quality, avoiding toxic bureaucracy"
                value={priorities}
                onChange={(e) => setPriorities(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-950/80 border border-gray-700 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-amber-400 transition"
              />
            </div>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || !title.trim()}
        className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-gray-950 font-bold text-sm md:text-base flex items-center justify-center gap-3 shadow-xl shadow-amber-500/20 active:scale-[0.99] transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {isLoading ? (
          <>
            <span className="w-5 h-5 border-2 border-gray-950 border-t-transparent rounded-full animate-spin" />
            <span>Consulting Sunbeam Oracle & Synthesizing Matrices...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            <span>Illuminate Dilemma & Break the Tie</span>
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>
    </form>
  );
};
