import React, { useState } from 'react';
import { OptionProsCons, ProConItem, DecisionOption } from '../types';
import { CheckCircle2, XCircle, AlertTriangle, Sparkles, Filter, Plus, ShieldAlert } from 'lucide-react';

interface ProsConsViewProps {
  initialProsAndCons: OptionProsCons[];
  options: DecisionOption[];
}

export const ProsConsView: React.FC<ProsConsViewProps> = ({
  initialProsAndCons,
  options,
}) => {
  const [data, setData] = useState<OptionProsCons[]>(initialProsAndCons);
  const [selectedOptionId, setSelectedOptionId] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showOnlyCritical, setShowOnlyCritical] = useState<boolean>(false);

  // New item modal/inline form state
  const [addingToOptionId, setAddingToOptionId] = useState<string | null>(null);
  const [newType, setNewType] = useState<'pro' | 'con'>('pro');
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState('Personal');
  const [newImpact, setNewImpact] = useState<'high' | 'medium' | 'low'>('high');
  const [newIsCritical, setNewIsCritical] = useState(false);

  // Collect unique categories across all pros and cons
  const allCategories = Array.from(
    new Set(
      data.flatMap((d) => [
        ...d.pros.map((p) => p.category),
        ...d.cons.map((c) => c.category),
      ])
    )
  );

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addingToOptionId || !newTitle.trim()) return;

    const newItem: ProConItem = {
      title: newTitle.trim(),
      description: newDesc.trim() || 'User added consideration.',
      category: newCategory,
      impact: newImpact,
      isCritical: newIsCritical,
    };

    setData((prev) =>
      prev.map((opt) => {
        if (opt.optionId !== addingToOptionId) return opt;
        return {
          ...opt,
          pros: newType === 'pro' ? [newItem, ...opt.pros] : opt.pros,
          cons: newType === 'con' ? [newItem, ...opt.cons] : opt.cons,
        };
      })
    );

    setNewTitle('');
    setNewDesc('');
    setAddingToOptionId(null);
  };

  const filteredData = data.filter((opt) =>
    selectedOptionId === 'all' ? true : opt.optionId === selectedOptionId
  );

  return (
    <div className="space-y-6">
      {/* Controls & Filter Bar */}
      <div className="p-4 rounded-xl bg-gray-900 border border-gray-800 flex flex-wrap items-center justify-between gap-4">
        {/* Option Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setSelectedOptionId('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              selectedOptionId === 'all'
                ? 'bg-amber-500 text-gray-950 shadow-md shadow-amber-500/20'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-750'
            }`}
          >
            Side-by-Side (All)
          </button>
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSelectedOptionId(opt.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                selectedOptionId === opt.id
                  ? 'bg-amber-500 text-gray-950 shadow-md shadow-amber-500/20'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-750'
              }`}
            >
              {opt.name}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5 bg-gray-800/80 px-2.5 py-1 rounded-lg border border-gray-700 text-xs">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent text-gray-300 text-xs focus:outline-none"
            >
              <option value="all">All Domains</option>
              {allCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Critical Only Toggle */}
          <button
            onClick={() => setShowOnlyCritical(!showOnlyCritical)}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-lg border transition ${
              showOnlyCritical
                ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                : 'bg-gray-800/80 border-gray-700 text-gray-300 hover:bg-gray-800'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            {showOnlyCritical ? 'Showing Dealbreakers' : 'Dealbreakers Only'}
          </button>
        </div>
      </div>

      {/* Inline Add Pro/Con Modal */}
      {addingToOptionId && (
        <form
          onSubmit={handleAddItem}
          className="p-5 rounded-2xl bg-gray-900 border border-amber-500/40 shadow-xl space-y-4 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between border-b border-gray-800 pb-2">
            <h4 className="text-sm font-semibold text-white">
              Add Consideration to {options.find((o) => o.id === addingToOptionId)?.name}
            </h4>
            <button
              type="button"
              onClick={() => setAddingToOptionId(null)}
              className="text-xs text-gray-400 hover:text-white"
            >
              Close
            </button>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setNewType('pro')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition ${
                newType === 'pro'
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                  : 'bg-gray-800 border-gray-700 text-gray-400'
              }`}
            >
              + PRO (Benefit / Upside)
            </button>
            <button
              type="button"
              onClick={() => setNewType('con')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition ${
                newType === 'con'
                  ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                : 'bg-gray-800 border-gray-700 text-gray-400'
              }`}
            >
              - CON (Risk / Drawback)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Headline / Point"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
              className="px-3 py-2 text-xs rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-amber-400"
            />
            <input
              type="text"
              placeholder="Category (e.g. Financial, Wellbeing, Family)"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="px-3 py-2 text-xs rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <textarea
            placeholder="Detailed rationale or consequence..."
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 text-xs rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-amber-400"
          />

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <label className="flex items-center gap-2 text-xs text-amber-300 cursor-pointer">
              <input
                type="checkbox"
                checked={newIsCritical}
                onChange={(e) => setNewIsCritical(e.target.checked)}
                className="rounded accent-amber-500"
              />
              Mark as Crucial / Dealbreaker Point
            </label>

            <button
              type="submit"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold text-xs rounded-lg transition"
            >
              Add to Dossier
            </button>
          </div>
        </form>
      )}

      {/* Options Cards Grid */}
      <div
        className={`grid gap-6 ${
          filteredData.length > 1 ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'
        }`}
      >
        {filteredData.map((optionData) => {
          const rawPros = optionData.pros.filter((p) => {
            if (showOnlyCritical && !p.isCritical) return false;
            if (categoryFilter !== 'all' && p.category.toLowerCase() !== categoryFilter.toLowerCase()) return false;
            return true;
          });

          const rawCons = optionData.cons.filter((c) => {
            if (showOnlyCritical && !c.isCritical) return false;
            if (categoryFilter !== 'all' && c.category.toLowerCase() !== categoryFilter.toLowerCase()) return false;
            return true;
          });

          return (
            <div
              key={optionData.optionId}
              className="p-5 rounded-2xl bg-gray-900 border border-gray-800 shadow-xl space-y-5"
            >
              {/* Option Header */}
              <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                <div>
                  <h4 className="text-base font-bold text-white tracking-wide">
                    {optionData.optionName}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-xs">
                    <span className="text-emerald-400 font-mono">
                      +{optionData.pros.length} Pros
                    </span>
                    <span className="text-gray-600">•</span>
                    <span className="text-rose-400 font-mono">
                      -{optionData.cons.length} Cons
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setAddingToOptionId(optionData.optionId)}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Factor
                </button>
              </div>

              {/* Pros Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4" />
                  Distinct Advantages & Catalysts
                </div>

                {rawPros.length === 0 ? (
                  <p className="text-xs text-gray-500 italic p-3 rounded-lg bg-gray-950/40">
                    No pros matched your active filters.
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {rawPros.map((pro, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border transition-all ${
                          pro.isCritical
                            ? 'bg-emerald-950/20 border-emerald-500/40 ring-1 ring-emerald-500/20'
                            : 'bg-gray-950/60 border-emerald-500/10 hover:border-emerald-500/30'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h5 className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                            {pro.title}
                          </h5>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-gray-800 text-gray-400">
                              {pro.category}
                            </span>
                            {pro.isCritical && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                                Superpower
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-gray-300 leading-relaxed">
                          {pro.description}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Cons Section */}
              <div className="space-y-3 pt-2 border-t border-gray-800/60">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-wider">
                  <XCircle className="w-4 h-4" />
                  Vulnerabilities & Hidden Tolls
                </div>

                {rawCons.length === 0 ? (
                  <p className="text-xs text-gray-500 italic p-3 rounded-lg bg-gray-950/40">
                    No cons matched your active filters.
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {rawCons.map((con, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border transition-all ${
                          con.isCritical
                            ? 'bg-rose-950/25 border-rose-500/50 ring-1 ring-rose-500/30'
                            : 'bg-gray-950/60 border-rose-500/10 hover:border-rose-500/30'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h5 className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                            {con.title}
                          </h5>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-gray-800 text-gray-400">
                              {con.category}
                            </span>
                            {con.isCritical && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                                Dealbreaker Risk
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-gray-300 leading-relaxed">
                          {con.description}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
