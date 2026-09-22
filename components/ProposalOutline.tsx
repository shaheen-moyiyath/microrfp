'use client';

import React, { useState } from 'react';
import { ProposalSection } from '@/types/rfp';
import {
  FileText,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  CheckSquare,
  Sparkles,
} from 'lucide-react';

interface ProposalOutlineProps {
  outline: ProposalSection[];
}

export function ProposalOutline({ outline }: ProposalOutlineProps) {
  // Open the first two sections by default
  const [openSections, setOpenSections] = useState<Record<number, boolean>>({
    0: true,
    1: true,
  });
  const [copied, setCopied] = useState(false);

  const toggleSection = (idx: number) => {
    setOpenSections((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const expandAll = () => {
    const all: Record<number, boolean> = {};
    outline.forEach((_, i) => (all[i] = true));
    setOpenSections(all);
  };

  const collapseAll = () => {
    setOpenSections({});
  };

  const handleCopyOutline = () => {
    const text = outline
      .map(
        (sec) =>
          `### ${sec.section_title}\n${sec.key_points_to_cover
            .map((pt) => `  - [ ] ${pt}`)
            .join('\n')}`
      )
      .join('\n\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-md backdrop-blur-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            Draft Proposal Response Outline
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Structured section-by-section outline ready for immediate drafting and author assignments
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={expandAll}
            className="px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200 transition"
          >
            Expand All
          </button>
          <span className="text-slate-700">|</span>
          <button
            onClick={collapseAll}
            className="px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200 transition"
          >
            Collapse All
          </button>
          <span className="text-slate-700">|</span>
          <button
            onClick={handleCopyOutline}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            title="Copy entire outline formatted as Markdown checklist"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Copied Outline!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                Copy Outline
              </>
            )}
          </button>
        </div>
      </div>

      {/* Accordion List */}
      <div className="space-y-3 pt-2">
        {outline.map((section, idx) => {
          const isOpen = !!openSections[idx];

          return (
            <div
              key={idx}
              className={`rounded-lg border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? 'border-indigo-500/40 bg-slate-950/80 shadow-sm'
                  : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleSection(idx)}
                className="w-full flex items-center justify-between p-4 text-left transition"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold font-mono transition ${
                      isOpen
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span className="font-semibold text-sm text-slate-200">
                    {section.section_title}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
                    {section.key_points_to_cover.length} Key Sub-points
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 border-t border-slate-800/80">
                  <div className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-3 pt-2">
                    Key Topics &amp; Proof Points to Cover:
                  </div>
                  <ul className="space-y-2.5">
                    {section.key_points_to_cover.map((point, pIdx) => (
                      <li
                        key={pIdx}
                        className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/60 text-xs text-slate-300 leading-relaxed"
                      >
                        <CheckSquare className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
