import React, { useEffect, useState } from 'react';
import { Header } from './components/Header.tsx';
import { AgentWorkflowVisualizer } from './components/AgentWorkflowVisualizer.tsx';
import { AiObservationsCard } from './components/AiObservationsCard.tsx';
import { KpiMetricsSection } from './components/KpiMetricsSection.tsx';
import { PlatformComparisonTable } from './components/PlatformComparisonTable.tsx';
import { ProductPerformanceMatrix } from './components/ProductPerformanceMatrix.tsx';
import { ProductHealthSection } from './components/ProductHealthSection.tsx';
import { InventoryAlertsBanner } from './components/InventoryAlertsBanner.tsx';
import { ManagementReportModal } from './components/ManagementReportModal.tsx';
import { ArchitectureModal } from './components/ArchitectureModal.tsx';
import { AgentPayloadModal } from './components/AgentPayloadModal.tsx';
import { FullDailyReportResponse } from './types/reporting.ts';
import {
  AlertCircle,
  Layers,
} from 'lucide-react';

export function App() {
  const [selectedDate, setSelectedDate] = useState<string>('2026-08-19');
  const [availableDates, setAvailableDates] = useState<string[]>(['2026-08-19']);
  const [reportData, setReportData] = useState<FullDailyReportResponse | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Modals
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [showArchitectureModal, setShowArchitectureModal] = useState<boolean>(false);
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

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans antialiased select-none">
      {/* Header */}
      <Header
        selectedDate={selectedDate}
        availableDates={availableDates}
        onDateChange={(newDate) => {
          setSelectedDate(newDate);
          runDailyReport(newDate);
        }}
        onRunReport={() => runDailyReport(selectedDate)}
        isRunning={isRunning}
        onOpenReportModal={() => setShowReportModal(true)}
        onOpenArchitectureModal={() => setShowArchitectureModal(true)}
        onDownloadDocx={handleDownloadDocx}
        onExportCsv={handleExportCsv}
        isReportAvailable={Boolean(reportData)}
      />

      {/* Main 12-Column High-Density Grid */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 p-4">
        {error && (
          <div className="col-span-12 bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-lg flex items-center space-x-2 text-xs">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Error executing workflow: {error}</span>
          </div>
        )}

        {reportData && (
          <>
            {/* Left Column (Workflow Status & AI Observations) */}
            <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
              {/* Agent Workflow Status */}
              <AgentWorkflowVisualizer
                logs={reportData.consolidatedData.workflowLogs}
                specialistOutputs={reportData.consolidatedData.specialistOutputs}
                isRunning={isRunning}
                onInspectPayload={(title, payload) => setPayloadModal({ title, payload })}
                reportDate={reportData.consolidatedData.reportDate}
              />

              {/* AI Observations Dark Card */}
              <AiObservationsCard
                ai={reportData.aiIntelligence}
                onOpenReportModal={() => setShowReportModal(true)}
              />
            </div>

            {/* Right Column (KPI Cards, Platform Cards, Performance Table, Scorecard) */}
            <div className="col-span-12 lg:col-span-9 flex flex-col gap-3">
              {/* Top Banner Notice */}
              <div className="bg-white border border-slate-200 rounded-lg p-2.5 flex items-center justify-between text-xs text-slate-700 shadow-2xs">
                <div className="flex items-center space-x-2">
                  <span className="px-1.5 py-0.2 bg-blue-600 text-white rounded text-[9px] font-bold">
                    DEMO
                  </span>
                  <span className="text-[11px] text-slate-600">
                    Synthetic marketplace intelligence active. Math is deterministic; Gemini AI generates qualitative commentary.
                  </span>
                </div>
                <button
                  onClick={() => setShowArchitectureModal(true)}
                  className="text-blue-600 hover:text-blue-800 text-[11px] font-semibold flex items-center gap-1 shrink-0 ml-2"
                >
                  <Layers className="w-3 h-3" />
                  API Migration Spec
                </button>
              </div>

              {/* Inventory Stockout Alerts (if any) */}
              <InventoryAlertsBanner alerts={reportData.consolidatedData.inventoryAlerts} />

              {/* 6 KPI Cards Grid */}
              <KpiMetricsSection data={reportData.consolidatedData} />

              {/* 4 Platform Summary Cards & Benchmark Table */}
              <PlatformComparisonTable
                platforms={reportData.consolidatedData.platformPerformance}
              />

              {/* Cross-Platform Product Performance Matrix */}
              <ProductPerformanceMatrix
                products={reportData.consolidatedData.productPerformance}
                totalRevenue={reportData.consolidatedData.kpis.totalRevenue}
              />

              {/* Product Health & Sentiment Scorecard */}
              <ProductHealthSection
                productHealth={reportData.consolidatedData.productHealth}
              />
            </div>
          </>
        )}
      </main>

      {/* Enterprise High Density Footer */}
      <footer className="px-6 py-2.5 bg-white border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-400 gap-2">
        <div className="flex items-center gap-4">
          <span>System ID: SLEEPSIA-AI-X1</span>
          <span>● Agent Status: {isRunning ? 'Orchestrating Workflow...' : 'Synchronized'}</span>
          <span>● Snapshot: {selectedDate}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="italic">
            This prototype uses synthetic marketplace data for demonstration purposes.
          </span>
          <div className="flex gap-1 items-center">
            <div className="w-2 h-2 rounded-full bg-blue-600"></div>
            <div className="w-2 h-2 rounded-full bg-blue-400"></div>
            <div className="w-2 h-2 rounded-full bg-slate-300"></div>
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
