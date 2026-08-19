import React from 'react';
import { FullDailyReportResponse } from '../types/reporting.ts';
import {
  X,
  Download,
  Printer,
  Copy,
  CheckCircle2,
  FileText,
  Sparkles,
  ShieldCheck,
  Building,
  TrendingUp,
  AlertOctagon,
  Calendar,
} from 'lucide-react';

interface ManagementReportModalProps {
  report: FullDailyReportResponse;
  onClose: () => void;
  onDownloadDocx: () => void;
}

export const ManagementReportModal: React.FC<ManagementReportModalProps> = ({
  report,
  onClose,
  onDownloadDocx,
}) => {
  const [copied, setCopied] = React.useState(false);
  const data = report.consolidatedData;
  const ai = report.aiIntelligence;
  const kpis = data.kpis;

  const copyToClipboard = () => {
    const text = `# SLEEPSIA DAILY E-COMMERCE MANAGEMENT REPORT
Date: ${data.reportDate}
Generated: ${new Date(data.generatedAt).toLocaleString()}

## 1. Executive Overview
${ai.executiveOverview}

## 2. Daily KPIs
- Gross Revenue: ₹${kpis.totalRevenue.toLocaleString()}
- Total Units Sold: ${kpis.totalSales.toLocaleString()}
- Total Ad Spend: ₹${kpis.totalAdSpend.toLocaleString()}
- Overall ROAS: ${kpis.overallRoas}x (ACOS: ${kpis.overallAcos}%)
- Total Returns: ${kpis.totalReturns} (${kpis.returnRate}%)

## 3. Platform Comparison
${ai.platformObservations}

## 4. Product Highlights
${ai.productPerformanceAnalysis}

## 5. Advertising Efficiency
${ai.advertisingEfficiencyAnalysis}

## 6. Inventory & Risk Analysis
${ai.inventoryAndRiskAnalysis}

## 7. Customer Sentiment & Reviews
${ai.reviewsAndCustomerSentimentAnalysis}

## 8. Management Action Points (Human Decision-Making)
${ai.managementDecisionPoints.map((p, i) => `${i + 1}. ${p}`).join('\n')}

---
Data Integrity Statement: ${ai.dataIntegrityStatement}
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col border border-slate-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 text-white rounded-lg shadow-sm">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>Sleepsia Daily Management Report</span>
                <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-medium">
                  {data.reportDate}
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                14-Section Standard Executive Briefing Document
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={copyToClipboard}
              className="flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition"
              title="Copy markdown text"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition"
              title="Print Document"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            <button
              onClick={onDownloadDocx}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-xs transition"
              title="Download Microsoft Word .docx"
              id="modal-download-docx-btn"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .DOCX</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body (Scrollable Report Document) */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-slate-800 text-xs leading-relaxed font-sans">
          {/* Header Block in Report */}
          <div className="border-b border-slate-200 pb-4 text-center">
            <div className="text-xl font-black text-slate-900 tracking-tight">
              SLEEPSIA E-COMMERCE INTELLIGENCE REPORT
            </div>
            <div className="text-slate-500 mt-1 flex items-center justify-center space-x-4">
              <span>Report Date: <b>{data.reportDate}</b></span>
              <span>•</span>
              <span>Prepared for: <b>Sleepsia Management Board</b></span>
              <span>•</span>
              <span>Model: <b>{ai.aiModelUsed}</b></span>
            </div>
            <div className="mt-2 inline-block px-3 py-0.5 rounded-full bg-slate-100 text-[10px] text-slate-600 border border-slate-200">
              Demo Prototype • Multi-Platform Synthetic Ingestion • Human Decision Support Only
            </div>
          </div>

          {/* Section 1: Executive Overview */}
          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                1. Executive Overview
              </h3>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 font-medium">
                AI Synthesis
              </span>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-slate-700 leading-normal">
              {ai.executiveOverview}
            </div>
          </section>

          {/* Section 2: Overall Marketplace Performance */}
          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                2. Overall Marketplace Performance & KPIs
              </h3>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-medium">
                Deterministic Math
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
              <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                <div className="text-[10px] text-slate-500 uppercase">Gross Revenue</div>
                <div className="text-base font-bold text-slate-900">₹{kpis.totalRevenue.toLocaleString()}</div>
              </div>
              <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                <div className="text-[10px] text-slate-500 uppercase">Units Sold</div>
                <div className="text-base font-bold text-slate-900">{kpis.totalSales.toLocaleString()}</div>
              </div>
              <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                <div className="text-[10px] text-slate-500 uppercase">Ad Spend</div>
                <div className="text-base font-bold text-slate-900">₹{kpis.totalAdSpend.toLocaleString()}</div>
              </div>
              <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                <div className="text-[10px] text-slate-500 uppercase">Blended ROAS</div>
                <div className="text-base font-bold text-emerald-700">{kpis.overallRoas}x</div>
              </div>
              <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                <div className="text-[10px] text-slate-500 uppercase">Returns</div>
                <div className="text-base font-bold text-slate-900">{kpis.returnRate}%</div>
              </div>
            </div>
          </section>

          {/* Section 3: Platform Performance */}
          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              3. Marketplace Channel Performance
            </h3>
            <p className="text-slate-600">{ai.platformObservations}</p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded">
                <thead className="bg-slate-100 font-semibold text-slate-700">
                  <tr>
                    <th className="p-2">Platform</th>
                    <th className="p-2 text-right">Units</th>
                    <th className="p-2 text-right">Revenue</th>
                    <th className="p-2 text-right">Share %</th>
                    <th className="p-2 text-right">Ad Spend</th>
                    <th className="p-2 text-right">ROAS</th>
                    <th className="p-2 text-right">Return Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {data.platformPerformance.map((p) => (
                    <tr key={p.platform}>
                      <td className="p-2 font-bold">{p.platform}</td>
                      <td className="p-2 text-right">{p.unitsSold}</td>
                      <td className="p-2 text-right font-medium">₹{p.revenue.toLocaleString()}</td>
                      <td className="p-2 text-right">{p.revenueShare}%</td>
                      <td className="p-2 text-right">₹{p.adSpend.toLocaleString()}</td>
                      <td className="p-2 text-right font-bold text-emerald-700">{p.roas}x</td>
                      <td className="p-2 text-right">{p.returnRate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 4: Product Performance */}
          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              4. Product Performance Breakdown
            </h3>
            <p className="text-slate-600">{ai.productPerformanceAnalysis}</p>
          </section>

          {/* Section 5: Advertising Performance */}
          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              5. Advertising Efficiency & Attribution
            </h3>
            <p className="text-slate-600">{ai.advertisingEfficiencyAnalysis}</p>
          </section>

          {/* Section 6: Inventory & Availability */}
          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              6. Inventory & Availability Alerts
            </h3>
            <p className="text-slate-600">{ai.inventoryAndRiskAnalysis}</p>
            {data.inventoryAlerts.length > 0 && (
              <div className="bg-rose-50 border border-rose-200 rounded p-3 text-rose-900">
                <div className="font-bold text-xs mb-1">Active Stock Constraints:</div>
                <ul className="list-disc list-inside space-y-0.5">
                  {data.inventoryAlerts.map((a, i) => (
                    <li key={i}>
                      <b>{a.productName} ({a.platform})</b>: {a.status} - {a.reason}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {/* Section 7: Reviews & Customer Sentiment */}
          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              7. Reviews, Ratings & Customer Sentiment
            </h3>
            <p className="text-slate-600">{ai.reviewsAndCustomerSentimentAnalysis}</p>
          </section>

          {/* Section 8: Sales Velocity */}
          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              8. 7-Day Rolling Sales Velocity
            </h3>
            <p className="text-slate-600">{ai.salesVelocityInterpretation}</p>
          </section>

          {/* Section 9: Management Decision Points */}
          <section className="space-y-2 bg-blue-50/60 p-4 rounded-xl border border-blue-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-700" />
                9. Management Decision Checklist (Action Items for Review)
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-200 text-blue-900 font-semibold">
                Employee Actionable
              </span>
            </div>
            <p className="text-slate-600 text-[11px] italic">
              Notice: The multi-agent reporting system does not make autonomous budget adjustments. The following recommendations are provided for employee evaluation.
            </p>
            <div className="space-y-2 mt-2">
              {ai.managementDecisionPoints.map((point, idx) => (
                <div key={idx} className="flex items-start space-x-2 text-slate-800 bg-white p-2.5 rounded border border-blue-100 shadow-2xs">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-snug">{point}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Section 10: Data Integrity & Production Integration */}
          <section className="border-t border-slate-200 pt-4 text-[11px] text-slate-500 space-y-1">
            <div className="font-semibold text-slate-700">Data Integrity & System Governance:</div>
            <div>{ai.dataIntegrityStatement}</div>
            <div className="mt-2 text-slate-400">
              Future Production Migration: Replace synthetic CSV feeds with Amazon SP-API, Flipkart Seller API, Blinkit Vendor Portal Webhooks, and Swiggy Instamart Brand Partner API without changing agent consolidation contracts.
            </div>
          </section>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 rounded-b-2xl flex items-center justify-between text-xs">
          <span className="text-slate-500">Sleepsia E-Commerce Daily Intelligence Prototype</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold transition"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};
