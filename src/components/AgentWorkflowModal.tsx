import React from 'react';
import { AgentWorkflowVisualizer } from './AgentWorkflowVisualizer.tsx';
import { AgentWorkflowStepLog, SpecialistAgentResult } from '../types/reporting.ts';
import { X, Bot, ShieldCheck } from 'lucide-react';

interface AgentWorkflowModalProps {
  logs: AgentWorkflowStepLog[];
  specialistOutputs: SpecialistAgentResult[];
  isRunning: boolean;
  onInspectPayload: (title: string, payload: any) => void;
  reportDate: string;
  onClose: () => void;
}

export const AgentWorkflowModal: React.FC<AgentWorkflowModalProps> = ({
  logs,
  specialistOutputs,
  isRunning,
  onInspectPayload,
  reportDate,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-xs">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Multi-Agent System Workflow & Execution Logs
              </h2>
              <p className="text-xs text-slate-500">
                Live supervision: Marketplace Specialists → Consolidation Engine → Gemini AI Reporting
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
            id="close-agent-workflow-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>
              All operational numbers are calculated deterministically from local marketplace CSV snapshots. Specialist agents validate data integrity before delegating to Gemini AI.
            </span>
          </div>

          <AgentWorkflowVisualizer
            logs={logs}
            specialistOutputs={specialistOutputs}
            isRunning={isRunning}
            onInspectPayload={onInspectPayload}
            reportDate={reportDate}
          />
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition"
          >
            Close Logs
          </button>
        </div>
      </div>
    </div>
  );
};
