import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  Package,
  RefreshCw,
  AlertTriangle,
  ShoppingBag,
  DollarSign,
  Star,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { DashboardPayload } from './types/reporting';
import { CompetitorComparisonSection } from './components/CompetitorComparisonSection';

export default function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'competitors' | 'inventory'>('overview');
  const [data, setData] = useState<DashboardPayload | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/dashboard');
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const json: DashboardPayload = await response.json();
      setData(json);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900 text-white">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-300 font-medium">Initializing Sleepsia Intelligence Control Tower...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 p-6">
        <div className="bg-white max-w-md w-full p-6 rounded-xl border border-red-200 shadow-lg text-center space-y-4">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-lg font-bold text-slate-800">Connection Failed</h2>
          <p className="text-sm text-slate-600">{error || 'Unable to load dashboard data.'}</p>
          <button
            onClick={fetchData}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold text-sm transition"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between shrink-0 shadow-xl">
        <div>
          <div className="p-6 border-b border-slate-800 flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center font-black text-white text-lg tracking-wider">
              SL
            </div>
            <div>
              <h1 className="font-bold text-white text-base tracking-tight leading-tight">Sleepsia</h1>
              <span className="text-xs text-blue-400 font-medium">Intelligence Tower</span>
            </div>
          </div>

          <nav className="p-4 space-y-1.5">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'overview'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Executive Overview
            </button>

            <button
              onClick={() => setActiveTab('competitors')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'competitors'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Competitor Benchmark
            </button>

            <button
              onClick={() => setActiveTab('inventory')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'inventory'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Package className="w-4 h-4" />
              Products & Stock
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800 text-xs text-slate-500 flex items-center justify-between">
          <span>Synced: {data.lastUpdated}</span>
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Live
          </span>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-slate-800 capitalize">
              {activeTab === 'overview' && 'Executive Performance Overview'}
              {activeTab === 'competitors' && 'Competitive Intelligence Dashboard'}
              {activeTab === 'inventory' && 'Inventory Velocity & Health'}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-lg text-xs font-semibold transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh
            </button>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-8 space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-6 rounded-2xl shadow-sm">
                <span className="text-xs uppercase font-bold text-blue-300 tracking-wider">Executive Brief</span>
                <p className="text-base mt-2 font-normal leading-relaxed text-blue-50">
                  {data.executiveSummary}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 uppercase">14-Day Sales</span>
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-slate-900 mt-3">{data.metrics.totalSales14d.toLocaleString()} Units</p>
                  <span className="text-xs text-emerald-600 font-semibold mt-1 inline-block">↑ 12.4% vs prev cycle</span>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 uppercase">14-Day Gross Revenue</span>
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <DollarSign className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-slate-900 mt-3">{data.metrics.revenue14d}</p>
                  <span className="text-xs text-emerald-600 font-semibold mt-1 inline-block">Direct Amazon & Flipkart</span>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 uppercase">Average Product Rating</span>
                    <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500">
                      <Star className="w-4 h-4 fill-amber-500" />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-slate-900 mt-3">{data.metrics.averageRating} / 5.0</p>
                  <span className="text-xs text-slate-500 font-semibold mt-1 inline-block">From 18,240+ reviews</span>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 uppercase">Customer Return Rate</span>
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-slate-900 mt-3">{data.metrics.returnRate}</p>
                  <span className="text-xs text-emerald-600 font-semibold mt-1 inline-block">Well below 3.5% industry max</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
                <h3 className="text-base font-bold text-slate-800 mb-4">Core Focus Products</h3>
                <div className="divide-y divide-slate-100">
                  {data.products.slice(0, 3).map((item) => (
                    <div key={item.id} className="py-3.5 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">{item.name}</p>
                        <span className="text-xs text-slate-400">Channel: {item.platform}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-slate-800">{item.currentStock} Units</span>
                        <span className="block text-xs text-emerald-600 font-medium">{item.dailyVelocity} units / day</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'competitors' && (
            <CompetitorComparisonSection
              trends={data.competitorTrends}
              competitors={data.competitors}
            />
          )}

          {activeTab === 'inventory' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-800">Warehouse & Channel Inventory</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Monitoring reorder levels and dispatch velocity across e-commerce channels.</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="py-3.5 px-6">SKU / Product</th>
                      <th className="py-3.5 px-6">Channel</th>
                      <th className="py-3.5 px-6">Available Stock</th>
                      <th className="py-3.5 px-6">Reorder Threshold</th>
                      <th className="py-3.5 px-6">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {data.products.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-4 px-6 font-semibold text-slate-900">{p.name}</td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center gap-1 text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">
                            <ExternalLink className="w-3 h-3" /> {p.platform}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-bold">{p.currentStock}</td>
                        <td className="py-4 px-6 text-slate-500">{p.reorderLevel}</td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full ${
                              p.stockStatus === 'Healthy'
                                ? 'bg-emerald-100 text-emerald-800'
                                : p.stockStatus === 'Low Stock'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {p.stockStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}