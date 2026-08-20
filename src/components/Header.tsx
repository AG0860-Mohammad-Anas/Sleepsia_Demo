import React from 'react';
import {
  Activity,
  Calendar,
  ChevronDown,
  Download,
  FileSpreadsheet,
  FileText,
  Layers,
  Play,
  RefreshCw,
  Trophy,
  BarChart2,
  Store,
  Package,
  HeartHandshake,
  Bot,
} from 'lucide-react';

export type MainTabType = 'overview' | 'competitors' | 'channels' | 'products' | 'sentiment';

interface HeaderProps {
  selectedDate: string;
  availableDates: string[];
  onDateChange: (date: string) => void;
  onRunReport: () => void;
  isRunning: boolean;
  activeTab: MainTabType;
  onTabChange: (tab: MainTabType) => void;
  onOpenReportModal: () => void;
  onOpenArchitectureModal: () => void;
  onOpenAgentLogsModal: () => void;
  onDownloadDocx: () => void;
  onExportCsv: () => void;
  isReportAvailable: boolean;
  marketShare: number;
}

export const Header: React.FC<HeaderProps> = ({
  selectedDate,
  availableDates,
  onDateChange,
  onRunReport,
  isRunning,
  activeTab,
  onTabChange,
  onOpenReportModal,
  onOpenArchitectureModal,
  onOpenAgentLogsModal,
  onDownloadDocx,
  onExportCsv,
  isReportAvailable,
  marketShare,
}) => {
  const [exportMenuOpen, setExportMenuOpen] = React.useState(false);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Top Navbar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-slate-100">
        {/* Brand & Identity */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-xs">
            <span className="text-white font-extrabold text-sm tracking-wider">SL</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900">
                Sleepsia <span className="text-blue-600 font-semibold">Intelligence</span>
              </h1>
              <span className="hidden sm:inline-flex text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200">
                Live Analytics
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium hidden sm:block">
              Daily Executive Dashboard & Marketplace Benchmarks
            </p>
          </div>
        </div>

        {/* Controls & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Data Snapshot Date Picker */}
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400 mr-1.5 hidden sm:inline" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1.5 hidden md:inline">
              Date:
            </span>
            <select
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              disabled={isRunning}
              className="bg-transparent text-slate-800 font-bold focus:outline-none cursor-pointer text-xs"
              id="date-select-dropdown"
            >
              {availableDates.map((date) => (
                <option key={date} value={date} className="bg-white text-slate-800">
                  {date} {date === '2026-08-19' ? '(Today)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Technical Workflow & Logs Button (Discreet for non-technical users) */}
          <button
            onClick={onOpenAgentLogsModal}
            className="flex items-center gap-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 px-2.5 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition"
            title="View Multi-Agent Processing Workflow"
            id="agent-logs-btn"
          >
            <Bot className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden lg:inline">Agent Workflow</span>
          </button>

          {/* Export Dropdown */}
          {isReportAvailable && (
            <div className="relative">
              <button
                onClick={() => setExportMenuOpen(!exportMenuOpen)}
                className="flex items-center gap-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition"
                id="export-dropdown-btn"
              >
                <Download className="w-3.5 h-3.5 text-slate-600" />
                <span className="hidden sm:inline">Export</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {exportMenuOpen && (
                <div className="absolute right-0 mt-1.5 w-56 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-50 text-xs animate-fadeIn">
                  <button
                    onClick={() => {
                      setExportMenuOpen(false);
                      onDownloadDocx();
                    }}
                    className="w-full text-left px-3.5 py-2 text-slate-700 hover:bg-slate-50 flex items-center space-x-2.5"
                    id="export-docx-btn"
                  >
                    <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                    <div>
                      <div className="font-semibold text-slate-800">Download Word (.docx)</div>
                      <div className="text-[10px] text-slate-400">Formal Management Briefing</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setExportMenuOpen(false);
                      onOpenReportModal();
                    }}
                    className="w-full text-left px-3.5 py-2 text-slate-700 hover:bg-slate-50 flex items-center space-x-2.5"
                    id="view-report-btn"
                  >
                    <Activity className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <div className="font-semibold text-slate-800">Preview 14-Section Brief</div>
                      <div className="text-[10px] text-slate-400">Full Executive View</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setExportMenuOpen(false);
                      onExportCsv();
                    }}
                    className="w-full text-left px-3.5 py-2 text-slate-700 hover:bg-slate-50 flex items-center space-x-2.5 border-t border-slate-100"
                    id="export-csv-btn"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-amber-600 shrink-0" />
                    <div>
                      <div className="font-semibold text-slate-800">Export Raw CSV</div>
                      <div className="text-[10px] text-slate-400">Consolidated Product Data</div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Run Daily Report Button */}
          <button
            onClick={onRunReport}
            disabled={isRunning}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-xs transition ${
              isRunning
                ? 'bg-blue-700 text-white cursor-wait opacity-80'
                : 'bg-blue-600 hover:bg-blue-700 text-white active:scale-95'
            }`}
            id="run-daily-report-btn"
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Refreshing...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Refresh Data</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex items-center px-4 sm:px-6 bg-white overflow-x-auto no-scrollbar border-t border-slate-100">
        <div className="flex space-x-1 sm:space-x-2 py-1.5">
          <button
            onClick={() => onTabChange('overview')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-blue-50 text-blue-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            <span>Executive Overview</span>
          </button>

          <button
            onClick={() => onTabChange('competitors')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'competitors'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Trophy className={`w-4 h-4 ${activeTab === 'competitors' ? 'text-yellow-300' : 'text-amber-500'}`} />
            <span>Sleepsia vs Competitors</span>
            <span
              className={`text-[9px] px-1.5 py-0.2 rounded-full font-black ${
                activeTab === 'competitors' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
              }`}
            >
              {marketShare}% Share
            </span>
          </button>

          <button
            onClick={() => onTabChange('channels')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'channels'
                ? 'bg-blue-50 text-blue-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Marketplace Channels</span>
          </button>

          <button
            onClick={() => onTabChange('products')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'products'
                ? 'bg-blue-50 text-blue-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Products & Stock</span>
          </button>

          <button
            onClick={() => onTabChange('sentiment')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'sentiment'
                ? 'bg-blue-50 text-blue-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            <span>Customer Health & Reviews</span>
          </button>
        </div>
      </div>
    </header>
  );
};
