import React, { useState } from 'react';
import {
  X,
  Layers,
  ShieldCheck,
  Zap,
  Cpu,
  Database,
  ArrowRight,
  Sparkles,
  FileSpreadsheet,
  CheckCircle2,
  ExternalLink,
  Code2,
} from 'lucide-react';

interface ArchitectureModalProps {
  onClose: () => void;
  syntheticFiles: Array<{ name: string; type: string }>;
  productMaster: any[];
  platformMappings: any[];
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({
  onClose,
  syntheticFiles,
  productMaster,
  platformMappings,
}) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'migration' | 'dictionary' | 'files'>('architecture');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col border border-slate-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-900 text-white rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 text-white rounded-lg shadow-sm">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Multi-Agent Architecture & System Design</span>
                <span className="text-xs px-2 py-0.5 rounded bg-blue-800 text-blue-200 font-medium">
                  Enterprise Blueprint
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Supervisor Pattern • Separation of Deterministic Math & AI • Production API Roadmap
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 text-xs font-semibold text-slate-600">
          <button
            onClick={() => setActiveTab('architecture')}
            className={`py-3 px-4 border-b-2 transition ${
              activeTab === 'architecture'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Multi-Agent Architecture
          </button>
          <button
            onClick={() => setActiveTab('migration')}
            className={`py-3 px-4 border-b-2 transition ${
              activeTab === 'migration'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Future Production API Migration
          </button>
          <button
            onClick={() => setActiveTab('dictionary')}
            className={`py-3 px-4 border-b-2 transition ${
              activeTab === 'dictionary'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Data Dictionary & Formulas
          </button>
          <button
            onClick={() => setActiveTab('files')}
            className={`py-3 px-4 border-b-2 transition ${
              activeTab === 'files'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Synthetic Datasets ({syntheticFiles.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 md:p-8 overflow-y-auto text-slate-800 text-xs leading-relaxed">
          {activeTab === 'architecture' && (
            <div className="space-y-6">
              {/* Core Design Principles */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="font-bold text-blue-900 flex items-center gap-1.5 mb-1">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    Deterministic Math First
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    ROAS, ACOS, 7d Sales Velocity, Days Cover, and Return Rates are calculated in deterministic TypeScript code. Zero AI hallucinations in core business numbers.
                  </p>
                </div>

                <div className="p-3.5 bg-indigo-50 border border-indigo-200 rounded-xl">
                  <div className="font-bold text-indigo-900 flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    AI For Synthesis & Context
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    Gemini 3.7 Flash analyzes pre-calculated metrics to generate qualitative trend summaries, highlight anomalies, and draft executive narrative reports.
                  </p>
                </div>

                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <div className="font-bold text-emerald-900 flex items-center gap-1.5 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Human-in-the-Loop Decisions
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    Autonomous budget modification is strictly disabled. The system produces executive decision action points for employee review and verification.
                  </p>
                </div>
              </div>

              {/* Agent Roles Breakdown */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                <h3 className="font-bold text-slate-900 text-sm mb-3">Multi-Agent Workflow Topology</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between font-bold text-slate-800">
                      <span>1. Sleepsia Reporting Supervisor</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 text-blue-800">Orchestrator</span>
                    </div>
                    <p className="text-slate-600 mt-1 text-[11px]">
                      Receives report execution trigger, validates target date parameter, initiates the 4 marketplace specialist agents, logs latency/step events, and coordinates output passing.
                    </p>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between font-bold text-slate-800">
                      <span>2. Marketplace Specialist Agents (4 Parallel Workers)</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">Specialists</span>
                    </div>
                    <ul className="list-disc list-inside text-slate-600 mt-1 space-y-0.5 text-[11px]">
                      <li><b>Amazon Performance Agent:</b> Ingests ASIN operational data, computes BSR & ROAS.</li>
                      <li><b>Flipkart Performance Agent:</b> Ingests FSN operational data, calculates rank & returns.</li>
                      <li><b>Blinkit Performance Agent:</b> Evaluates 10-minute dark-store availability & velocity.</li>
                      <li><b>Instamart Performance Agent:</b> Ingests Swiggy quick-commerce metrics & inventory levels.</li>
                    </ul>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between font-bold text-slate-800">
                      <span>3. E-commerce Performance Consolidation Agent</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-800">Normalizer</span>
                    </div>
                    <p className="text-slate-600 mt-1 text-[11px]">
                      Joins platform IDs with <code>product_master.csv</code>, aggregates cross-platform revenue, compares channel dynamics, calculates composite Product Health (0-100), and flags inventory depletion risks.
                    </p>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between font-bold text-slate-800">
                      <span>4. Sleepsia Reporting Agent</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">Gemini 3.7 Flash</span>
                    </div>
                    <p className="text-slate-600 mt-1 text-[11px]">
                      Translates structured operational numbers into an executive briefing document and formats the official Word (.docx) report with management decision checklist.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'migration' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-blue-950">
                <div className="font-bold text-sm mb-1">Seamless Production Migration Path</div>
                <p className="text-[11px] text-blue-900 leading-normal">
                  In this demo prototype, synthetic CSV files simulate marketplace API responses. In production, each specialist agent swaps its local CSV parser with official authenticated API connectors without altering the Supervisor orchestration or Consolidation contract.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Amazon SP-API */}
                <div className="p-3.5 bg-white border border-slate-200 rounded-xl">
                  <div className="flex items-center justify-between font-bold text-slate-900 mb-1">
                    <span>Amazon Integration</span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded">SP-API</span>
                  </div>
                  <div className="text-[11px] text-slate-600 space-y-1">
                    <div>• <b>API:</b> Amazon Selling Partner API (Reports API & Sponsored Products API).</div>
                    <div>• <b>Reports:</b> <code>GET_MERCHANT_LISTINGS_ALL_DATA</code>, <code>GET_V2_SETTLEMENT_REPORT_DATA_FLAT_FILE</code>.</div>
                    <div>• <b>Ads:</b> Amazon Advertising API (Campaigns, Ad Groups, Sponsored Products Keywords).</div>
                  </div>
                </div>

                {/* Flipkart Seller API */}
                <div className="p-3.5 bg-white border border-slate-200 rounded-xl">
                  <div className="flex items-center justify-between font-bold text-slate-900 mb-1">
                    <span>Flipkart Integration</span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded">Seller API v3</span>
                  </div>
                  <div className="text-[11px] text-slate-600 space-y-1">
                    <div>• <b>API:</b> Flipkart Marketplace Seller API & Flipkart Product Advertising API.</div>
                    <div>• <b>Endpoints:</b> <code>/v3/orders/search</code>, <code>/v3/inventory</code>, <code>/v3/returns</code>.</div>
                    <div>• <b>Ads:</b> Flipkart Ads Campaign Analytics API for daily spend & attributed GMV.</div>
                  </div>
                </div>

                {/* Blinkit Vendor API */}
                <div className="p-3.5 bg-white border border-slate-200 rounded-xl">
                  <div className="flex items-center justify-between font-bold text-slate-900 mb-1">
                    <span>Blinkit Integration</span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded">Partner Portal</span>
                  </div>
                  <div className="text-[11px] text-slate-600 space-y-1">
                    <div>• <b>API:</b> Blinkit Brand Partner API & Dark Store Stock Webhooks.</div>
                    <div>• <b>Metrics:</b> Micro-fulfillment dark-store stock levels, 10-minute dispatch velocity, and regional out-of-stock rates.</div>
                  </div>
                </div>

                {/* Swiggy Instamart */}
                <div className="p-3.5 bg-white border border-slate-200 rounded-xl">
                  <div className="flex items-center justify-between font-bold text-slate-900 mb-1">
                    <span>Instamart Integration</span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded">Swiggy Brand API</span>
                  </div>
                  <div className="text-[11px] text-slate-600 space-y-1">
                    <div>• <b>API:</b> Swiggy Partner Brand Portal & Ad Management API.</div>
                    <div>• <b>Metrics:</b> Metro POD inventory, banner ad attribution, and delivery fulfillment SLA stats.</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'dictionary' && (
            <div className="space-y-4">
              <div className="font-bold text-sm text-slate-900">Standard Metric Formulas & Definitions</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="font-bold text-slate-800 text-xs">Return on Ad Spend (ROAS)</div>
                  <div className="text-[11px] font-mono text-blue-700 mt-1">ROAS = Ad Attributed Revenue / Ad Spend</div>
                  <div className="text-[10px] text-slate-500 mt-1">Measures advertising efficiency. Benchmark: &gt; 3.5x.</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="font-bold text-slate-800 text-xs">Advertising Cost of Sales (ACOS)</div>
                  <div className="text-[11px] font-mono text-blue-700 mt-1">ACOS = (Ad Spend / Ad Attributed Revenue) × 100</div>
                  <div className="text-[10px] text-slate-500 mt-1">Inverse of ROAS expressed as a percentage.</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="font-bold text-slate-800 text-xs">7-Day Rolling Sales Velocity</div>
                  <div className="text-[11px] font-mono text-blue-700 mt-1">Velocity = Total Units Sold (trailing 7d) / 7</div>
                  <div className="text-[10px] text-slate-500 mt-1">Mean daily run rate across channels.</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="font-bold text-slate-800 text-xs">Inventory Days Cover</div>
                  <div className="text-[11px] font-mono text-blue-700 mt-1">Days Cover = Current Stock / 7d Sales Velocity</div>
                  <div className="text-[10px] text-slate-500 mt-1">Depletion risk if Days Cover &lt; 7 days.</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'files' && (
            <div className="space-y-4">
              <div className="font-bold text-sm text-slate-900">Synthetic Ingestion Datasets (Demo Environment)</div>
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 font-semibold text-slate-700">
                    <tr>
                      <th className="p-2.5">File Name</th>
                      <th className="p-2.5">Description & Purpose</th>
                      <th className="p-2.5 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {syntheticFiles.map((file, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-2.5 font-mono font-bold text-slate-800">{file.name}</td>
                        <td className="p-2.5 text-slate-600">{file.type}</td>
                        <td className="p-2.5 text-center">
                          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                            Loaded
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 rounded-b-2xl flex items-center justify-between text-xs">
          <span className="text-slate-500">Sleepsia Architecture Spec v2.4</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold transition"
          >
            Close Spec
          </button>
        </div>
      </div>
    </div>
  );
};
