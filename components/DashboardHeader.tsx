'use client';

import React, { useState } from 'react';
import { RFPAnalysis } from '@/types/rfp';
import { exportAnalysisToWord } from '@/lib/docx-export';
import {
  Building2,
  Calendar,
  DollarSign,
  FileCode2,
  FileDown,
  FileText,
  RotateCcw,
  Check,
  Hash,
  Zap,
} from 'lucide-react';

interface DashboardHeaderProps {
  analysis: RFPAnalysis;
  onReset: () => void;
}

export function DashboardHeader({ analysis, onReset }: DashboardHeaderProps) {
  const [isExportingWord, setIsExportingWord] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);

  const handleExportWord = async () => {
    try {
      setIsExportingWord(true);
      await exportAnalysisToWord(analysis);
    } catch (err) {
      console.error('Failed to export Word document:', err);
      alert('Failed to generate Word document. Please try again.');
    } finally {
      setIsExportingWord(false);
    }
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(analysis, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    const sanitizedTitle = (analysis.title || 'RFP_Analysis').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 30);
    downloadAnchor.setAttribute('download', `MicroRFP_${sanitizedTitle}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCopySummary = () => {
    const summary = `# ${analysis.title}
**Agency**: ${analysis.issuing_agency}
**Solicitation ID**: ${analysis.opportunity_number}
**Deadline**: ${analysis.submission_deadline}
**Budget**: ${analysis.estimated_budget}

## Go/No-Go Decision: ${analysis.go_no_go_verdict} (${analysis.go_no_go_score}/100)
${analysis.verdict_rationale.map((r) => `- ${r}`).join('\n')}
`;
    navigator.clipboard.writeText(summary);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  return (
    <header className="rounded-xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur-md">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        {/* Title & Metadata */}
        <div className="space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Building2 className="w-3.5 h-3.5" />
            {analysis.issuing_agency}
          </div>

          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white leading-tight">
            {analysis.title}
          </h1>

          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300">
              <Hash className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold text-slate-400">ID:</span>
              <span className="font-mono">{analysis.opportunity_number}</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-semibold text-slate-400">Deadline:</span>
              <span className="font-medium text-amber-200">{analysis.submission_deadline}</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-semibold text-slate-400">Budget:</span>
              <span className="font-medium text-emerald-200">{analysis.estimated_budget}</span>
            </div>

            {analysis.provider && (
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs ${
                  analysis.provider === 'groq'
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                    : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-semibold text-slate-400">Engine:</span>
                <span className="font-medium">
                  {analysis.provider === 'groq' ? 'Groq Cloud (Llama 3.3 70B)' : 'Google Gemini'}
                  {analysis.fallbackTriggered ? ' [Auto-Fallback]' : ''}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap lg:flex-col items-stretch gap-2.5 flex-shrink-0">
          <button
            onClick={handleExportWord}
            disabled={isExportingWord}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-xs tracking-wide uppercase transition-all duration-200 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-indigo-600/20 active:scale-[0.98] disabled:opacity-50"
            title="Download formatted proposal outline in Microsoft Word (.docx)"
          >
            <FileDown className="w-4 h-4" />
            {isExportingWord ? 'Generating .docx...' : 'Download Word Draft (.docx)'}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJson}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg font-medium text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition active:scale-[0.98]"
              title="Download full analysis as structured JSON"
            >
              <FileCode2 className="w-3.5 h-3.5 text-slate-400" />
              Export JSON
            </button>

            <button
              onClick={handleCopySummary}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg font-medium text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition active:scale-[0.98]"
              title="Copy executive summary markdown to clipboard"
            >
              {copiedSummary ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  Copied!
                </>
              ) : (
                <>
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  Copy Markdown
                </>
              )}
            </button>
          </div>

          <button
            onClick={onReset}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg font-semibold text-xs text-indigo-400 hover:text-white bg-indigo-950/40 hover:bg-indigo-900/60 border border-indigo-500/30 transition shadow-sm active:scale-[0.98]"
            title="Reset analysis and upload a new RFP document"
          >
            <RotateCcw className="w-3.5 h-3.5 text-indigo-400" />
            Analyze Another RFP
          </button>
        </div>
      </div>
    </header>
  );
}
