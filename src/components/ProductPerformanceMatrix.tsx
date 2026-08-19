import React, { useState } from 'react';
import {
  AvailabilityStatus,
  PlatformName,
  ProductCrossPlatformSummary,
} from '../types/reporting.ts';
import {
  ChevronDown,
  ChevronRight,
  Search,
  Package,
} from 'lucide-react';

interface ProductPerformanceMatrixProps {
  products: ProductCrossPlatformSummary[];
  totalRevenue: number;
}

export const ProductPerformanceMatrix: React.FC<ProductPerformanceMatrixProps> = ({
  products,
  totalRevenue,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'revenue' | 'units' | 'roas' | 'velocity'>('revenue');
  const [expandedSkus, setExpandedSkus] = useState<Record<string, boolean>>({
    'SLP-CMF-01': true,
  });

  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))];

  const toggleExpand = (sku: string) => {
    setExpandedSkus((prev) => ({ ...prev, [sku]: !prev[sku] }));
  };

  const filteredProducts = products
    .filter((p) => {
      const matchesSearch =
        p.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.productId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
      return matchesSearch && matchesCat;
    })
    .sort((a, b) => {
      if (sortBy === 'revenue') return b.totalRevenue - a.totalRevenue;
      if (sortBy === 'units') return b.totalUnitsSold - a.totalUnitsSold;
      if (sortBy === 'roas') return b.overallRoas - a.overallRoas;
      if (sortBy === 'velocity') return b.salesVelocity7dTotal - a.salesVelocity7dTotal;
      return 0;
    });

  const getStatusBadge = (status: AvailabilityStatus, roas: number) => {
    if (status === 'Out of Stock') {
      return (
        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[9px] font-bold uppercase">
          OUT STOCK
        </span>
      );
    }
    if (status === 'Low Stock') {
      return (
        <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-[9px] font-bold uppercase">
          LOW STOCK
        </span>
      );
    }
    if (roas < 3.0) {
      return (
        <span className="px-2 py-0.5 bg-rose-100 text-rose-700 rounded text-[9px] font-bold uppercase">
          OVERSPEND
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-[9px] font-bold uppercase">
        OPTIMAL
      </span>
    );
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-xs flex flex-col overflow-hidden mb-4">
      {/* Header & Controls */}
      <div className="px-3.5 py-2.5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-slate-50/50">
        <div>
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Cross-Platform Product Performance
          </h3>
          <span className="text-[10px] text-slate-400 font-medium">
            Showing {filteredProducts.length} of {products.length} SKUs (Click row to expand channels)
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-2 text-xs">
          <div className="relative">
            <Search className="w-3 h-3 absolute left-2 top-2 text-slate-400" />
            <input
              type="text"
              placeholder="Filter SKU / Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-6 pr-2 py-1 bg-white border border-slate-200 rounded text-slate-800 placeholder-slate-400 focus:outline-none text-[11px] w-36"
              id="product-search-input"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2 py-1 bg-white border border-slate-200 rounded text-slate-700 font-medium text-[11px] focus:outline-none"
            id="category-filter-select"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="px-2 py-1 bg-white border border-slate-200 rounded text-slate-700 font-medium text-[11px] focus:outline-none"
            id="product-sort-select"
          >
            <option value="revenue">Sort: Revenue</option>
            <option value="units">Sort: Units</option>
            <option value="roas">Sort: ROAS</option>
            <option value="velocity">Sort: 7d Velocity</option>
          </select>
        </div>
      </div>

      {/* High Density Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-white border-b border-slate-200 text-[10px] text-slate-500 uppercase tracking-wider font-bold">
            <tr>
              <th className="py-2.5 px-2 w-6"></th>
              <th className="py-2.5 px-3 font-bold">Product Name</th>
              <th className="py-2.5 px-3 font-bold">Category</th>
              <th className="py-2.5 px-3 font-bold text-right">Units</th>
              <th className="py-2.5 px-3 font-bold text-right">Revenue</th>
              <th className="py-2.5 px-3 font-bold text-right">Ad Spend</th>
              <th className="py-2.5 px-3 font-bold text-right">ROAS</th>
              <th className="py-2.5 px-3 font-bold text-right">7d Velocity</th>
              <th className="py-2.5 px-3 font-bold text-right">Days Cover</th>
              <th className="py-2.5 px-3 font-bold text-center">Health</th>
            </tr>
          </thead>
          <tbody className="text-[11px] font-medium divide-y divide-slate-50">
            {filteredProducts.map((prod) => {
              const isExpanded = expandedSkus[prod.sku] || false;
              const revenuePct =
                totalRevenue > 0
                  ? ((prod.totalRevenue / totalRevenue) * 100).toFixed(1)
                  : '0';

              return (
                <React.Fragment key={prod.sku}>
                  <tr
                    onClick={() => toggleExpand(prod.sku)}
                    className="hover:bg-slate-50/80 cursor-pointer transition select-none"
                  >
                    <td className="py-2 px-2 text-center text-slate-400">
                      {isExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5 text-blue-600" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5" />
                      )}
                    </td>
                    <td className="py-2 px-3">
                      <div className="font-semibold text-slate-800">{prod.productName}</div>
                      <div className="text-[9px] font-mono text-slate-400">
                        {prod.sku} • {revenuePct}% share
                      </div>
                    </td>
                    <td className="py-2 px-3 text-slate-500">{prod.category}</td>
                    <td className="py-2 px-3 text-right font-medium text-slate-800">
                      {prod.totalUnitsSold.toLocaleString()}
                    </td>
                    <td className="py-2 px-3 text-right font-bold text-slate-900">
                      ₹{prod.totalRevenue.toLocaleString()}
                    </td>
                    <td className="py-2 px-3 text-right text-slate-600">
                      ₹{prod.totalAdSpend.toLocaleString()}
                    </td>
                    <td className="py-2 px-3 text-right text-blue-600 font-bold">
                      {prod.overallRoas}x
                    </td>
                    <td className="py-2 px-3 text-right text-slate-600">
                      {prod.salesVelocity7dTotal}/d
                    </td>
                    <td className="py-2 px-3 text-right text-slate-500">
                      {prod.overallDaysCover !== null ? `${prod.overallDaysCover}d` : 'N/A'}
                    </td>
                    <td className="py-2 px-3 text-center">
                      {getStatusBadge(prod.overallAvailability, prod.overallRoas)}
                    </td>
                  </tr>

                  {/* Expanded Platform Sub-Rows */}
                  {isExpanded && (
                    <tr className="bg-slate-50/70">
                      <td colSpan={10} className="py-2 px-4 border-y border-slate-100">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                          {(['Amazon', 'Flipkart', 'Blinkit', 'Instamart'] as PlatformName[]).map(
                            (plat) => {
                              const details = prod.platformBreakdown[plat];
                              if (!details) return null;
                              return (
                                <div
                                  key={plat}
                                  className="p-2 rounded bg-white border border-slate-200 text-xs shadow-2xs"
                                >
                                  <div className="flex items-center justify-between font-bold text-slate-800 mb-1">
                                    <span className="text-[11px]">{plat}</span>
                                    <span className="text-[9px] px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded font-mono">
                                      {details.availability}
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-600">
                                    <div>
                                      Units: <b className="text-slate-800">{details.unitsSold}</b>
                                    </div>
                                    <div>
                                      Rev: <b className="text-slate-800">₹{details.revenue.toLocaleString()}</b>
                                    </div>
                                    <div>
                                      Spend: ₹{details.adSpend.toLocaleString()}
                                    </div>
                                    <div>
                                      ROAS: <b className="text-blue-600">{details.roas}x</b>
                                    </div>
                                    <div>
                                      Stock: {details.inventory} u
                                    </div>
                                    <div>
                                      Days: {details.daysCover ?? '0'}d
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
