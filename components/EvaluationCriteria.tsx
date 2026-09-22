'use client';

import React from 'react';
import { EvaluationCriterion } from '@/types/rfp';
import { PieChart, Award, TrendingUp, Info } from 'lucide-react';

interface EvaluationCriteriaProps {
  criteria: EvaluationCriterion[];
}

export function EvaluationCriteria({ criteria }: EvaluationCriteriaProps) {
  // Parse numeric weight if available for comparative visualization
  const parsedCriteria = criteria.map((item) => {
    const match = item.weight.match(/(\d+)/);
    const numeric = match ? parseInt(match[1], 10) : 0;
    return {
      ...item,
      numeric,
    };
  });

  const maxWeight = Math.max(...parsedCriteria.map((c) => c.numeric), 100);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-md backdrop-blur-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-400" />
            Evaluation Criteria & Scoring Weights
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Breakdown of technical, past performance, management, and price evaluation factors
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-semibold">
          <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
          {criteria.length} Scoring Factors
        </div>
      </div>

      {criteria.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-500">
          No explicit evaluation criteria specified in RFP document.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {parsedCriteria.map((item, idx) => {
            const percentage = item.numeric > 0 ? Math.min(Math.round((item.numeric / maxWeight) * 100), 100) : 25;

            return (
              <div
                key={idx}
                className="p-4 rounded-lg bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition space-y-2.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-indigo-950/60 text-indigo-400 border border-indigo-500/30 flex items-center justify-center text-xs font-bold font-mono">
                      {idx + 1}
                    </span>
                    <h4 className="text-sm font-semibold text-slate-200">{item.criterion}</h4>
                  </div>
                  <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-slate-800 text-indigo-300 border border-slate-700 flex-shrink-0">
                    {item.weight}
                  </span>
                </div>

                {/* Progress bar visual */}
                {item.numeric > 0 && (
                  <div className="space-y-1">
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Strategic Takeaway Note */}
      <div className="flex items-start gap-2.5 p-3 rounded-lg bg-indigo-950/20 border border-indigo-500/20 text-xs text-indigo-200/90 leading-relaxed">
        <Info className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-white">Proposal Strategy Tip: </span>
          Allocate narrative depth, senior solution architect review time, and proof-point graphics in direct proportion to these evaluation weights.
        </div>
      </div>
    </div>
  );
}
