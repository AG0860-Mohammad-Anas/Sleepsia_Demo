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
  ShieldCheck,
} from 'lucide-react';

interface HeaderProps {
  selectedDate: string;
  availableDates: string[];
  onDateChange: (date: string) => void;
  onRunReport: () => void;
  isRunning: boolean;
  onOpenReportModal: () => void;
  onOpenArchitectureModal: () => void;
  onDownloadDocx: () => void;
  onExportCsv: () => void;
  isReportAvailable: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  selectedDate,
  availableDates,
  onDateChange,
  onRunReport,
  isRunning,
  onOpenReportModal,
  onOpenArchitectureModal,
  onDownloadDocx,
  onExportCsv,
  isReportAvailable,
}) => {
  const [exportMenuOpen, setExportMenuOpen] = React.useState(false);

  return (
    <header className="flex items-center justify-between px-6 py-2.5 bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Brand & Identity */}
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 bg-blue-600 rounded flex items-center justify-center shadow-xs">
          <span className="text-white font-bold text-xs tracking-wider">SL</span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold tracking-tight text-slate-800">
              Sleepsia <span className="text-slate-400 font-normal">Intelligence</span>
            </h1>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-bold border border-blue-200">
              PROTOTYPE
            </span>
          </div>
          <p className="text-[9px] uppercase tracking-widest text-slate-500 font-semibold">
            Enterprise Reporting System
          </p>
        </div>
      </div>

      {/* Controls & Actions */}
      <div className="flex items-center gap-3">
        {/* Data Snapshot Date Picker */}
        <div className="flex items-center bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-xs">
          <div className="flex flex-col items-start mr-2">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-none">
              Snapshot Date
            </span>
          </div>
          <select
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            disabled={isRunning}
            className="bg-transparent text-slate-800 font-semibold focus:outline-none cursor-pointer text-xs"
            id="date-select-dropdown"
          >
            {availableDates.map((date) => (
              <option key={date} value={date} className="bg-white text-slate-800">
                {date} {date === '2026-08-19' ? '(Demo Target)' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Architecture Spec Button */}
        <button
          onClick={onOpenArchitectureModal}
          className="flex items-center gap-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded text-xs font-semibold shadow-xs transition"
          title="View Multi-Agent Architecture & API Migration Spec"
          id="architecture-btn"
        >
          <Layers className="w-3.5 h-3.5 text-blue-600" />
          <span className="hidden sm:inline">System Spec</span>
        </button>

        {/* Export Dropdown */}
        {isReportAvailable && (
          <div className="relative">
            <button
              onClick={() => setExportMenuOpen(!exportMenuOpen)}
              className="flex items-center gap-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded text-xs font-semibold shadow-xs transition"
              id="export-dropdown-btn"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Export</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {exportMenuOpen && (
              <div className="absolute right-0 mt-1.5 w-52 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50 text-xs">
                <button
                  onClick={() => {
                    setExportMenuOpen(false);
                    onDownloadDocx();
                  }}
                  className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                  id="export-docx-btn"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  <div>
                    <div className="font-semibold">Download Word (.docx)</div>
                    <div className="text-[9px] text-slate-400">Formal Executive Brief</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setExportMenuOpen(false);
                    onOpenReportModal();
                  }}
                  className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                  id="view-report-btn"
                >
                  <Activity className="w-3.5 h-3.5 text-emerald-600" />
                  <div>
                    <div className="font-semibold">Preview 14-Section Report</div>
                    <div className="text-[9px] text-slate-400">Executive Viewer</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setExportMenuOpen(false);
                    onExportCsv();
                  }}
                  className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center space-x-2 border-t border-slate-100"
                  id="export-csv-btn"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-amber-600" />
                  <div>
                    <div className="font-semibold">Export Raw CSV</div>
                    <div className="text-[9px] text-slate-400">Tabular Performance Data</div>
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
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded text-xs font-semibold shadow-xs transition ${
            isRunning
              ? 'bg-blue-700 text-white cursor-wait opacity-80'
              : 'bg-blue-600 hover:bg-blue-700 text-white active:scale-95'
          }`}
          id="run-daily-report-btn"
        >
          {isRunning ? (
            <>
              <RefreshCw className="w-3 h-3 animate-spin" />
              <span>Orchestrating...</span>
            </>
          ) : (
            <>
              <Play className="w-3 h-3 fill-current" />
              <span>Run Daily Report</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
