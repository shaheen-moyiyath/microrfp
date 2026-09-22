'use client';

import React from 'react';
import { RFPAnalysis } from '@/types/rfp';
import { CheckCircle2, AlertTriangle, XCircle, ShieldAlert } from 'lucide-react';

interface ScoreCardProps {
  analysis: RFPAnalysis;
}

export function ScoreCard({ analysis }: ScoreCardProps) {
  const { go_no_go_score, go_no_go_verdict, verdict_rationale } = analysis;

  const isRecommended = go_no_go_verdict === 'RECOMMENDED';
  const isRisky = go_no_go_verdict === 'RISKY';

  const theme = isRecommended
    ? {
        border: 'border-emerald-500/30',
        bg: 'bg-emerald-950/20',
        badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        circleStroke: '#10b981',
        icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
        label: 'High Probability of Win / Low Friction',
      }
    : isRisky
    ? {
        border: 'border-amber-500/30',
        bg: 'bg-amber-950/20',
        badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        circleStroke: '#f59e0b',
        icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
        label: 'Substantial Risk Factors / Strict Gates',
      }
    : {
        border: 'border-rose-500/30',
        bg: 'bg-rose-950/20',
        badgeBg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
        circleStroke: '#f43f5e',
        icon: <XCircle className="w-5 h-5 text-rose-400" />,
        label: 'Critical Red Flags / Unfavorable Terms',
      };

  // SVG circular gauge calculation
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (go_no_go_score / 100) * circumference;

  return (
    <div className={`rounded-xl border ${theme.border} ${theme.bg} p-6 shadow-lg backdrop-blur-sm`}>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
        {/* Left: Score Gauge */}
        <div className="flex items-center gap-6">
          <div className="relative flex items-center justify-center w-32 h-32 flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 128 128">
              <circle
                cx="64"
                cy="64"
                r={radius}
                stroke="#1e293b"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="64"
                cy="64"
                r={radius}
                stroke={theme.circleStroke}
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-black tracking-tight text-white">{go_no_go_score}</span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">/ 100</span>
            </div>
          </div>

          <div>
            <div className="text-xs uppercase font-bold tracking-widest text-slate-400 mb-1">
              Bid / No-Bid Decision
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-extrabold border ${theme.badgeBg}`}
              >
                {theme.icon}
                {go_no_go_verdict}
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium">{theme.label}</p>
          </div>
        </div>

        {/* Right: Decision Rules Overview */}
        <div className="bg-slate-900/60 rounded-lg p-3 text-xs border border-slate-800/80 max-w-sm space-y-1.5 text-slate-400">
          <div className="flex items-center gap-1.5 font-semibold text-slate-300 pb-1 border-b border-slate-800">
            <ShieldAlert className="w-3.5 h-3.5 text-indigo-400" />
            Decision Threshold Calibration
          </div>
          <div className="flex justify-between items-center">
            <span className="text-emerald-400 font-medium">≥ 75: RECOMMENDED</span>
            <span>Feasible, clear scope & balanced terms</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-amber-400 font-medium">50 - 74: RISKY</span>
            <span>Strict gates, compressed timeline, or teaming needed</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-rose-400 font-medium">&lt; 50: NOT RECOMMENDED</span>
            <span>Severe penalties, restrictive specs or low ROI</span>
          </div>
        </div>
      </div>

      {/* Rationale Section */}
      <div className="pt-5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
          Strategic Verdict Rationale
        </h4>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {verdict_rationale.map((reason, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-900/40 border border-slate-800/60 text-sm text-slate-200"
            >
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center text-xs font-bold mt-0.5">
                {idx + 1}
              </span>
              <span className="leading-snug">{reason}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
