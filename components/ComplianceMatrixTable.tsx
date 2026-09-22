'use client';

import React, { useState } from 'react';
import { ComplianceItem } from '@/types/rfp';
import {
  FileCheck2,
  AlertTriangle,
  Search,
  CheckSquare,
  Square,
  Lock,
  Flag,
} from 'lucide-react';

interface ComplianceMatrixTableProps {
  matrix: ComplianceItem[];
}

export function ComplianceMatrixTable({ matrix }: ComplianceMatrixTableProps) {
  const [completedItems, setCompletedItems] = useState<Record<number, boolean>>({});
  const [onlyMandatory, setOnlyMandatory] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleComplete = (idx: number) => {
    setCompletedItems((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const filtered = matrix.map((item, originalIndex) => ({ item, originalIndex })).filter(({ item }) => {
    const matchesMandatory = onlyMandatory ? item.mandatory : true;
    const matchesSearch =
      searchQuery === '' ||
      item.section_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.requirement.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.flag_note.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesMandatory && matchesSearch;
  });

  const totalMandatory = matrix.filter((m) => m.mandatory).length;
  const completedCount = Object.values(completedItems).filter(Boolean).length;
  const progressPercent = matrix.length > 0 ? Math.round((completedCount / matrix.length) * 100) : 0;

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-md backdrop-blur-sm space-y-4">
      {/* Header & Progress */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-indigo-400" />
            Compliance & Eligibility Matrix
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Explicit submission rules, page limits, required attachments, and proposal manager red flags
          </p>
        </div>

        {/* Live Checklist Tracker */}
        <div className="flex items-center gap-3 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
          <div className="text-right">
            <div className="text-xs font-semibold text-slate-200">
              {completedCount} of {matrix.length} Cleared
            </div>
            <div className="text-[10px] text-slate-400 font-medium">
              {totalMandatory} Mandatory Gates
            </div>
          </div>
          <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400">{progressPercent}%</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setOnlyMandatory(!onlyMandatory)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
              onlyMandatory
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-rose-400" />
            Show Mandatory Only ({totalMandatory})
          </button>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search section or requirements..."
            className="w-full sm:w-64 pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>
      </div>

      {/* Matrix Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-800">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
              <th className="py-3 px-3 w-12 text-center">Track</th>
              <th className="py-3 px-4 w-32">Section</th>
              <th className="py-3 px-4">Requirement & Submittal Detail</th>
              <th className="py-3 px-4 w-28 text-center">Mandatory</th>
              <th className="py-3 px-4 w-72">Proposal Manager Flag</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 bg-slate-900/30">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-500">
                  No compliance items found matching the current search.
                </td>
              </tr>
            ) : (
              filtered.map(({ item, originalIndex }) => {
                const isCompleted = !!completedItems[originalIndex];

                return (
                  <tr
                    key={originalIndex}
                    className={`hover:bg-slate-800/30 transition ${
                      isCompleted ? 'bg-emerald-950/10 opacity-75' : ''
                    }`}
                  >
                    <td className="py-3.5 px-3 text-center align-top">
                      <button
                        onClick={() => toggleComplete(originalIndex)}
                        className="text-slate-400 hover:text-indigo-400 transition"
                        title={isCompleted ? 'Mark incomplete' : 'Mark cleared'}
                      >
                        {isCompleted ? (
                          <CheckSquare className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-600" />
                        )}
                      </button>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-semibold text-indigo-300 align-top">
                      {item.section_number}
                    </td>

                    <td className="py-3.5 px-4 text-slate-200 leading-relaxed align-top">
                      <div className={isCompleted ? 'line-through text-slate-400' : ''}>
                        {item.requirement}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center align-top">
                      {item.mandatory ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                          MANDATORY
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-400 border border-slate-700">
                          Optional
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 align-top">
                      {item.flag_note && item.flag_note !== 'Not Specified in RFP' ? (
                        <div className="flex items-start gap-1.5 p-2 rounded bg-amber-950/20 border border-amber-500/20 text-amber-200/90 text-[11px] leading-tight">
                          <Flag className="w-3 h-3 text-amber-400 flex-shrink-0 mt-0.5" />
                          <span>{item.flag_note}</span>
                        </div>
                      ) : (
                        <span className="text-slate-500 italic text-[11px]">No specific flag</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
