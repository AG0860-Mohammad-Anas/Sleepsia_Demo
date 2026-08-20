import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { CompetitorTrendPoint, CompetitorMetric } from '../types/reporting';
import { TrendingUp, Award, DollarSign, Star } from 'lucide-react';

interface CompetitorSectionProps {
  trends: CompetitorTrendPoint[];
  competitors: CompetitorMetric[];
}

export const CompetitorComparisonSection: React.FC<CompetitorSectionProps> = ({ trends, competitors }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Award className="w-6 h-6 text-blue-600" />
            Market Share & Competitive Velocity
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Real-time multi-channel volume comparison against direct Indian memory foam pillow competitors.
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs uppercase font-semibold text-slate-400">Sleepsia Dominance</span>
          <p className="text-2xl font-black text-blue-600">38.8%</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-base font-semibold text-slate-800 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-slate-600" />
            7-Day Unit Sales Velocity by Brand
          </h3>
          <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-medium">
            Daily Verified Units
          </span>
        </div>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trends} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderRadius: '8px',
                  color: '#fff',
                  border: 'none',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '13px', paddingTop: '12px' }} />
              <Line type="monotone" dataKey="Sleepsia" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="Wakefit" stroke="#f97316" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="SleepyCat" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="WhiteWillow" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {competitors.map((brand) => (
          <div
            key={brand.name}
            className={`p-5 rounded-xl border transition-all ${
              brand.name === 'Sleepsia'
                ? 'bg-blue-50/60 border-blue-200 ring-2 ring-blue-500/20'
                : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <span className="font-bold text-slate-800 text-base">{brand.name}</span>
              <span
                className="text-xs font-bold px-2.5 py-1 rounded-full text-white"
                style={{ backgroundColor: brand.color }}
              >
                {brand.marketShare}% Share
              </span>
            </div>
            <div className="space-y-2 mt-4 text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-slate-500">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Avg Rating:
                </span>
                <span className="font-semibold text-slate-700">{brand.rating} / 5.0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-slate-500">
                  <DollarSign className="w-3.5 h-3.5 text-slate-400" /> Price Range:
                </span>
                <span className="font-semibold text-slate-700">{brand.pricePoint}</span>
              </div>
              <div className="pt-2 border-t border-slate-100">
                <span className="text-slate-400 block mb-0.5">Top Selling Item:</span>
                <span className="font-medium text-slate-800 block truncate">{brand.topSeller}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};