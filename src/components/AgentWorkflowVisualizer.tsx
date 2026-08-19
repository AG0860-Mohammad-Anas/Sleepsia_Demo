import React from 'react';
import { AgentWorkflowStepLog, SpecialistAgentResult } from '../types/reporting.ts';
import {
  CheckCircle2,
  Code2,
  Cpu,
  Layers,
  Sparkles,
  Zap,
  ShoppingBag,
  Clock,
  Play,
} from 'lucide-react';

interface AgentWorkflowVisualizerProps {
  logs: AgentWorkflowStepLog[];
  specialistOutputs: SpecialistAgentResult[];
  isRunning: boolean;
  onInspectPayload: (agentName: string, payload: any) => void;
  reportDate: string;
}

export const AgentWorkflowVisualizer: React.FC<AgentWorkflowVisualizerProps> = ({
  logs,
  specialistOutputs,
  isRunning,
  onInspectPayload,
  reportDate,
}) => {
  const getAgentLog = (stepKey: string) => {
    return logs.find((l) => l.stepId.includes(stepKey));
  };

  const specialists = [
    { key: 'amazon', name: 'Amazon Specialist', icon: '🛒', platform: 'Amazon' },
    { key: 'flipkart', name: 'Flipkart Specialist', icon: '🛍️', platform: 'Flipkart' },
    { key: 'blinkit', name: 'Blinkit Specialist', icon: '⚡', platform: 'Blinkit' },
    { key: 'instamart', name: 'Instamart Specialist', icon: '🛵', platform: 'Instamart' },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-sm flex flex-col gap-3">
      {/* Title & Date */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <div>
          <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Agent Workflow Status
          </h2>
          <span className="text-[11px] font-semibold text-slate-800">
            Pipeline: {reportDate}
          </span>
        </div>
        <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
          Deterministic Math
        </span>
      </div>

      {/* Steps List (High Density) */}
      <div className="space-y-2.5 text-xs">
        {/* Step 1: Supervisor */}
        <div className="flex items-start gap-2.5 p-2 rounded bg-slate-50/70 border border-slate-100">
          <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
            <span className="text-emerald-700 text-[10px] font-bold">✓</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-800 truncate">Supervisor Agent</p>
              <button
                onClick={() =>
                  onInspectPayload('Reporting Supervisor', getAgentLog('supervisor')?.details || {})
                }
                className="text-[9px] text-blue-600 hover:underline font-mono"
              >
                JSON
              </button>
            </div>
            <p className="text-[10px] text-slate-400 italic">Orchestration & Validation Complete</p>
          </div>
        </div>

        {/* Step 2: 4 Marketplace Specialists */}
        <div className="flex items-start gap-2.5 p-2 rounded bg-slate-50/70 border border-slate-100">
          <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
            <span className="text-emerald-700 text-[10px] font-bold">✓</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-800 truncate">Marketplace Specialists</p>
              <span className="text-[9px] text-slate-500 font-mono">4/4 Validated</span>
            </div>
            <div className="grid grid-cols-2 gap-1 mt-1.5">
              {specialists.map((spec) => {
                const out = specialistOutputs.find((s) => s.platform === spec.platform);
                return (
                  <button
                    key={spec.key}
                    onClick={() => out && onInspectPayload(`${spec.name} Output`, out)}
                    className="p-1 text-left rounded bg-white border border-slate-200 hover:border-blue-400 text-[10px] transition"
                  >
                    <div className="flex items-center justify-between font-bold text-slate-800">
                      <span className="truncate">{spec.platform}</span>
                      <span className="text-[8px] text-slate-400">{out?.executionTimeMs}ms</span>
                    </div>
                    <div className="text-[9px] text-slate-500 truncate">
                      {out ? `₹${out.totalRevenue.toLocaleString()}` : 'Ready'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Step 3: Consolidation Agent */}
        <div className="flex items-start gap-2.5 p-2 rounded bg-slate-50/70 border border-slate-100">
          <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
            <span className="text-blue-600 text-[10px] font-bold">●</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-800 truncate">Consolidation Agent</p>
              <button
                onClick={() =>
                  onInspectPayload('Consolidated Metrics', getAgentLog('consolidation')?.details || {})
                }
                className="text-[9px] text-blue-600 hover:underline font-mono"
              >
                JSON
              </button>
            </div>
            <p className="text-[10px] text-blue-600 font-medium italic">
              Normalized cross-platform metrics & SKUs
            </p>
          </div>
        </div>

        {/* Step 4: Reporting Agent (Gemini 3.7 Flash) */}
        <div className="flex items-start gap-2.5 p-2 rounded bg-slate-50/70 border border-slate-100">
          <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="w-2.5 h-2.5 text-indigo-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-800 truncate">Reporting Agent</p>
              <button
                onClick={() =>
                  onInspectPayload('Reporting Agent Prompt & Output', getAgentLog('reporting')?.details || {})
                }
                className="text-[9px] text-indigo-600 hover:underline font-mono"
              >
                Prompt Log
              </button>
            </div>
            <p className="text-[10px] text-slate-500 italic">
              Gemini 3.7 Flash • Executive Briefing Ready
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
