export type PlatformName = 'Amazon' | 'Flipkart' | 'Blinkit' | 'Instamart';

export interface ProductMaster {
  productId: string;
  sku: string;
  productName: string;
  category: string;
  reorderThreshold: number;
  targetMinimumInventory: number;
}

export interface PlatformProductMapping {
  productId: string;
  internalSku: string;
  amazonAsin: string;
  flipkartFsn: string;
  blinkitItemCode: string;
  instamartSku: string;
}

export interface RawMarketplaceRow {
  date: string;
  platformIdentifier: string; // ASIN / FSN / Item Code / SKU
  sku: string;
  productName: string;
  unitsSold: number;
  price: number;
  revenue: number;
  adSpend: number;
  adAttributedRevenue: number;
  returns: number;
  rankOrBsr?: number;
  storeCoverage?: number;
  inventoryLevel: number;
  unitsInTransit: number;
}

export type AvailabilityStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';

export interface ProductPlatformMetric {
  productId: string;
  sku: string;
  productName: string;
  platform: PlatformName;
  platformIdentifier: string;
  unitsSold: number;
  price: number;
  revenue: number;
  adSpend: number;
  adAttributedRevenue: number;
  organicRevenue: number;
  returns: number;
  returnRate: number; // percentage
  roas: number;
  acos: number;
  rankOrBsr: number | null;
  storeCoverage: number | null;
  inventoryLevel: number;
  unitsInTransit: number;
  salesVelocity7d: number;
  inventoryDaysCover: number | null;
  availabilityStatus: AvailabilityStatus;
  reorderThreshold: number;
}

export interface InventoryAlert {
  productId: string;
  sku: string;
  productName: string;
  platform: PlatformName;
  inventoryLevel: number;
  reorderThreshold: number;
  salesVelocity7d: number;
  daysCover: number | null;
  status: AvailabilityStatus;
  reason: string;
}

export interface SpecialistAgentResult {
  agentName: string;
  platform: PlatformName;
  dataSource: string;
  status: 'success' | 'failed' | 'partial';
  recordsProcessed: number;
  totalUnitsSold: number;
  totalRevenue: number;
  totalAdSpend: number;
  totalAdAttributedRevenue: number;
  totalOrganicRevenue: number;
  totalReturns: number;
  platformRoas: number;
  platformAcos: number;
  products: ProductPlatformMetric[];
  topProductsByRevenue: string[];
  lowPerformingProducts: string[];
  inventoryIssues: InventoryAlert[];
  validationNotes: string[];
  executionTimeMs: number;
}

export interface PlatformSummary {
  platform: PlatformName;
  unitsSold: number;
  revenue: number;
  revenueShare: number; // percentage of total
  adSpend: number;
  adAttributedRevenue: number;
  organicRevenue: number;
  roas: number;
  acos: number;
  returns: number;
  returnRate: number;
  activeSkuCount: number;
  stockoutSkuCount: number;
  averageSellingPrice: number;
}

export interface ProductCrossPlatformSummary {
  productId: string;
  sku: string;
  productName: string;
  category: string;
  reorderThreshold: number;
  targetMinimumInventory: number;
  totalUnitsSold: number;
  totalRevenue: number;
  totalAdSpend: number;
  totalAdAttributedRevenue: number;
  totalOrganicRevenue: number;
  overallRoas: number;
  overallAcos: number;
  totalReturns: number;
  returnRate: number;
  averagePrice: number;
  salesVelocity7dTotal: number;
  totalInventoryAcrossPlatforms: number;
  overallDaysCover: number | null;
  overallAvailability: AvailabilityStatus;
  platformBreakdown: {
    [key in PlatformName]?: {
      unitsSold: number;
      revenue: number;
      adSpend: number;
      roas: number;
      inventory: number;
      availability: AvailabilityStatus;
      rankOrBsr: number | null;
      daysCover: number | null;
    };
  };
}

export interface ProductReviewContext {
  productId: string;
  platform: PlatformName;
  platformIdentifier: string;
  averageRating: number;
  totalReviewCount: number;
  newReviewsToday: number;
  negativeReviewsToday: number;
  sentimentScore: number;
}

export interface ProductHealthMetrics {
  productId: string;
  sku: string;
  productName: string;
  category: string;
  averageRating: number;
  totalReviews: number;
  newReviewsToday: number;
  negativeReviewsToday: number;
  returnRate: number;
  salesVelocity7d: number;
  daysCover: number | null;
  overallAvailability: AvailabilityStatus;
  healthScore: number; // 0 - 100 deterministic calculation
  healthGrade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  riskFlags: string[];
}

export interface DataQualityReport {
  date: string;
  sourcesProcessed: string[];
  sourcesFailed: string[];
  totalRecordsLoaded: number;
  invalidRecordCount: number;
  isComplete: boolean;
  exceptions: string[];
  deterministicValidationPassed: boolean;
}

export interface AgentWorkflowStepLog {
  stepId: string;
  agentName: string;
  agentRole: 'Supervisor' | 'Specialist' | 'Consolidation' | 'Reporting';
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  timestamp: string;
  durationMs: number;
  message: string;
  details?: Record<string, any>;
}

export interface ConsolidatedReportData {
  reportDate: string;
  generatedAt: string;
  kpis: {
    totalSales: number;
    totalRevenue: number;
    totalAdSpend: number;
    totalAdAttributedRevenue: number;
    totalOrganicRevenue: number;
    totalReturns: number;
    overallRoas: number;
    overallAcos: number;
    returnRate: number;
    productsAnalyzedCount: number;
    platformsAnalyzedCount: number;
  };
  platformPerformance: PlatformSummary[];
  productPerformance: ProductCrossPlatformSummary[];
  productHealth: ProductHealthMetrics[];
  inventoryAlerts: InventoryAlert[];
  reviewsSummary: ProductReviewContext[];
  crossPlatformObservations: string[];
  dataQuality: DataQualityReport;
  specialistOutputs: SpecialistAgentResult[];
  workflowLogs: AgentWorkflowStepLog[];
}

export interface AIReportIntelligence {
  executiveOverview: string;
  platformObservations: string;
  productPerformanceAnalysis: string;
  advertisingEfficiencyAnalysis: string;
  inventoryAndRiskAnalysis: string;
  reviewsAndCustomerSentimentAnalysis: string;
  salesVelocityInterpretation: string;
  managementDecisionPoints: string[];
  dataIntegrityStatement: string;
  aiModelUsed: string;
}

export interface FullDailyReportResponse {
  consolidatedData: ConsolidatedReportData;
  aiIntelligence: AIReportIntelligence;
  isSimulatedDemo: true;
  futureMigrationNotes: {
    amazon: string;
    flipkart: string;
    blinkit: string;
    instamart: string;
  };
}
