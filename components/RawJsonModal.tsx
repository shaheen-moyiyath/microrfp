'use client';

import React, { useState } from 'react';
import { RFPAnalysis } from '@/types/rfp';
import { Code2, X, Copy, Check } from 'lucide-react';

interface RawJsonModalProps {
  analysis: RFPAnalysis;
  isOpen: boolean;
  onClose: () => void;
}

export function RawJsonModal({ analysis, isOpen, onClose }: RawJsonModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const jsonString = JSON.stringify(analysis, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-4xl max-h-[85vh] rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">Extracted RFP JSON Payload</h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  Copied JSON
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  Copy JSON
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Code Content */}
        <div className="overflow-auto mt-4 p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono text-emerald-400 leading-relaxed">
          <pre>{jsonString}</pre>
        </div>
      </div>
    </div>
  );
}
