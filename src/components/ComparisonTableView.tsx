import React, { useState } from 'react';
import { ComparisonTableData, DecisionOption } from '../types';
import { Table, ArrowUpDown } from 'lucide-react';

interface ComparisonTableViewProps {
  comparisonData: ComparisonTableData;
  options: DecisionOption[];
}

export const ComparisonTableView: React.FC<ComparisonTableViewProps> = ({
  comparisonData,
  options,
}) => {
  const [roleFilter, setRoleFilter] = useState<'all' | 'Motivator' | 'Hygiene'>('all');
  const [sortByDelta, setSortByDelta] = useState<boolean>(true);

  const getRatingColorClass = (rating: number) => {
    if (rating >= 8.5) return 'text-emerald-400';
    if (rating >= 7.0) return 'text-teal-300';
    if (rating >= 5.0) return 'text-amber-400';
    return 'text-rose-400';
  };

  const enrichedRows = comparisonData.rows.map((row) => {
    const ratings = row.optionEvaluations.map((e) => e.rating);
    const maxRating = Math.max(...ratings);
    const minRating = Math.min(...ratings);
    const delta = Math.round((maxRating - minRating) * 10) / 10;
    const leaders = row.optionEvaluations.filter((e) => e.rating === maxRating);
    const isTie = leaders.length > 1;
    const christensenType = row.christensenType || 'Motivator';
    const kahnemanSensitivity = row.kahnemanSensitivity || 'Balanced';

    return {
      ...row,
      delta,
      maxRating,
      isTie,
      leaderName: isTie ? 'Tied' : leaders[0]?.optionName || '',
      christensenType,
      kahnemanSensitivity,
    };
  });

  const filteredRows = enrichedRows
    .filter((r) => (roleFilter === 'all' ? true : r.christensenType === roleFilter))
    .sort((a, b) => (sortByDelta ? b.delta - a.delta : 0));

  return (
    <div className="space-y-6">
      {/* Header & Interactive Filter Controls */}
      <div className="p-4 rounded-xl bg-gray-900 border border-gray-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <Table className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <h3 className="text-sm font-semibold text-white">
              Multi-Dimensional Divergence Matrix
            </h3>
            <p className="text-xs text-gray-400">
              Quantifies exact spread (Δ) between options, tagged by Christensen role and Kahneman loss sensitivity
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-gray-950 rounded-lg border border-gray-800 text-xs">
            <button
              type="button"
              onClick={() => setRoleFilter('all')}
              className={`px-3 py-1.5 rounded-md font-medium transition whitespace-nowrap cursor-pointer ${
                roleFilter === 'all'
                  ? 'bg-amber-500 text-gray-950 font-semibold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              All Dimensions
            </button>
            <button
              type="button"
              onClick={() => setRoleFilter('Motivator')}
              className={`px-3 py-1.5 rounded-md font-medium transition whitespace-nowrap cursor-pointer ${
                roleFilter === 'Motivator'
                  ? 'bg-amber-500 text-gray-950 font-semibold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Motivators
            </button>
            <button
              type="button"
              onClick={() => setRoleFilter('Hygiene')}
              className={`px-3 py-1.5 rounded-md font-medium transition whitespace-nowrap cursor-pointer ${
                roleFilter === 'Hygiene'
                  ? 'bg-amber-500 text-gray-950 font-semibold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Hygiene Floors
            </button>
          </div>

          <button
            type="button"
            onClick={() => setSortByDelta(!sortByDelta)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-medium transition whitespace-nowrap cursor-pointer ${
              sortByDelta
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                : 'bg-gray-950 border-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            {sortByDelta ? 'Sorted by Spread (Δ)' : 'Default Order'}
          </button>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="overflow-x-auto rounded-2xl border border-gray-800 bg-gray-900">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-gray-800 bg-gray-950/80">
              <th className="p-4 text-xs font-semibold text-gray-300 w-1/4 min-w-[210px]">
                Decision Dimension
              </th>
              <th className="p-4 text-xs font-semibold text-gray-300 min-w-[140px]">
                Divergence (Δ)
              </th>
              {options.map((opt) => (
                <th
                  key={opt.id}
                  className="p-4 text-xs font-semibold text-amber-400 min-w-[240px]"
                >
                  <div>{opt.name}</div>
                  <span className="block text-[11px] text-gray-400 font-normal mt-0.5">
                    {opt.tagline}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/70 text-xs">
            {filteredRows.length === 0 ? (
              <tr>
                <td colSpan={options.length + 2} className="p-8 text-center text-gray-400">
                  No comparison dimensions match this filter. Switch to All Dimensions to view the full matrix.
                </td>
              </tr>
            ) : (
              filteredRows.map((row) => {
                const dimMeta = comparisonData.dimensions.find(
                  (d) => d.id === row.dimensionId
                );

                return (
                  <tr key={row.dimensionId} className="hover:bg-gray-950/40 transition-colors">
                    {/* Dimension title & clean unboxed metadata */}
                    <td className="p-4 align-top bg-gray-950/30">
                      <div className="font-semibold text-white text-sm">
                        {row.dimensionName}
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-gray-400 mt-1">
                        <span>{row.christensenType}</span>
                        <span aria-hidden="true">·</span>
                        <span
                          className={
                            row.kahnemanSensitivity === 'Loss-Heavy'
                              ? 'text-rose-300'
                              : row.kahnemanSensitivity === 'Gain-Driven'
                              ? 'text-emerald-300'
                              : 'text-gray-400'
                          }
                        >
                          {row.kahnemanSensitivity}
                        </span>
                      </div>
                      {dimMeta && (
                        <p className="text-[11px] text-gray-400 mt-1.5 leading-snug">
                          {dimMeta.description}
                        </p>
                      )}
                    </td>

                    {/* Divergence Delta Column */}
                    <td className="p-4 align-top space-y-2">
                      <div className="font-mono tabular-nums text-base font-bold text-amber-300">
                        Δ {row.delta.toFixed(1)}
                      </div>
                      <div className="w-24 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full"
                          style={{ width: `${Math.min(100, (row.delta / 9) * 100)}%` }}
                        />
                      </div>
                      <div className="text-[11px] text-gray-400">
                        {row.isTie ? 'Evenly matched' : `Edge: ${row.leaderName}`}
                      </div>
                    </td>

                    {/* Option evaluations */}
                    {row.optionEvaluations.map((evalItem) => {
                      const isRowWinner = !row.isTie && evalItem.rating === row.maxRating;
                      return (
                        <td
                          key={evalItem.optionId}
                          className={`p-4 align-top space-y-2 ${
                            isRowWinner ? 'bg-emerald-950/10' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={`font-mono tabular-nums font-bold text-sm ${getRatingColorClass(
                                evalItem.rating
                              )}`}
                            >
                              {evalItem.rating.toFixed(1)} / 10
                            </span>
                            <span className="text-[11px] font-medium text-gray-300 truncate">
                              {evalItem.ratingLabel}
                              {isRowWinner ? ' · Leader' : ''}
                            </span>
                          </div>

                          <div className="font-medium text-amber-200/90 text-xs">
                            "{evalItem.highlight}"
                          </div>

                          <p className="text-gray-300 text-xs leading-relaxed">
                            {evalItem.analysis}
                          </p>
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
