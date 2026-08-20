import React, { useState } from 'react';
import {
  CompetitorBenchmarkDaily,
  CompetitorComparisonReport,
  CompetitorMasterProfile,
} from '../types/reporting.ts';
import {
  Trophy,
  TrendingUp,
  Star,
  DollarSign,
  ShieldCheck,
  Award,
  Zap,
  BarChart3,
  PieChart as PieIcon,
  LineChart as LineIcon,
  Layers,
  ArrowUpRight,
  Info,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface CompetitorComparisonSectionProps {
  data: CompetitorComparisonReport;
  reportDate: string;
}

export const CompetitorComparisonSection: React.FC<CompetitorComparisonSectionProps> = ({
  data,
  reportDate,
}) => {
  const [activeChartTab, setActiveChartTab] = useState<'market_share' | 'trend_14d' | 'price_rating' | 'bsr_ad'>(
    'market_share'
  );
  const [selectedBrand, setSelectedBrand] = useState<string>('Sleepsia');

  const benchmarks = data.benchmarks || [];
  const historical = data.historical14Days || [];
  const profiles = data.profiles || [];

  // Color mapping for brands
  const brandColors: Record<string, { bg: string; text: string; bar: string; border: string; lightBg: string }> = {
    Sleepsia: {
      bg: 'bg-blue-600',
      text: 'text-blue-700',
      bar: '#2563eb',
      border: 'border-blue-500',
      lightBg: 'bg-blue-50',
    },
    Wakefit: {
      bg: 'bg-purple-600',
      text: 'text-purple-700',
      bar: '#9333ea',
      border: 'border-purple-300',
      lightBg: 'bg-purple-50',
    },
    'The Sleep Company': {
      bg: 'bg-emerald-600',
      text: 'text-emerald-700',
      bar: '#059669',
      border: 'border-emerald-300',
      lightBg: 'bg-emerald-50',
    },
    Flo: {
      bg: 'bg-amber-600',
      text: 'text-amber-700',
      bar: '#d97706',
      border: 'border-amber-300',
      lightBg: 'bg-amber-50',
    },
    Duroflex: {
      bg: 'bg-rose-600',
      text: 'text-rose-700',
      bar: '#e11d48',
      border: 'border-rose-300',
      lightBg: 'bg-rose-50',
    },
  };

  const getBrandColor = (brand: string) => {
    return (
      brandColors[brand] || {
        bg: 'bg-slate-600',
        text: 'text-slate-700',
        bar: '#64748b',
        border: 'border-slate-300',
        lightBg: 'bg-slate-50',
      }
    );
  };

  // Find Sleepsia & Top Competitor stats
  const sleepsiaBench = benchmarks.find((b) => b.brand.toLowerCase().includes('sleepsia')) || benchmarks[0];
  const maxRevenue = Math.max(...benchmarks.map((b) => b.estDailyRevenue), 1);
  const maxUnits = Math.max(...benchmarks.map((b) => b.estDailyUnits), 1);

  // Group historical data by date for trend chart
  const uniqueDates: string[] = Array.from(new Set(historical.map((h: CompetitorBenchmarkDaily) => h.date))).sort() as string[];
  const brandsList = ['Sleepsia', 'Wakefit', 'The Sleep Company', 'Flo', 'Duroflex'];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner & Highlights */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-400/20 text-blue-200 text-xs font-bold uppercase tracking-wider border border-blue-300/30 flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-yellow-300" />
                Market Intelligence
              </span>
              <span className="text-xs text-blue-200">Snapshot: {reportDate}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Sleepsia vs Category Competitors
            </h2>
            <p className="text-sm text-blue-100/90 mt-1 max-w-2xl">
              Competitive benchmarking across Amazon & Flipkart in Cervical & Memory Foam Pillows.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 text-center min-w-[110px]">
              <span className="text-[11px] text-blue-200 uppercase font-semibold block">Market Share</span>
              <span className="text-2xl font-black text-white">{data.sleepsiaMarketShare}%</span>
              <span className="text-[10px] text-emerald-300 font-medium block">#1 Daily Leader</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 text-center min-w-[110px]">
              <span className="text-[11px] text-blue-200 uppercase font-semibold block">Customer Rating</span>
              <span className="text-2xl font-black text-amber-300 flex items-center justify-center gap-1">
                {sleepsiaBench?.avgRating || 4.5} <Star className="w-4 h-4 fill-amber-300" />
              </span>
              <span className="text-[10px] text-blue-100 font-medium block">14,760 Reviews</span>
            </div>
          </div>
        </div>

        {/* 4 Key Executive Takeaways */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/15">
          {data.insights.map((insight, idx) => (
            <div key={idx} className="bg-white/5 rounded-lg p-2.5 border border-white/10 flex items-start gap-2 text-xs text-blue-50">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span className="leading-snug">{insight}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Chart Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        {/* Chart Header & Tab Switcher */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Comparative Market Visualizations
            </h3>
            <p className="text-xs text-slate-500">
              Select a graph perspective to understand market share, price positioning, and sales momentum.
            </p>
          </div>

          {/* Graph Tabs */}
          <div className="flex flex-wrap bg-slate-100 p-1 rounded-xl gap-1 text-xs font-semibold">
            <button
              onClick={() => setActiveChartTab('market_share')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeChartTab === 'market_share'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Market Share & Revenue
            </button>
            <button
              onClick={() => setActiveChartTab('trend_14d')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeChartTab === 'trend_14d'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              14-Day Share Trend
            </button>
            <button
              onClick={() => setActiveChartTab('price_rating')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeChartTab === 'price_rating'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Price vs Rating Matrix
            </button>
            <button
              onClick={() => setActiveChartTab('bsr_ad')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeChartTab === 'bsr_ad'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              BSR & Ad Spend Share
            </button>
          </div>
        </div>

        {/* Tab 1: Market Share & Daily Revenue */}
        {activeChartTab === 'market_share' && (
          <div className="py-4 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Left Column: Visual Bar Comparison */}
              <div className="lg:col-span-7 space-y-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Daily Revenue & Market Share Breakdown
                </h4>

                <div className="space-y-3">
                  {benchmarks.map((item) => {
                    const color = getBrandColor(item.brand);
                    const isSleepsia = item.brand.toLowerCase().includes('sleepsia');
                    const revenueInLakhs = (item.estDailyRevenue / 100000).toFixed(2);
                    const widthPercent = (item.estDailyRevenue / maxRevenue) * 100;

                    return (
                      <div
                        key={item.brand}
                        onClick={() => setSelectedBrand(item.brand)}
                        className={`p-3.5 rounded-xl border transition cursor-pointer ${
                          isSleepsia
                            ? 'border-blue-400 bg-blue-50/40 shadow-xs ring-2 ring-blue-500/10'
                            : selectedBrand === item.brand
                            ? 'border-slate-400 bg-slate-50'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1.5">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${color.bg}`} />
                            <span className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                              {item.brand}
                              {isSleepsia && (
                                <span className="px-1.5 py-0.2 bg-blue-600 text-white rounded text-[9px] font-extrabold uppercase">
                                  Our Brand
                                </span>
                              )}
                            </span>
                          </div>
                          <div className="text-right flex items-center gap-3">
                            <span className="text-xs font-bold text-slate-700">
                              ₹{revenueInLakhs} Lakhs
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-extrabold ${color.lightBg} ${color.text}`}
                            >
                              {item.marketSharePct}% Share
                            </span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex">
                          <div
                            className={`h-full rounded-full transition-all duration-500`}
                            style={{
                              width: `${widthPercent}%`,
                              backgroundColor: color.bar,
                            }}
                          />
                        </div>

                        <div className="flex justify-between items-center text-[11px] text-slate-500 mt-2 pt-1 border-t border-slate-100">
                          <span>
                            Daily Sales: <b>{item.estDailyUnits} units</b>
                          </span>
                          <span>
                            Avg Price: <b>₹{item.avgPrice}</b>
                          </span>
                          <span>
                            Rating: <b>{item.avgRating} ★</b> ({item.totalReviews.toLocaleString()})
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Donut Visual & Quick Comparison Box */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">
                    Category Market Share Share-of-Voice
                  </h4>

                  {/* Visual Donut representation */}
                  <div className="flex items-center justify-center p-2">
                    <div className="relative w-40 h-40 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        {(() => {
                          let accumulatedPercent = 0;
                          return benchmarks.map((b) => {
                            const color = getBrandColor(b.brand);
                            const percent = b.marketSharePct;
                            const strokeDasharray = `${percent} ${100 - percent}`;
                            const strokeDashoffset = -accumulatedPercent;
                            accumulatedPercent += percent;

                            return (
                              <circle
                                key={b.brand}
                                cx="18"
                                cy="18"
                                r="14"
                                fill="transparent"
                                stroke={color.bar}
                                strokeWidth="5.5"
                                strokeDasharray={strokeDasharray}
                                strokeDashoffset={strokeDashoffset}
                                className="transition-all duration-500 hover:opacity-80 cursor-pointer"
                              />
                            );
                          });
                        })()}
                      </svg>
                      <div className="absolute flex flex-col items-center justify-center text-center">
                        <span className="text-xs text-slate-400 font-semibold uppercase">Sleepsia</span>
                        <span className="text-xl font-black text-blue-700">{data.sleepsiaMarketShare}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Donut Legend */}
                  <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-200 text-xs">
                    {benchmarks.map((b) => {
                      const color = getBrandColor(b.brand);
                      return (
                        <div key={b.brand} className="flex items-center gap-1.5">
                          <div className={`w-2.5 h-2.5 rounded-full ${color.bg}`} />
                          <span className="text-slate-700 font-medium truncate">{b.brand}</span>
                          <span className="text-slate-400 font-bold ml-auto">{b.marketSharePct}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Sleepsia Strategic Advantage Pill */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-start gap-2.5">
                  <Award className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-emerald-900">Why Sleepsia Leads</h5>
                    <p className="text-[11px] text-emerald-800 leading-relaxed mt-0.5">
                      Sleepsia delivers high ergonomic orthopedic quality at ₹1,399 (30% less than The Sleep Company) while maintaining a higher customer rating (4.5★) than Wakefit (4.3★).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: 14-Day Share Trend */}
        {activeChartTab === 'trend_14d' && (
          <div className="py-4 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  14-Day Market Share Trajectory (%)
                </h4>
                <p className="text-xs text-slate-400">
                  Tracking daily market share momentum across the 14-day operational window.
                </p>
              </div>
              <div className="flex gap-2">
                {brandsList.map((brand) => {
                  const color = getBrandColor(brand);
                  return (
                    <div key={brand} className="flex items-center gap-1 text-[11px] text-slate-600">
                      <div className={`w-2.5 h-2.5 rounded-full ${color.bg}`} />
                      <span>{brand}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Custom SVG Trend Graph */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 overflow-x-auto">
              <div className="min-w-[600px] h-64 flex flex-col justify-between">
                {/* SVG Area & Lines */}
                <div className="relative flex-1 w-full">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 600 200" preserveAspectRatio="none">
                    {/* Grid Lines */}
                    {[0, 10, 20, 30, 40].map((level, i) => {
                      const y = 200 - (level / 40) * 180 - 10;
                      return (
                        <g key={level}>
                          <line x1="0" y1={y} x2="600" y2={y} stroke="#e2e8f0" strokeDasharray="3 3" />
                          <text x="5" y={y - 4} fontSize="9" fill="#94a3b8" fontWeight="bold">
                            {level}%
                          </text>
                        </g>
                      );
                    })}

                    {/* Plot Lines for Each Brand */}
                    {brandsList.map((brand) => {
                      const brandHistory = historical.filter((h) => h.brand.toLowerCase() === brand.toLowerCase());
                      if (brandHistory.length === 0) return null;

                      const points = brandHistory.map((h, idx) => {
                        const x = (idx / (brandHistory.length - 1)) * 580 + 10;
                        const y = 200 - (h.marketSharePct / 40) * 180 - 10;
                        return `${x},${y}`;
                      });

                      const color = getBrandColor(brand);
                      const isSleepsia = brand.toLowerCase().includes('sleepsia');

                      return (
                        <g key={brand}>
                          <polyline
                            fill="none"
                            stroke={color.bar}
                            strokeWidth={isSleepsia ? '4' : '2'}
                            points={points.join(' ')}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          {brandHistory.map((h, idx) => {
                            const x = (idx / (brandHistory.length - 1)) * 580 + 10;
                            const y = 200 - (h.marketSharePct / 40) * 180 - 10;
                            return (
                              <circle
                                key={idx}
                                cx={x}
                                cy={y}
                                r={isSleepsia ? 4 : 2.5}
                                fill={color.bar}
                                stroke="#ffffff"
                                strokeWidth="1.5"
                              />
                            );
                          })}
                        </g>
                      );
                    })}
                  </svg>
                </div>

                {/* X Axis Dates */}
                <div className="flex justify-between text-[10px] text-slate-400 font-mono pt-2 border-t border-slate-200 mt-2">
                  {uniqueDates.map((d: string, i: number) => (
                    <span key={d} className={i % 2 === 0 ? 'opacity-100' : 'opacity-40'}>
                      {d.slice(5)}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600 shrink-0" />
              <span>
                <b>Growth Insight:</b> Sleepsia expanded category share from <b>28.5%</b> (Aug 6) to <b>38.8%</b> (Aug 19), representing a <b>+10.3% share gain</b> driven by improved quick-commerce availability and cervical campaign scaling.
              </span>
            </div>
          </div>
        )}

        {/* Tab 3: Price vs Rating Matrix */}
        {activeChartTab === 'price_rating' && (
          <div className="py-4 space-y-6">
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Price vs Customer Rating Positioning (Value Matrix)
              </h4>
              <p className="text-xs text-slate-400">
                Evaluating price accessibility vs customer satisfaction (higher & right is better value-to-quality).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {benchmarks.map((item) => {
                const color = getBrandColor(item.brand);
                const isSleepsia = item.brand.toLowerCase().includes('sleepsia');

                return (
                  <div
                    key={item.brand}
                    className={`p-4 rounded-xl border flex flex-col justify-between ${
                      isSleepsia
                        ? 'border-blue-400 bg-blue-50/50 shadow-xs ring-2 ring-blue-500/20'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${color.lightBg} ${color.text}`}>
                          {item.brand}
                        </span>
                        {isSleepsia && <Trophy className="w-4 h-4 text-amber-500" />}
                      </div>

                      <div className="text-center py-2">
                        <span className="text-2xl font-black text-slate-800">₹{item.avgPrice}</span>
                        <span className="text-[10px] text-slate-400 block">Avg Selling Price</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Rating:</span>
                        <span className="font-bold text-amber-600 flex items-center gap-1">
                          {item.avgRating} <Star className="w-3.5 h-3.5 fill-amber-500" />
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Reviews:</span>
                        <span className="font-semibold text-slate-700">{item.totalReviews.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Positive:</span>
                        <span className="font-semibold text-emerald-600">{item.sentimentPositivePct}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Channel:</span>
                        <span className="font-medium text-slate-600">{item.primaryChannel}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 4: BSR & Ad Spend Share */}
        {activeChartTab === 'bsr_ad' && (
          <div className="py-4 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sales Rank (BSR) Comparison */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Amazon & Flipkart Best Sellers Rank (BSR)
                </h4>
                <p className="text-[11px] text-slate-400 mb-4">Lower rank indicates higher sales volume.</p>

                <div className="space-y-3">
                  {benchmarks
                    .sort((a, b) => a.avgBsr - b.avgBsr)
                    .map((item, index) => {
                      const color = getBrandColor(item.brand);
                      const isSleepsia = item.brand.toLowerCase().includes('sleepsia');
                      return (
                        <div
                          key={item.brand}
                          className={`p-2.5 rounded-lg border flex items-center justify-between ${
                            isSleepsia ? 'bg-blue-50 border-blue-300 font-bold' : 'bg-white border-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center">
                              #{index + 1}
                            </span>
                            <span className="text-xs text-slate-800">{item.brand}</span>
                          </div>
                          <span className={`text-xs ${isSleepsia ? 'text-blue-700 font-black' : 'text-slate-600'}`}>
                            BSR #{item.avgBsr}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Estimated Daily Ad Spend Share */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Estimated Daily Ad Spend (INR)
                </h4>
                <p className="text-[11px] text-slate-400 mb-4">Sponsored Products & Brand Ads presence.</p>

                <div className="space-y-3">
                  {benchmarks
                    .sort((a, b) => b.estAdSpend - a.estAdSpend)
                    .map((item) => {
                      const color = getBrandColor(item.brand);
                      const isSleepsia = item.brand.toLowerCase().includes('sleepsia');
                      const maxAd = Math.max(...benchmarks.map((b) => b.estAdSpend));
                      const percent = (item.estAdSpend / maxAd) * 100;

                      return (
                        <div key={item.brand} className="space-y-1">
                          <div className="flex justify-between text-xs font-medium text-slate-700">
                            <span className={isSleepsia ? 'font-bold text-blue-700' : ''}>{item.brand}</span>
                            <span className="font-mono">₹{(item.estAdSpend / 1000).toFixed(0)}k</span>
                          </div>
                          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{ width: `${percent}%`, backgroundColor: color.bar }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Competitor Brand Profiles & Matrix Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h3 className="text-lg font-bold text-slate-900 mb-1">Competitor Strategic Profiles</h3>
        <p className="text-xs text-slate-500 mb-4">
          Detailed breakdown of competitor product positioning, strengths, and market vulnerabilities.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {profiles.map((p) => {
            const isSleepsia = p.brandName.toLowerCase().includes('sleepsia');
            const color = getBrandColor(p.brandName);

            return (
              <div
                key={p.brandId}
                className={`p-4 rounded-xl border flex flex-col justify-between ${
                  isSleepsia
                    ? 'border-blue-400 bg-gradient-to-b from-blue-50/60 to-white shadow-xs ring-1 ring-blue-500/20'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${color.lightBg} ${color.text}`}>
                      {p.brandName}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Rank #{p.marketShareRank}</span>
                  </div>

                  <p className="text-xs italic text-slate-600 font-medium mb-3">"{p.tagline}"</p>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Pricing Tier</span>
                      <span className="text-slate-800 font-semibold">{p.pricingTier}</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Flagship Focus</span>
                      <span className="text-slate-800">{p.flagshipCategory}</span>
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <span className="text-[10px] text-emerald-600 uppercase font-bold block">Core Strength</span>
                      <span className="text-slate-700 text-[11px]">{p.strengths}</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-rose-500 uppercase font-bold block">Vulnerability</span>
                      <span className="text-slate-700 text-[11px]">{p.vulnerabilities}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-2 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400">
                  <span>Est. Annual Category:</span>
                  <span className="font-bold text-slate-800">₹{p.estAnnualPillowRevenueCr} Cr</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
