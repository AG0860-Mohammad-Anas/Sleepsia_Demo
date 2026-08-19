import React from 'react';
import { InventoryAlert } from '../types/reporting.ts';
import { AlertOctagon, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface InventoryAlertsBannerProps {
  alerts: InventoryAlert[];
}

export const InventoryAlertsBanner: React.FC<InventoryAlertsBannerProps> = ({ alerts }) => {
  if (alerts.length === 0) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 mb-4 flex items-center justify-between text-xs text-emerald-800">
        <div className="flex items-center space-x-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="font-semibold text-[11px]">All Inventory Clear:</span>
          <span className="text-[11px]">All 6 SKUs meet minimum reorder thresholds across 4 marketplaces.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-rose-200 rounded-lg shadow-xs p-3 mb-4">
      <div className="flex items-center justify-between pb-1.5 border-b border-rose-100 mb-2">
        <div className="flex items-center space-x-1.5">
          <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
          <h3 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">
            Inventory & Fulfillment Risks
          </h3>
          <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 font-bold">
            {alerts.length} Action Items
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {alerts.map((alert, idx) => {
          const isStockout = alert.status === 'Out of Stock';
          return (
            <div
              key={idx}
              className={`p-2 rounded border text-xs flex flex-col justify-between ${
                isStockout
                  ? 'bg-rose-50/70 border-rose-200 text-rose-900'
                  : 'bg-amber-50/70 border-amber-200 text-amber-900'
              }`}
            >
              <div>
                <div className="flex items-center justify-between font-bold text-[11px] mb-0.5">
                  <span className="truncate">{alert.productName}</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase shrink-0 ml-1 ${
                      isStockout ? 'bg-rose-600 text-white' : 'bg-amber-600 text-white'
                    }`}
                  >
                    {alert.platform} • {alert.status}
                  </span>
                </div>
                <p className="text-[10px] opacity-90">{alert.reason}</p>
              </div>

              <div className="mt-1 pt-1 border-t border-slate-200/60 flex items-center justify-between text-[9px] opacity-80">
                <span>Stock: <b>{alert.inventoryLevel} units</b> (Reorder: {alert.reorderThreshold})</span>
                <span>Days Cover: <b>{alert.daysCover !== null ? `${alert.daysCover}d` : '0d'}</b></span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
