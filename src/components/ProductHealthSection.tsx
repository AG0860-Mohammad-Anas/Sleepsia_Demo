import React from 'react';
import { ProductHealthMetrics } from '../types/reporting.ts';
import { HeartPulse, Star, AlertTriangle, ShieldCheck } from 'lucide-react';

interface ProductHealthSectionProps {
  productHealth: ProductHealthMetrics[];
}

export const ProductHealthSection: React.FC<ProductHealthSectionProps> = ({
  productHealth,
}) => {
  const getGradeBadge = (grade: ProductHealthMetrics['healthGrade']) => {
    switch (grade) {
      case 'A+':
      case 'A':
        return 'bg-emerald-500 text-white';
      case 'B':
        return 'bg-blue-600 text-white';
      case 'C':
        return 'bg-amber-500 text-white';
      default:
        return 'bg-rose-500 text-white';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-3.5 mb-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2.5">
        <div>
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <span>Product Health & Customer Sentiment Scorecard</span>
            <span className="text-[9px] font-normal text-slate-400 font-mono">
              (Deterministic 0-100 Score)
            </span>
          </h2>
        </div>
        <span className="text-[9px] text-emerald-700 font-semibold flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-600" />
          Code Algorithm
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {productHealth.map((item) => (
          <div
            key={item.sku}
            className="border border-slate-200 rounded p-2.5 bg-slate-50/60 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-1.5">
                <div className="min-w-0 flex-1 mr-2">
                  <h3 className="font-bold text-slate-900 text-[11px] truncate">{item.productName}</h3>
                  <div className="text-[9px] text-slate-400 font-mono">{item.sku}</div>
                </div>
                <div className="flex items-center space-x-1 shrink-0">
                  <div
                    className={`w-5 h-5 rounded font-bold text-[10px] flex items-center justify-center ${getGradeBadge(
                      item.healthGrade
                    )}`}
                  >
                    {item.healthGrade}
                  </div>
                  <span className="text-[11px] font-black text-slate-800 font-mono">
                    {item.healthScore}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-1 py-1.5 border-y border-slate-200/60 text-[10px] my-1">
                <div>
                  <span className="text-slate-400 text-[9px] block">Rating</span>
                  <span className="font-bold text-slate-800 flex items-center gap-0.5">
                    <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                    {item.averageRating}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[9px] block">Reviews</span>
                  <span className="font-semibold text-slate-700">
                    {item.totalReviews.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[9px] block">Returns</span>
                  <span
                    className={`font-bold ${
                      item.returnRate > 4.0
                        ? 'text-rose-600'
                        : item.returnRate > 2.5
                        ? 'text-amber-600'
                        : 'text-emerald-700'
                    }`}
                  >
                    {item.returnRate}%
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-1">
              {item.riskFlags.length > 0 ? (
                <div className="text-[9px] text-amber-900 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5 flex items-center truncate">
                  <AlertTriangle className="w-2.5 h-2.5 mr-1 text-amber-600 shrink-0" />
                  <span className="truncate">{item.riskFlags[0]}</span>
                </div>
              ) : (
                <div className="text-[9px] text-emerald-700 bg-emerald-50 rounded px-1.5 py-0.5 flex items-center">
                  <ShieldCheck className="w-2.5 h-2.5 mr-1 text-emerald-600 shrink-0" />
                  Optimal health
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
