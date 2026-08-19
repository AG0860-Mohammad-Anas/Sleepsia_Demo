import React from 'react';
import { PlatformSummary } from '../types/reporting.ts';
import { ShoppingBag, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';

interface PlatformComparisonTableProps {
  platforms: PlatformSummary[];
}

export const PlatformComparisonTable: React.FC<PlatformComparisonTableProps> = ({
  platforms,
}) => {
  const getPlatformRole = (name: string) => {
    switch (name) {
      case 'Amazon':
        return { label: 'Primary', color: 'text-blue-600', barBg: 'bg-blue-600' };
      case 'Flipkart':
        return { label: 'Secondary', color: 'text-indigo-600', barBg: 'bg-blue-400' };
      case 'Blinkit':
        return { label: 'Quick Comm', color: 'text-teal-600', barBg: 'bg-teal-500' };
      case 'Instamart':
        return { label: 'Quick Comm', color: 'text-amber-600', barBg: 'bg-amber-500' };
      default:
        return { label: 'Channel', color: 'text-slate-500', barBg: 'bg-slate-400' };
    }
  };

  return (
    <div className="space-y-3 mb-4">
      {/* 4 Platform High Density Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {platforms.map((p) => {
          const role = getPlatformRole(p.platform);
          return (
            <div
              key={p.platform}
              className="bg-white border border-slate-200 rounded-lg p-3 flex flex-col gap-2 shadow-xs"
            >
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold text-slate-800">{p.platform}</span>
                <span className={`text-[10px] ${role.color} font-bold uppercase`}>
                  {role.label}
                </span>
              </div>
              <div className="flex justify-between items-end">
                <p className="text-lg font-bold text-slate-900">₹{p.revenue.toLocaleString()}</p>
                <p className="text-[10px] text-slate-400">{p.revenueShare}% Share</p>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`${role.barBg} h-1.5 rounded-full transition-all`}
                  style={{ width: `${Math.min(100, p.revenueShare * 1.8)}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[9px] text-slate-400 pt-1 border-t border-slate-100">
                <span>ROAS: <b className="text-slate-700">{p.roas}x</b></span>
                <span>Returns: <b className="text-slate-700">{p.returnRate}%</b></span>
                <span>Units: <b className="text-slate-700">{p.unitsSold}</b></span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Platform Benchmarking Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
        <div className="px-3.5 py-2 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">
            Marketplace Channels Detailed Breakdown
          </h3>
          <span className="text-[9px] text-slate-400 font-medium">4 Active Platforms</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[9px] tracking-wider font-bold">
                <th className="py-2 px-3">Platform</th>
                <th className="py-2 px-3 text-right">Units</th>
                <th className="py-2 px-3 text-right">Revenue (INR)</th>
                <th className="py-2 px-3 text-right">Ad Spend</th>
                <th className="py-2 px-3 text-right">ROAS</th>
                <th className="py-2 px-3 text-right">ACOS</th>
                <th className="py-2 px-3 text-right">Avg Price</th>
                <th className="py-2 px-3 text-right">Returns</th>
                <th className="py-2 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[11px] font-medium text-slate-800">
              {platforms.map((p) => (
                <tr key={p.platform} className="hover:bg-slate-50/80 transition">
                  <td className="py-2 px-3 font-semibold text-slate-900 flex items-center gap-1.5">
                    <span>{p.platform}</span>
                    <span className="text-[9px] px-1 py-0.2 rounded bg-slate-100 text-slate-500 font-mono">
                      {p.revenueShare}%
                    </span>
                  </td>
                  <td className="py-2 px-3 text-right">{p.unitsSold.toLocaleString()}</td>
                  <td className="py-2 px-3 text-right font-bold text-slate-900">
                    ₹{p.revenue.toLocaleString()}
                  </td>
                  <td className="py-2 px-3 text-right text-slate-600">
                    ₹{p.adSpend.toLocaleString()}
                  </td>
                  <td className="py-2 px-3 text-right">
                    <span className="text-blue-600 font-bold">{p.roas}x</span>
                  </td>
                  <td className="py-2 px-3 text-right text-slate-500">{p.acos}%</td>
                  <td className="py-2 px-3 text-right text-slate-600">₹{p.averageSellingPrice.toFixed(0)}</td>
                  <td className="py-2 px-3 text-right">
                    <span>{p.returns}</span>
                    <span className="text-slate-400 text-[10px] ml-1">({p.returnRate}%)</span>
                  </td>
                  <td className="py-2 px-3 text-center">
                    {p.stockoutSkuCount > 0 ? (
                      <span className="px-2 py-0.5 bg-rose-100 text-rose-700 rounded text-[9px] font-bold uppercase">
                        {p.stockoutSkuCount} Stockout
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[9px] font-bold uppercase">
                        Optimal
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
