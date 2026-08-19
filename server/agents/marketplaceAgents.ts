import {
  InventoryAlert,
  PlatformName,
  ProductPlatformMetric,
  SpecialistAgentResult,
} from '../../src/types/reporting.ts';
import { SleepsiaDataLoader } from '../data/csvDataLoader.ts';

export class MarketplaceSpecialistAgents {
  private loader: SleepsiaDataLoader;

  constructor(loader: SleepsiaDataLoader) {
    this.loader = loader;
  }

  public async runAgent(
    platform: PlatformName,
    targetDate: string
  ): Promise<SpecialistAgentResult> {
    const startTime = Date.now();
    const agentNames: Record<PlatformName, string> = {
      Amazon: 'Amazon Performance Agent',
      Flipkart: 'Flipkart Performance Agent',
      Blinkit: 'Blinkit Performance Agent',
      Instamart: 'Instamart Performance Agent',
    };

    const fileNames: Record<PlatformName, string> = {
      Amazon: 'amazon_report_14d.csv',
      Flipkart: 'flipkart_report_14d.csv',
      Blinkit: 'blinkit_report_14d.csv',
      Instamart: 'instamart_report_14d.csv',
    };

    const agentName = agentNames[platform];
    const dataSource = fileNames[platform];

    try {
      const { metrics, errors, recordsProcessed } = this.loader.processPlatformMetrics(
        platform,
        targetDate
      );

      if (errors.length > 0 && recordsProcessed === 0) {
        return {
          agentName,
          platform,
          dataSource,
          status: 'failed',
          recordsProcessed: 0,
          totalUnitsSold: 0,
          totalRevenue: 0,
          totalAdSpend: 0,
          totalAdAttributedRevenue: 0,
          totalOrganicRevenue: 0,
          totalReturns: 0,
          platformRoas: 0,
          platformAcos: 0,
          products: [],
          topProductsByRevenue: [],
          lowPerformingProducts: [],
          inventoryIssues: [],
          validationNotes: errors,
          executionTimeMs: Date.now() - startTime,
        };
      }

      // Aggregate Platform-level totals
      const totalUnitsSold = metrics.reduce((sum, p) => sum + p.unitsSold, 0);
      const totalRevenue = metrics.reduce((sum, p) => sum + p.revenue, 0);
      const totalAdSpend = metrics.reduce((sum, p) => sum + p.adSpend, 0);
      const totalAdAttributedRevenue = metrics.reduce((sum, p) => sum + p.adAttributedRevenue, 0);
      const totalOrganicRevenue = metrics.reduce((sum, p) => sum + p.organicRevenue, 0);
      const totalReturns = metrics.reduce((sum, p) => sum + p.returns, 0);

      const platformRoas = totalAdSpend > 0 ? parseFloat((totalAdAttributedRevenue / totalAdSpend).toFixed(2)) : 0;
      const platformAcos =
        totalAdAttributedRevenue > 0 ? parseFloat(((totalAdSpend / totalAdAttributedRevenue) * 100).toFixed(2)) : 0;

      // Identify top products by revenue
      const sortedByRevenue = [...metrics].sort((a, b) => b.revenue - a.revenue);
      const topProductsByRevenue = sortedByRevenue.slice(0, 2).map((p) => `${p.productName} (₹${p.revenue.toLocaleString()})`);

      // Identify low performers (low ROAS or zero sales)
      const lowPerformingProducts = metrics
        .filter((p) => p.unitsSold === 0 || (p.adSpend > 0 && p.roas < 2.0))
        .map((p) => `${p.productName} (Sales: ${p.unitsSold}, ROAS: ${p.roas}x)`);

      // Identify inventory/availability issues
      const inventoryIssues: InventoryAlert[] = [];
      metrics.forEach((p) => {
        if (p.availabilityStatus === 'Out of Stock') {
          inventoryIssues.push({
            productId: p.productId,
            sku: p.sku,
            productName: p.productName,
            platform,
            inventoryLevel: p.inventoryLevel,
            reorderThreshold: p.reorderThreshold,
            salesVelocity7d: p.salesVelocity7d,
            daysCover: p.inventoryDaysCover,
            status: 'Out of Stock',
            reason: `Stock is exhausted (${p.inventoryLevel} units). Active demand velocity is ${p.salesVelocity7d} units/day.`,
          });
        } else if (p.availabilityStatus === 'Low Stock') {
          inventoryIssues.push({
            productId: p.productId,
            sku: p.sku,
            productName: p.productName,
            platform,
            inventoryLevel: p.inventoryLevel,
            reorderThreshold: p.reorderThreshold,
            salesVelocity7d: p.salesVelocity7d,
            daysCover: p.inventoryDaysCover,
            status: 'Low Stock',
            reason: `Current stock (${p.inventoryLevel}) is below reorder threshold (${p.reorderThreshold}). Days cover: ${p.inventoryDaysCover ?? 'N/A'} days.`,
          });
        } else if (p.inventoryDaysCover !== null && p.inventoryDaysCover < 7) {
          inventoryIssues.push({
            productId: p.productId,
            sku: p.sku,
            productName: p.productName,
            platform,
            inventoryLevel: p.inventoryLevel,
            reorderThreshold: p.reorderThreshold,
            salesVelocity7d: p.salesVelocity7d,
            daysCover: p.inventoryDaysCover,
            status: 'Low Stock',
            reason: `Depletion risk: Only ${p.inventoryDaysCover} days of inventory remaining at 7d velocity of ${p.salesVelocity7d} units/day.`,
          });
        }
      });

      return {
        agentName,
        platform,
        dataSource,
        status: errors.length > 0 ? 'partial' : 'success',
        recordsProcessed,
        totalUnitsSold,
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        totalAdSpend: parseFloat(totalAdSpend.toFixed(2)),
        totalAdAttributedRevenue: parseFloat(totalAdAttributedRevenue.toFixed(2)),
        totalOrganicRevenue: parseFloat(totalOrganicRevenue.toFixed(2)),
        totalReturns,
        platformRoas,
        platformAcos,
        products: metrics,
        topProductsByRevenue,
        lowPerformingProducts,
        inventoryIssues,
        validationNotes: errors,
        executionTimeMs: Date.now() - startTime,
      };
    } catch (err: any) {
      return {
        agentName,
        platform,
        dataSource,
        status: 'failed',
        recordsProcessed: 0,
        totalUnitsSold: 0,
        totalRevenue: 0,
        totalAdSpend: 0,
        totalAdAttributedRevenue: 0,
        totalOrganicRevenue: 0,
        totalReturns: 0,
        platformRoas: 0,
        platformAcos: 0,
        products: [],
        topProductsByRevenue: [],
        lowPerformingProducts: [],
        inventoryIssues: [],
        validationNotes: [`Execution exception: ${err.message}`],
        executionTimeMs: Date.now() - startTime,
      };
    }
  }
}
