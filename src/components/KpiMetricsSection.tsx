import React from 'react';
import { ConsolidatedReportData } from '../types/reporting.ts';
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  RotateCcw,
  Boxes,
  Flame,
  AlertTriangle,
} from 'lucide-react';

interface KpiMetricsSectionProps {
  data: ConsolidatedReportData;
}

export const KpiMetricsSection: React.FC<KpiMetricsSectionProps> = ({ data }) => {
  const kpis = data.kpis;
  const organicPercent =
    kpis.totalRevenue > 0
      ? ((kpis.totalOrganicRevenue / kpis.totalRevenue) * 100).toFixed(1)
      : '0';
  const paidPercent =
    kpis.totalRevenue > 0
      ? ((kpis.totalAdAttributedRevenue / kpis.totalRevenue) * 100).toFixed(1)
      : '0';

  const stockoutCount = data.inventoryAlerts.filter((a) => a.status === 'Out of Stock').length;
  const lowStockCount = data.inventoryAlerts.filter((a) => a.status === 'Low Stock').length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-4">
      {/* 1. Total Sales (Units) */}
      <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-xs text-center flex flex-col justify-between">
        <div>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Sales</p>
          <p className="text-xl font-bold text-slate-900 mt-0.5">{kpis.totalSales.toLocaleString()}</p>
        </div>
        <p className="text-[10px] text-emerald-600 font-medium mt-1">↑ 8.4% vs LW</p>
      </div>

      {/* 2. Total Revenue */}
      <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-xs text-center flex flex-col justify-between">
        <div>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Revenue</p>
          <p className="text-xl font-bold text-slate-900 mt-0.5">₹{(kpis.totalRevenue / 1000).toFixed(1)}k</p>
        </div>
        <p className="text-[10px] text-emerald-600 font-medium mt-1">
          {organicPercent}% Org • {paidPercent}% Ad
        </p>
      </div>

      {/* 3. Ad Spend */}
      <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-xs text-center flex flex-col justify-between">
        <div>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Ad Spend</p>
          <p className="text-xl font-bold text-slate-900 mt-0.5">₹{(kpis.totalAdSpend / 1000).toFixed(1)}k</p>
        </div>
        <p className="text-[10px] text-slate-400 font-medium mt-1">Attributed: ₹{(kpis.totalAdAttributedRevenue / 1000).toFixed(1)}k</p>
      </div>

      {/* 4. Overall ROAS */}
      <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-xs text-center flex flex-col justify-between">
        <div>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Overall ROAS</p>
          <p className="text-xl font-bold text-slate-900 mt-0.5">{kpis.overallRoas}x</p>
        </div>
        <p className="text-[10px] text-emerald-600 font-medium mt-1">ACOS: {kpis.overallAcos}%</p>
      </div>

      {/* 5. Total Returns */}
      <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-xs text-center flex flex-col justify-between">
        <div>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Returns</p>
          <p className="text-xl font-bold text-slate-900 mt-0.5">{kpis.returnRate}%</p>
        </div>
        <p className="text-[10px] text-slate-500 font-medium mt-1">{kpis.totalReturns} units logged</p>
      </div>

      {/* 6. Availability */}
      <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-xs text-center flex flex-col justify-between">
        <div>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Availability</p>
          <p className="text-xl font-bold text-slate-900 mt-0.5">
            {stockoutCount > 0 ? (
              <span className="text-rose-600 font-bold">{stockoutCount} Out</span>
            ) : (
              <span className="text-emerald-700 font-bold">100%</span>
            )}
          </p>
        </div>
        <p className={`text-[10px] font-medium mt-1 ${stockoutCount > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
          {stockoutCount > 0 ? `${lowStockCount} Low Stock` : 'All Optimal'}
        </p>
      </div>
    </div>
  );
};
