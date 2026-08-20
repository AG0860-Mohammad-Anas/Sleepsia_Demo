export interface CompetitorTrendPoint {
  day: string;
  Sleepsia: number;
  Wakefit: number;
  SleepyCat: number;
  WhiteWillow: number;
}

export interface CompetitorMetric {
  name: string;
  marketShare: number;
  rating: number;
  pricePoint: string;
  topSeller: string;
  color: string;
}

export interface ProductInventoryItem {
  id: string;
  name: string;
  platform: string;
  currentStock: number;
  reorderLevel: number;
  stockStatus: 'Healthy' | 'Low Stock' | 'Critical';
  rating: number;
  dailyVelocity: number;
}

export interface DashboardPayload {
  lastUpdated: string;
  executiveSummary: string;
  metrics: {
    totalSales14d: number;
    revenue14d: string;
    averageRating: number;
    returnRate: string;
  };
  competitorTrends: CompetitorTrendPoint[];
  competitors: CompetitorMetric[];
  products: ProductInventoryItem[];
}