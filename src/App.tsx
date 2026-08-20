import { useState, useEffect } from 'react';
// Assuming you have these components, or you can create simple placeholders for them
import ExecutiveOverview from './components/ExecutiveOverview'; 
import CompetitorSection from './components/CompetitorComparisonSection';
import InventoryAlerts from './components/InventoryAlertsBanner';

export default function App() {
  const [activePage, setActivePage] = useState('overview');
  const [data, setData] = useState(null);

  useEffect(() => {
    // Fetch the data from our updated reportingAgent
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => console.error("Failed to load data", err));
  }, []);

  if (!data) return <div className="p-10 text-center text-gray-500">Loading Dashboard...</div>;

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-slate-800">
          <span className="text-blue-400">SL</span> Sleepsia
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActivePage('overview')}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${activePage === 'overview' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}
          >
            Executive Overview
          </button>
          <button 
            onClick={() => setActivePage('competitors')}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${activePage === 'competitors' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}
          >
            Competitor Intelligence
          </button>
          <button 
            onClick={() => setActivePage('inventory')}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${activePage === 'inventory' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}
          >
            Products & Stock
          </button>
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {activePage === 'overview' && 'Executive Overview'}
              {activePage === 'competitors' && 'Competitor Intelligence'}
              {activePage === 'inventory' && 'Inventory Management'}
            </h1>
            <p className="text-gray-500 mt-1">Data synced for {data.lastUpdated}</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">
            Refresh Data
          </button>
        </header>

        {/* PAGE ROUTING LOGIC */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          {activePage === 'overview' && (
            <div>
              <p className="text-lg text-gray-700 mb-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
                {data.executiveSummary}
              </p>
              <div className="grid grid-cols-4 gap-4 mb-8">
                {/* Metric Cards */}
                <div className="p-4 border rounded-lg"><p className="text-sm text-gray-500">14d Sales</p><p className="text-2xl font-bold">{data.metrics.totalSales14d}</p></div>
                <div className="p-4 border rounded-lg"><p className="text-sm text-gray-500">14d Revenue</p><p className="text-2xl font-bold">{data.metrics.revenue14d}</p></div>
                <div className="p-4 border rounded-lg"><p className="text-sm text-gray-500">Avg Rating</p><p className="text-2xl font-bold">{data.metrics.averageRating}</p></div>
                <div className="p-4 border rounded-lg"><p className="text-sm text-gray-500">Return Rate</p><p className="text-2xl font-bold text-green-600">{data.metrics.returns}</p></div>
              </div>
            </div>
          )}

          {activePage === 'competitors' && (
            <CompetitorSection data={data.competitors} />
          )}

          {activePage === 'inventory' && (
             <InventoryAlerts products={data.topProducts} />
          )}
        </div>
      </main>
    </div>
  );
}