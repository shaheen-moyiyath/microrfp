'use client';

import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  Key,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { RFPAnalysis } from '@/types/rfp';
import { SAMPLE_RFP_ANALYSIS } from '@/lib/sample-data';

interface UploadZoneProps {
  onAnalysisComplete: (analysis: RFPAnalysis) => void;
  onError: (errorMsg: string) => void;
}

export function UploadZone({ onAnalysisComplete, onError }: UploadZoneProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadingStages = [
    'Parsing PDF text and page hierarchies...',
    'Extracting mandatory compliance rules and formatting constraints...',
    'Calculating Bid/No-Bid decision scorecard & risk factors...',
    'Synthesizing structured proposal outline...',
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        if (file.size > 20 * 1024 * 1024) {
          onError('File size exceeds the 20MB limit. Please upload a smaller document.');
          return;
        }
        setSelectedFile(file);
      } else {
        onError('Please upload a valid PDF document (.pdf).');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        if (file.size > 20 * 1024 * 1024) {
          onError('File size exceeds the 20MB limit. Please upload a smaller document.');
          return;
        }
        setSelectedFile(file);
      } else {
        onError('Please upload a valid PDF document (.pdf).');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsLoading(true);
    setLoadingStep(0);

    // Simulated progress steps for UX
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev < loadingStages.length - 1 ? prev + 1 : prev));
    }, 3500);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      if (apiKey.trim()) {
        formData.append('apiKey', apiKey.trim());
      }

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      clearInterval(interval);

      // Safe JSON parsing to prevent "Unexpected end of JSON input" on serverless timeouts
      const rawText = await response.text();
      let result;
      try {
        result = JSON.parse(rawText);
      } catch (parseErr) {
        throw new Error(
          'Server timed out or returned an invalid response. If using Vercel Free tier, ensure gemini-2.5-flash is configured in lib/gemini.ts.'
        );
      }

      if (!response.ok) {
        throw new Error(result.error || 'Failed to analyze RFP');
      }

      setIsLoading(false);
      onAnalysisComplete(result.data);
    } catch (err: any) {
      clearInterval(interval);
      setIsLoading(false);
      onError(err.message || 'An error occurred while analyzing the RFP.');
    }
  };

  const handleLoadSample = () => {
    setIsLoading(true);
    setLoadingStep(0);

    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev < loadingStages.length - 1 ? prev + 1 : prev));
    }, 500);

    setTimeout(() => {
      clearInterval(interval);
      setIsLoading(false);
      onAnalysisComplete(SAMPLE_RFP_ANALYSIS);
    }, 2000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Upload Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isLoading && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-indigo-400 bg-indigo-950/30 scale-[1.01]'
            : selectedFile
            ? 'border-emerald-500/50 bg-emerald-950/10'
            : 'border-slate-800 hover:border-slate-700 bg-slate-900/40 hover:bg-slate-900/60'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileChange}
          className="hidden"
          disabled={isLoading}
        />

        <div className="flex flex-col items-center justify-center space-y-4">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition ${
              selectedFile
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20'
            }`}
          >
            {selectedFile ? (
              <FileText className="w-8 h-8" />
            ) : (
              <UploadCloud className="w-8 h-8" />
            )}
          </div>

          <div>
            {selectedFile ? (
              <div>
                <p className="text-base font-semibold text-white">{selectedFile.name}</p>
                <p className="text-xs text-slate-400 mt-1">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready for Analysis
                </p>
                <p className="text-xs text-indigo-400 underline mt-2">Click to select a different file</p>
              </div>
            ) : (
              <div>
                <p className="text-base font-semibold text-slate-200">
                  Drag and drop your RFP document (PDF) here
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Or <span className="text-indigo-400 font-semibold underline">browse your files</span>. Supports up to 20MB &amp; 200+ pages.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Loading State Overlay / Progress Bar */}
      {isLoading && (
        <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/20 p-5 space-y-3 backdrop-blur-sm animate-pulse">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="flex items-center gap-2 text-indigo-300">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
              {loadingStages[loadingStep]}
            </span>
            <span className="text-indigo-400 font-mono">
              Step {loadingStep + 1} of {loadingStages.length}
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all duration-700 ease-out"
              style={{ width: `${((loadingStep + 1) / loadingStages.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Primary Actions */}
      {!isLoading && (
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleSubmit}
            disabled={!selectedFile || isLoading}
            className="w-full sm:flex-1 py-3 px-6 rounded-xl font-bold text-sm uppercase tracking-wider text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-indigo-600/20 disabled:opacity-40 disabled:cursor-not-allowed transition active:scale-[0.99] flex items-center justify-center gap-2"
          >
            <span>Analyze RFP Document</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleLoadSample}
            disabled={isLoading}
            className="w-full sm:w-auto py-3 px-5 rounded-xl font-medium text-xs text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition flex items-center justify-center gap-2"
            title="Load sample federal RFP analysis without uploading"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Try Sample Federal RFP</span>
          </button>
        </div>
      )}

      {/* Optional Custom Gemini API Key Collapsible */}
      <div className="pt-2 border-t border-slate-800/80">
        <button
          type="button"
          onClick={() => setShowApiKeyInput(!showApiKeyInput)}
          className="text-xs text-slate-500 hover:text-slate-400 flex items-center gap-1.5 mx-auto transition"
        >
          <Key className="w-3.5 h-3.5" />
          {showApiKeyInput ? 'Hide Custom Gemini API Key' : 'Provide custom Gemini API Key (optional)'}
        </button>

        {showApiKeyInput && (
          <div className="mt-3 p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-left space-y-2">
            <label className="block text-xs font-medium text-slate-300">
              Google Gemini API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
            />
            <p className="text-[11px] text-slate-500">
              Not needed if <code className="text-slate-400">GEMINI_API_KEY</code> is set in <code className="text-slate-400">.env.local</code>. Never stored or logged.
            </p>
          </div>
        )}
      </div>

      {/* Security & Accuracy Badge */}
      <div className="flex items-center justify-center gap-4 text-xs text-slate-400 pt-2">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Strict Factual Accuracy</span>
        </div>
        <span>•</span>
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-blue-400" />
          <span>Zero Fabrication Policy</span>
        </div>
      </div>
    </div>
  );
}
