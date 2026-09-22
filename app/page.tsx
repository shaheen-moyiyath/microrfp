'use client';

import React, { useState, useEffect } from 'react';
import { RFPAnalysis } from '@/types/rfp';
import { UploadZone } from '@/components/UploadZone';
import { DashboardHeader } from '@/components/DashboardHeader';
import { ScoreCard } from '@/components/ScoreCard';
import { KeyRequirementsTable } from '@/components/KeyRequirementsTable';
import { ComplianceMatrixTable } from '@/components/ComplianceMatrixTable';
import { EvaluationCriteria } from '@/components/EvaluationCriteria';
import { ProposalOutline } from '@/components/ProposalOutline';
import { RawJsonModal } from '@/components/RawJsonModal';
import {
  FileText,
  ShieldCheck,
  FileCheck,
  ListOrdered,
  Award,
  Code2,
  AlertOctagon,
  Sparkles,
  RotateCcw,
  Clock,
  History,
  Trash2,
} from 'lucide-react';

interface HistoryItem {
  id: string;
  title: string;
  agency: string;
  score: number;
  verdict: string;
  timestamp: string;
  data: RFPAnalysis;
}

export default function Home() {
  const [analysis, setAnalysis] = useState<RFPAnalysis | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'requirements' | 'compliance' | 'criteria' | 'outline'>('all');
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const [showHistoryDropdown, setShowHistoryDropdown] = useState(false);

  // Restore analysis and history from storage on mount
  useEffect(() => {
    try {
      const savedActive = sessionStorage.getItem('microrfp_active_analysis');
      if (savedActive) {
        setAnalysis(JSON.parse(savedActive));
      }

      const savedHistory = localStorage.getItem('microrfp_history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch {
      // Ignore parse/storage errors
    }
  }, []);

  const handleAnalysisComplete = (data: RFPAnalysis) => {
    setAnalysis(data);
    setErrorMessage(null);

    try {
      sessionStorage.setItem('microrfp_active_analysis', JSON.stringify(data));

      // Append to recent history
      const newItem: HistoryItem = {
        id: `${Date.now()}_${(data.opportunity_number || 'opp').replace(/[^a-zA-Z0-9]/g, '')}`,
        title: data.title || 'Untitled RFP',
        agency: data.issuing_agency || 'Not Specified',
        score: data.go_no_go_score,
        verdict: data.go_no_go_verdict,
        timestamp: new Date().toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        data,
      };

      setHistory((prev) => {
        const filtered = prev.filter(
          (p) => p.data.opportunity_number !== data.opportunity_number || p.data.title !== data.title
        );
        const updated = [newItem, ...filtered].slice(0, 10);
        try {
          localStorage.setItem('microrfp_history', JSON.stringify(updated));
        } catch {}
        return updated;
      });
    } catch {
      // Ignore quota errors
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectHistoryItem = (item: HistoryItem) => {
    setAnalysis(item.data);
    setErrorMessage(null);
    setShowHistoryDropdown(false);
    try {
      sessionStorage.setItem('microrfp_active_analysis', JSON.stringify(item.data));
    } catch {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('microrfp_history');
    } catch {}
    setShowHistoryDropdown(false);
  };

  const handleReset = () => {
    setAnalysis(null);
    setErrorMessage(null);
    try {
      sessionStorage.removeItem('microrfp_active_analysis');
    } catch {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <nav className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={handleReset}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-extrabold text-lg">
              µ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-white text-base">MicroRFP</span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  AI Proposal Strategist
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                B2B Government Contracting &amp; Enterprise Decision Engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* History Selector Dropdown */}
            {history.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setShowHistoryDropdown(!showHistoryDropdown)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition"
                  title="View recently analyzed RFPs"
                >
                  <History className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="hidden sm:inline">Recent RFPs</span> ({history.length})
                </button>

                {showHistoryDropdown && (
                  <div className="absolute right-0 mt-2 w-80 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in">
                    <div className="flex items-center justify-between px-2 py-1.5 border-b border-slate-800 text-xs font-semibold text-slate-300">
                      <span>Analysis History</span>
                      <button
                        onClick={handleClearHistory}
                        className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        Clear
                      </button>
                    </div>
                    <div className="max-h-64 overflow-y-auto divide-y divide-slate-800/60 mt-1">
                      {history.map((h) => (
                        <button
                          key={h.id}
                          onClick={() => handleSelectHistoryItem(h)}
                          className="w-full text-left p-2.5 hover:bg-slate-800/60 rounded-lg transition text-xs flex flex-col gap-1"
                        >
                          <div className="font-semibold text-slate-200 line-clamp-1">{h.title}</div>
                          <div className="flex items-center justify-between text-[11px] text-slate-400">
                            <span className="line-clamp-1">{h.agency}</span>
                            <span
                              className={`font-bold font-mono px-1.5 py-0.5 rounded text-[10px] ${
                                h.verdict === 'RECOMMENDED'
                                  ? 'bg-emerald-500/10 text-emerald-400'
                                  : h.verdict === 'RISKY'
                                  ? 'bg-amber-500/10 text-amber-400'
                                  : 'bg-rose-500/10 text-rose-400'
                              }`}
                            >
                              {h.score}/100
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {analysis && (
              <>
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-300 border border-indigo-500/30 transition shadow-sm active:scale-[0.98]"
                  title="Upload and analyze another RFP"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="hidden sm:inline">Analyze Another RFP</span>
                </button>

                <button
                  onClick={() => setIsJsonModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition"
                  title="Inspect raw JSON schema"
                >
                  <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="hidden md:inline">Raw JSON</span>
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-200 text-xs flex items-start justify-between gap-3 animate-in fade-in">
            <div className="flex items-start gap-2.5">
              <AlertOctagon className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-rose-100">Analysis Notice</p>
                <p className="mt-0.5 leading-relaxed">{errorMessage}</p>
              </div>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-400 hover:text-rose-200 text-xs font-bold p-1"
            >
              ✕
            </button>
          </div>
        )}

        {!analysis ? (
          /* Landing & Upload View */
          <div className="py-10 space-y-12">
            {/* Hero Copy */}
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Instant Bid/No-Bid Decision &amp; Proposal Blueprint
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                Turn 150-Page RFPs into <br />
                <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent">
                  Winning Bid Strategy
                </span>{' '}
                in Seconds
              </h1>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                Conduct an exhaustive, risk-aware analysis of any government or enterprise RFP.
                Get an objective Go/No-Go scorecard, a strict compliance checklist, and an exportable
                Word (.docx) proposal outline ready for your response team.
              </p>
            </div>

            {/* Upload Zone */}
            <UploadZone
              onAnalysisComplete={handleAnalysisComplete}
              onError={(msg) => setErrorMessage(msg)}
            />

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 max-w-5xl mx-auto border-t border-slate-900">
              <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                  ✓
                </div>
                <h4 className="text-sm font-bold text-white">Strict Factual Accuracy</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Extracts details solely from the text with zero hallucination. Missing details are explicitly marked &quot;Not Specified in RFP&quot;.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                  ⚡
                </div>
                <h4 className="text-sm font-bold text-white">Risk-Aware Go/No-Go Engine</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Evaluates mandatory security certifications, compressed delivery timelines, and heavy financial penalties before you invest hours.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
                  📄
                </div>
                <h4 className="text-sm font-bold text-white">Word (.docx) Response Draft</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  One-click export generates an executive-ready Microsoft Word document with your complete proposal outline and compliance matrix.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Results Dashboard View */
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Header with Title, Deadlines, and Export Buttons */}
            <DashboardHeader analysis={analysis} onReset={handleReset} />

            {/* Visual Bid/No-Bid Decision ScoreCard */}
            <ScoreCard analysis={analysis} />

            {/* View Navigation Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-900/80 rounded-xl border border-slate-800 overflow-x-auto text-xs">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'all'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                All Sections
              </button>

              <button
                onClick={() => setActiveTab('requirements')}
                className={`px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'requirements'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Key Requirements ({analysis.key_requirements.length})
              </button>

              <button
                onClick={() => setActiveTab('compliance')}
                className={`px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'compliance'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileCheck className="w-3.5 h-3.5" />
                Compliance Matrix ({analysis.compliance_matrix.length})
              </button>

              <button
                onClick={() => setActiveTab('criteria')}
                className={`px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'criteria'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                Evaluation Weights ({analysis.evaluation_criteria.length})
              </button>

              <button
                onClick={() => setActiveTab('outline')}
                className={`px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'outline'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ListOrdered className="w-3.5 h-3.5" />
                Proposal Outline ({analysis.draft_proposal_outline.length} Sections)
              </button>
            </div>

            {/* Sections rendering based on tab */}
            {(activeTab === 'all' || activeTab === 'requirements') && (
              <KeyRequirementsTable requirements={analysis.key_requirements} />
            )}

            {(activeTab === 'all' || activeTab === 'compliance') && (
              <ComplianceMatrixTable matrix={analysis.compliance_matrix} />
            )}

            {(activeTab === 'all' || activeTab === 'criteria') && (
              <EvaluationCriteria criteria={analysis.evaluation_criteria} />
            )}

            {(activeTab === 'all' || activeTab === 'outline') && (
              <ProposalOutline outline={analysis.draft_proposal_outline} />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-400">
        <p>MicroRFP — B2B Government Contracting &amp; Enterprise Proposal Decision Strategist</p>
      </footer>

      {/* Raw JSON Inspection Modal */}
      {analysis && (
        <RawJsonModal
          analysis={analysis}
          isOpen={isJsonModalOpen}
          onClose={() => setIsJsonModalOpen(false)}
        />
      )}
    </div>
  );
}
