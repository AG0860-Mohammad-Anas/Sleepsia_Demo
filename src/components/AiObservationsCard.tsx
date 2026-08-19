import React from 'react';
import { AIReportIntelligence } from '../types/reporting.ts';
import { Sparkles, FileText, CheckCircle2 } from 'lucide-react';

interface AiObservationsCardProps {
  ai: AIReportIntelligence;
  onOpenReportModal: () => void;
}

export const AiObservationsCard: React.FC<AiObservationsCardProps> = ({
  ai,
  onOpenReportModal,
}) => {
  return (
    <div className="bg-slate-800 text-slate-100 border border-slate-700 rounded-lg p-3.5 shadow-sm flex flex-col">
      {/* Card Header */}
      <div className="flex items-center justify-between mb-3 border-b border-slate-700 pb-2">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <h2 className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
            AI Observations
          </h2>
        </div>
        <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-900/60 text-indigo-300 border border-indigo-700 font-mono">
          {ai.aiModelUsed}
        </span>
      </div>

      {/* Observations Sections with High-Density Left Borders */}
      <div className="space-y-3.5 overflow-y-auto max-h-[380px] pr-1">
        {/* Executive Snapshot */}
        <div className="border-l-2 border-blue-500 pl-2.5">
          <p className="text-xs font-medium text-blue-300 mb-0.5">Executive Summary</p>
          <p className="text-[11px] leading-relaxed text-slate-300">
            {ai.executiveOverview}
          </p>
        </div>

        {/* ROAS & Advertising Performance */}
        <div className="border-l-2 border-indigo-400 pl-2.5">
          <p className="text-xs font-medium text-indigo-300 mb-0.5">Advertising Efficiency</p>
          <p className="text-[11px] leading-relaxed text-slate-300">
            {ai.advertisingEfficiencyAnalysis}
          </p>
        </div>

        {/* Inventory & Risk Alert */}
        <div className="border-l-2 border-amber-500 pl-2.5">
          <p className="text-xs font-medium text-amber-300 mb-0.5">Inventory & Stock Risk</p>
          <p className="text-[11px] leading-relaxed text-slate-300">
            {ai.inventoryAndRiskAnalysis}
          </p>
        </div>

        {/* Review Sentiment */}
        <div className="border-l-2 border-emerald-500 pl-2.5">
          <p className="text-xs font-medium text-emerald-300 mb-0.5">Customer Sentiment</p>
          <p className="text-[11px] leading-relaxed text-slate-300">
            {ai.reviewsAndCustomerSentimentAnalysis}
          </p>
        </div>

        {/* Management Decision Points Checklist */}
        <div className="border-l-2 border-blue-400 pl-2.5 pt-1">
          <p className="text-xs font-medium text-blue-300 mb-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-blue-400" />
            Decision Checklist
          </p>
          <div className="space-y-1.5 text-[10px] text-slate-300">
            {ai.managementDecisionPoints.slice(0, 3).map((point, idx) => (
              <div key={idx} className="flex items-start gap-1.5 bg-slate-900/60 p-1.5 rounded border border-slate-700/60">
                <span className="text-blue-400 font-bold shrink-0">#{idx + 1}</span>
                <span className="leading-snug">{point}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action to view full 14-section formal briefing */}
      <div className="mt-3 pt-2.5 border-t border-slate-700">
        <button
          onClick={onOpenReportModal}
          className="w-full py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition"
          id="sidebar-view-brief-btn"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>View 14-Section Brief</span>
        </button>
      </div>
    </div>
  );
};
