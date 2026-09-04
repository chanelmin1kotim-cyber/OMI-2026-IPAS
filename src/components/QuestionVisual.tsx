import React from 'react';
import { VisualPayload } from '../types';

interface QuestionVisualProps {
  visual?: VisualPayload;
}

export const QuestionVisual: React.FC<QuestionVisualProps> = ({ visual }) => {
  if (!visual) return null;

  return (
    <div className="my-4 rounded-xl border border-slate-200 bg-slate-50/80 p-4 shadow-sm">
      {visual.title && (
        <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-600">
          <span>{visual.title}</span>
          <span className="rounded bg-sky-100 px-2 py-0.5 text-[10px] font-bold text-sky-700">Data Ilmiah</span>
        </div>
      )}

      {/* Table Visual */}
      {visual.type === 'table' && visual.tableData && (
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                {visual.tableData.headers.map((header, idx) => (
                  <th key={idx} className="border-b border-slate-200 px-3 py-2 font-semibold">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {visual.tableData.rows.map((row, rIdx) => (
                <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="px-3 py-2 font-medium">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Graph Visual */}
      {visual.type === 'graph' && visual.chartData && (
        <div className="rounded-lg border border-slate-200 bg-white p-3">
          <div className="flex h-36 items-end gap-2 border-b border-l border-slate-300 px-2 pt-4">
            {visual.chartData.map((item, idx) => {
              const heightPercent = Math.max(12, Math.min(100, Math.round((Math.abs(item.value) / 100) * 100)));
              return (
                <div key={idx} className="group relative flex flex-1 flex-col items-center">
                  <div
                    className="w-full rounded-t bg-gradient-to-t from-sky-500 to-indigo-500 transition-all duration-300 hover:brightness-110"
                    style={{ height: `${heightPercent}%` }}
                  >
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-white opacity-0 shadow transition-opacity group-hover:opacity-100">
                      {item.value}
                    </div>
                  </div>
                  <span className="mt-1.5 text-[9px] font-medium text-slate-500 line-clamp-1 text-center" title={item.label}>
                    {item.label.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Food Web & Schematic visual */}
      {visual.type === 'food_web' && (
        <div className="flex flex-wrap items-center justify-center gap-2 rounded-lg border border-slate-200 bg-emerald-50/40 p-4 text-xs font-semibold text-emerald-900">
          <div className="rounded-lg border border-emerald-300 bg-white px-3 py-1.5 shadow-sm text-center">
            🌱 Produsen (Tumbuhan Hijau / Fitoplankton)
          </div>
          <span className="text-emerald-500 font-bold">➔</span>
          <div className="rounded-lg border border-emerald-300 bg-white px-3 py-1.5 shadow-sm text-center">
            🦗 Konsumen I (Herbivora)
          </div>
          <span className="text-emerald-500 font-bold">➔</span>
          <div className="rounded-lg border border-emerald-300 bg-white px-3 py-1.5 shadow-sm text-center">
            🐸 Konsumen II (Karnivora Kecil)
          </div>
          <span className="text-emerald-500 font-bold">➔</span>
          <div className="rounded-lg border border-emerald-300 bg-white px-3 py-1.5 shadow-sm text-center">
            🦅 Konsumen Puncak (Predator)
          </div>
        </div>
      )}

      {visual.caption && (
        <p className="mt-2 text-center text-xs italic text-slate-500">{visual.caption}</p>
      )}
    </div>
  );
};
