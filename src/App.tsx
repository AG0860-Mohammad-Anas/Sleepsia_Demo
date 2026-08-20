import React, { useEffect, useState } from 'react';
import { Header, MainTabType } from './components/Header.tsx';
import { AiObservationsCard } from './components/AiObservationsCard.tsx';
import { KpiMetricsSection } from './components/KpiMetricsSection.tsx';
import { PlatformComparisonTable } from './components/PlatformComparisonTable.tsx';
import { ProductPerformanceMatrix } from './components/ProductPerformanceMatrix.tsx';
import { ProductHealthSection } from './components/ProductHealthSection.tsx';
import { InventoryAlertsBanner } from './components/InventoryAlertsBanner.tsx';
import { ManagementReportModal } from './components/ManagementReportModal.tsx';
import { ArchitectureModal } from './components/ArchitectureModal.tsx';
import { AgentPayloadModal } from './components/AgentPayloadModal.tsx';
import { AgentWorkflowModal } from './components/AgentWorkflowModal.tsx';
import { CompetitorComparisonSection } from './components/CompetitorComparisonSection.tsx';
import { FullDailyReportResponse } from './types/reporting.ts';
import {
  AlertCircle,
  Layers,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Package,
  Store,
  Trophy,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export function App() {
  const [selectedDate, setSelectedDate] = useState<string>('2026-08-19');
  const [availableDates, setAvailableDates] = useState<string[]>(['2026-08-19']);
  const [reportData, setReportData] = useState<FullDailyReportResponse | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<MainTabType>('overview');

  // Modals
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [showArchitectureModal, setShowArchitectureModal] = useState<boolean>(false);
  const [showAgentLogsModal, setShowAgentLogsModal] = useState<boolean>(false);
  const [payloadModal, setPayloadModal] = useState<{ title: string; payload: any } | null>(null);

  // System metadata
  const [syntheticMeta, setSyntheticMeta] = useState<{
    files: Array<{ name: string; type: string }>;
    productMaster: any[];
    platformMappings: any[];
  }>({
    files: [],
    productMaster: [],
    platformMappings: [],
  });

  useEffect(() => {
    fetchDates();
    fetchSyntheticMeta();
    runDailyReport('2026-08-19');
  }, []);

  const fetchDates = async () => {
    try {
      const res = await fetch('/api/dates');
      if (res.ok) {
        const json = await res.json();
        if (json.dates && json.dates.length > 0) {
          setAvailableDates(json.dates);
        }
      }
    } catch (e) {
      console.error('Failed to fetch dates:', e);
    }
  };

  const fetchSyntheticMeta = async () => {
    try {
      const res = await fetch('/api/synthetic-files');
      if (res.ok) {
        const json = await res.json();
        setSyntheticMeta(json);
      }
    } catch (e) {
      console.error('Failed to fetch metadata:', e);
    }
  };

  const runDailyReport = async (targetDate: string = selectedDate) => {
    setIsRunning(true);
    setError(null);
    try {
      const res = await fetch('/api/run-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: targetDate }),
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.error || 'Failed to execute report workflow');
      }

      const data: FullDailyReportResponse = await res.json();
      setReportData(data);
    } catch (err: any) {
      console.error('Report error:', err);
      setError(err.message || 'An error occurred while generating report');
    } finally {
      setIsRunning(false);
    }
  };

  const handleDownloadDocx = async () => {
    if (!reportData) return;
    try {
      const res = await fetch('/api/export-docx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportData }),
      });

      if (!res.ok) throw new Error('Failed to generate DOCX file');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Sleepsia_Management_Report_${reportData.consolidatedData.reportDate}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error('Download error:', err);
      alert('Error downloading Word report: ' + err.message);
    }
  };

  const handleExportCsv = () => {
    if (!reportData) return;
    const prods = reportData.consolidatedData.productPerformance;
    const headers = [
      'Product ID',
      'SKU',
      'Product Name',
      'Category',
      'Units Sold',
      'Gross Revenue (INR)',
      'Ad Spend (INR)',
      'Ad Attributed Revenue',
      'ROAS',
      'ACOS (%)',
      'Return Rate (%)',
      '7d Sales Velocity',
      'Total Inventory',
      'Days Cover',
      'Availability Status',
    ];

    const rows = prods.map((p) => [
      p.productId,
      p.sku,
      `"${p.productName}"`,
      p.category,
      p.totalUnitsSold,
      p.totalRevenue,
      p.totalAdSpend,
      p.totalAdAttributedRevenue,
      p.overallRoas,
      p.overallAcos,
      p.returnRate,
      p.salesVelocity7dTotal,
      p.totalInventoryAcrossPlatforms,
      p.overallDaysCover ?? 'N/A',
      p.overallAvailability,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Sleepsia_Consolidated_Products_${reportData.consolidatedData.reportDate}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const marketShare = reportData?.competitorComparison?.sleepsiaMarketShare || 38.8;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      {/* Modern Simple Header */}
      <Header
        selectedDate={selectedDate}
        availableDates={availableDates}
        onDateChange={(newDate) => {
          setSelectedDate(newDate);
          runDailyReport(newDate);
        }}
        onRunReport={() => runDailyReport(selectedDate)}
        isRunning={isRunning}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        onOpenReportModal={() => setShowReportModal(true)}
        onOpenArchitectureModal={() => setShowArchitectureModal(true)}
        onOpenAgentLogsModal={() => setShowAgentLogsModal(true)}
        onDownloadDocx={handleDownloadDocx}
        onExportCsv={handleExportCsv}
        isReportAvailable={Boolean(reportData)}
        marketShare={marketShare}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl flex items-center space-x-3 text-sm">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <div>
              <p className="font-bold">Error loading marketplace data</p>
              <p className="text-xs text-rose-700">{error}</p>
            </div>
          </div>
        )}

        {reportData && (
          <>
            {/* Quick Context Strip */}
            <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-2xs">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Synced Snapshot
                </span>
                <span>
                  Reporting for <b>{selectedDate}</b> • 4 Marketplaces & Competitor Benchmarks Active
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('competitors')}
                  className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 transition"
                >
                  <Trophy className="w-3.5 h-3.5 text-amber-500" />
                  Compare Competitors
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Inventory Stockout Alerts (always prominent if stock is low) */}
            {reportData.consolidatedData.inventoryAlerts.length > 0 && (
              <InventoryAlertsBanner alerts={reportData.consolidatedData.inventoryAlerts} />
            )}

            {/* TAB 1: EXECUTIVE OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-fadeIn">
                {/* 6 Key Performance Metric Cards */}
                <KpiMetricsSection data={reportData.consolidatedData} />

                {/* AI Executive Highlights & Management Action Points */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-8">
                    <AiObservationsCard
                      ai={reportData.aiIntelligence}
                      onOpenReportModal={() => setShowReportModal(true)}
                    />
                  </div>

                  {/* Quick Shortcut Card to Competitor & Channel Analysis */}
                  <div className="lg:col-span-4 flex flex-col gap-4">
                    {/* Competitor Teaser Card */}
                    <div
                      onClick={() => setActiveTab('competitors')}
                      className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl p-5 shadow-xs cursor-pointer hover:shadow-md transition group border border-indigo-800/40 relative overflow-hidden"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <span className="px-2 py-0.5 rounded-full bg-yellow-400/20 text-yellow-300 text-[10px] font-bold uppercase tracking-wider border border-yellow-400/30 flex items-center gap-1">
                          <Trophy className="w-3 h-3 text-yellow-300" />
                          Market Leader
                        </span>
                        <ArrowRight className="w-4 h-4 text-white/60 group-hover:translate-x-1 transition" />
                      </div>
                      <h3 className="text-base font-bold">Sleepsia vs Competitors</h3>
                      <p className="text-xs text-indigo-200 mt-1 leading-relaxed">
                        Sleepsia leads cervical memory foam with <b>{marketShare}%</b> daily share vs Wakefit (24.2%) and The Sleep Company (17.2%).
                      </p>
                      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                        <span className="text-indigo-300 font-medium">View Detailed Graphs</span>
                        <span className="font-extrabold text-amber-300">4.5★ Rating</span>
                      </div>
                    </div>

                    {/* Channel Breakdown Teaser */}
                    <div
                      onClick={() => setActiveTab('channels')}
                      className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs cursor-pointer hover:border-blue-300 hover:shadow-md transition group"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                          <Store className="w-4 h-4" />
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-800">4 Marketplace Channels</h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Amazon & Flipkart marketplaces + Blinkit & Instamart quick-commerce.
                      </p>
                      <div className="mt-3 pt-2 border-t border-slate-100 flex justify-between text-xs text-slate-600 font-semibold">
                        <span>Top Channel: Amazon (₹16.7L)</span>
                        <span className="text-blue-600">3.4x ROAS</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Platform Summary Table */}
                <PlatformComparisonTable
                  platforms={reportData.consolidatedData.platformPerformance}
                />

                {/* Top Products Quick View */}
                <ProductPerformanceMatrix
                  products={reportData.consolidatedData.productPerformance}
                  totalRevenue={reportData.consolidatedData.kpis.totalRevenue}
                />
              </div>
            )}

            {/* TAB 2: SLEEPSIA VS COMPETITORS */}
            {activeTab === 'competitors' && (
              <CompetitorComparisonSection
                data={reportData.competitorComparison}
                reportDate={reportData.consolidatedData.reportDate}
              />
            )}

            {/* TAB 3: MARKETPLACE CHANNELS */}
            {activeTab === 'channels' && (
              <div className="space-y-6 animate-fadeIn">
                <PlatformComparisonTable
                  platforms={reportData.consolidatedData.platformPerformance}
                />
              </div>
            )}

            {/* TAB 4: PRODUCTS & STOCK */}
            {activeTab === 'products' && (
              <div className="space-y-6 animate-fadeIn">
                <ProductPerformanceMatrix
                  products={reportData.consolidatedData.productPerformance}
                  totalRevenue={reportData.consolidatedData.kpis.totalRevenue}
                />
              </div>
            )}

            {/* TAB 5: CUSTOMER SENTIMENT & REVIEWS */}
            {activeTab === 'sentiment' && (
              <div className="space-y-6 animate-fadeIn">
                <ProductHealthSection
                  productHealth={reportData.consolidatedData.productHealth}
                />
              </div>
            )}
          </>
        )}
      </main>

      {/* Modern Clean Footer */}
      <footer className="px-6 py-4 bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-3">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-700">Sleepsia E-Commerce Intelligence</span>
            <span>•</span>
            <span>Simulated Marketplace & Competitor Data</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowArchitectureModal(true)}
              className="text-blue-600 hover:underline font-semibold"
            >
              API Architecture Spec
            </button>
            <button
              onClick={() => setShowAgentLogsModal(true)}
              className="text-indigo-600 hover:underline font-semibold"
            >
              Agent Execution Logs
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {showReportModal && reportData && (
        <ManagementReportModal
          report={reportData}
          onClose={() => setShowReportModal(false)}
          onDownloadDocx={handleDownloadDocx}
        />
      )}

      {showArchitectureModal && (
        <ArchitectureModal
          onClose={() => setShowArchitectureModal(false)}
          syntheticFiles={syntheticMeta.files}
          productMaster={syntheticMeta.productMaster}
          platformMappings={syntheticMeta.platformMappings}
        />
      )}

      {showAgentLogsModal && reportData && (
        <AgentWorkflowModal
          logs={reportData.consolidatedData.workflowLogs}
          specialistOutputs={reportData.consolidatedData.specialistOutputs}
          isRunning={isRunning}
          onInspectPayload={(title, payload) => setPayloadModal({ title, payload })}
          reportDate={reportData.consolidatedData.reportDate}
          onClose={() => setShowAgentLogsModal(false)}
        />
      )}

      {payloadModal && (
        <AgentPayloadModal
          title={payloadModal.title}
          payload={payloadModal.payload}
          onClose={() => setPayloadModal(null)}
        />
      )}
    </div>
  );
}
export default App;
