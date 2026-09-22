'use client';

import React, { useState } from 'react';
import { KeyRequirement } from '@/types/rfp';
import { ShieldAlert, AlertCircle, CheckCircle, Search, Filter } from 'lucide-react';

interface KeyRequirementsTableProps {
  requirements: KeyRequirement[];
}

export function KeyRequirementsTable({ requirements }: KeyRequirementsTableProps) {
  const [filterRisk, setFilterRisk] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = requirements.filter((req) => {
    const matchesRisk = filterRisk === 'All' || req.risk_level === filterRisk;
    const matchesSearch =
      searchQuery === '' ||
      req.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRisk && matchesSearch;
  });

  const highCount = requirements.filter((r) => r.risk_level === 'High').length;
  const medCount = requirements.filter((r) => r.risk_level === 'Medium').length;
  const lowCount = requirements.filter((r) => r.risk_level === 'Low').length;

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-md backdrop-blur-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-indigo-400" />
            Key Requirements & Company Qualifications
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Core eligibility gates, mandatory security clearances, and operational qualifications
          </p>
        </div>

        {/* Risk Count Summary Badges */}
        <div className="flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            {highCount} High Risk
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            {medCount} Medium
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {lowCount} Low
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          {(['All', 'High', 'Medium', 'Low'] as const).map((level) => (
            <button
              key={level}
              onClick={() => setFilterRisk(level)}
              className={`px-3 py-1.5 rounded-md font-medium transition ${
                filterRisk === level
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {level}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search requirements or categories..."
            className="w-full sm:w-64 pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-800">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
              <th className="py-3 px-4 w-44">Category</th>
              <th className="py-3 px-4">Requirement Statement</th>
              <th className="py-3 px-4 w-28 text-center">Risk Level</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 bg-slate-900/30">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-8 text-center text-slate-500">
                  No requirements match the current filters.
                </td>
              </tr>
            ) : (
              filtered.map((req, idx) => {
                const isHigh = req.risk_level === 'High';
                const isMed = req.risk_level === 'Medium';

                return (
                  <tr key={idx} className="hover:bg-slate-800/30 transition">
                    <td className="py-3.5 px-4 font-semibold text-slate-300 align-top">
                      {req.category}
                    </td>
                    <td className="py-3.5 px-4 text-slate-200 leading-relaxed align-top">
                      {req.description}
                    </td>
                    <td className="py-3.5 px-4 text-center align-top">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                          isHigh
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                            : isMed
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        }`}
                      >
                        {isHigh ? (
                          <ShieldAlert className="w-3 h-3" />
                        ) : isMed ? (
                          <AlertCircle className="w-3 h-3" />
                        ) : (
                          <CheckCircle className="w-3 h-3" />
                        )}
                        {req.risk_level}
                      </span>
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
