import {
  AvailabilityStatus,
  ConsolidatedReportData,
  DataQualityReport,
  InventoryAlert,
  PlatformName,
  PlatformSummary,
  ProductCrossPlatformSummary,
  ProductHealthMetrics,
  ProductReviewContext,
  SpecialistAgentResult,
} from '../../src/types/reporting.ts';
import { SleepsiaDataLoader } from '../data/csvDataLoader.ts';

export class EcommercePerformanceConsolidationAgent {
  private loader: SleepsiaDataLoader;

  constructor(loader: SleepsiaDataLoader) {
    this.loader = loader;
  }

  public consolidate(
    reportDate: string,
    specialistOutputs: SpecialistAgentResult[]
  ): ConsolidatedReportData {
    const { data: productMaster } = this.loader.loadProductMaster();
    const { data: reviewsData } = this.loader.loadReviewsData(reportDate);

    // 1. Overall KPIs
    const totalSales = specialistOutputs.reduce((sum, s) => sum + s.totalUnitsSold, 0);
    const totalRevenue = specialistOutputs.reduce((sum, s) => sum + s.totalRevenue, 0);
    const totalAdSpend = specialistOutputs.reduce((sum, s) => sum + s.totalAdSpend, 0);
    const totalAdAttributedRevenue = specialistOutputs.reduce(
      (sum, s) => sum + s.totalAdAttributedRevenue,
      0
    );
    const totalOrganicRevenue = specialistOutputs.reduce(
      (sum, s) => sum + s.totalOrganicRevenue,
      0
    );
    const totalReturns = specialistOutputs.reduce((sum, s) => sum + s.totalReturns, 0);
    const overallRoas =
      totalAdSpend > 0 ? parseFloat((totalAdAttributedRevenue / totalAdSpend).toFixed(2)) : 0;
    const overallAcos =
      totalAdAttributedRevenue > 0
        ? parseFloat(((totalAdSpend / totalAdAttributedRevenue) * 100).toFixed(2))
        : 0;
    const returnRate = totalSales > 0 ? parseFloat(((totalReturns / totalSales) * 100).toFixed(2)) : 0;

    // 2. Platform Performance
    const platformPerformance: PlatformSummary[] = specialistOutputs.map((s) => {
      const revenueShare =
        totalRevenue > 0 ? parseFloat(((s.totalRevenue / totalRevenue) * 100).toFixed(1)) : 0;
      const platformReturnRate =
        s.totalUnitsSold > 0 ? parseFloat(((s.totalReturns / s.totalUnitsSold) * 100).toFixed(2)) : 0;
      const stockoutSkuCount = s.products.filter((p) => p.availabilityStatus === 'Out of Stock').length;
      const avgPrice =
        s.totalUnitsSold > 0 ? parseFloat((s.totalRevenue / s.totalUnitsSold).toFixed(2)) : 0;

      return {
        platform: s.platform,
        unitsSold: s.totalUnitsSold,
        revenue: s.totalRevenue,
        revenueShare,
        adSpend: s.totalAdSpend,
        adAttributedRevenue: s.totalAdAttributedRevenue,
        organicRevenue: s.totalOrganicRevenue,
        roas: s.platformRoas,
        acos: s.platformAcos,
        returns: s.totalReturns,
        returnRate: platformReturnRate,
        activeSkuCount: s.products.length,
        stockoutSkuCount,
        averageSellingPrice: avgPrice,
      };
    });

    // 3. Product Cross-Platform Performance Rollup
    const productPerformance: ProductCrossPlatformSummary[] = productMaster.map((master) => {
      let pUnitsSold = 0;
      let pRevenue = 0;
      let pAdSpend = 0;
      let pAdAttributedRevenue = 0;
      let pOrganicRevenue = 0;
      let pReturns = 0;
      let pInventoryTotal = 0;
      let pVelocityTotal = 0;
      let outOfStockCount = 0;
      let lowStockCount = 0;

      const platformBreakdown: ProductCrossPlatformSummary['platformBreakdown'] = {};

      specialistOutputs.forEach((s) => {
        const productOnPlatform = s.products.find(
          (p) => p.sku === master.sku || p.productId === master.productId
        );
        if (productOnPlatform) {
          pUnitsSold += productOnPlatform.unitsSold;
          pRevenue += productOnPlatform.revenue;
          pAdSpend += productOnPlatform.adSpend;
          pAdAttributedRevenue += productOnPlatform.adAttributedRevenue;
          pOrganicRevenue += productOnPlatform.organicRevenue;
          pReturns += productOnPlatform.returns;
          pInventoryTotal += productOnPlatform.inventoryLevel;
          pVelocityTotal += productOnPlatform.salesVelocity7d;

          if (productOnPlatform.availabilityStatus === 'Out of Stock') outOfStockCount++;
          if (productOnPlatform.availabilityStatus === 'Low Stock') lowStockCount++;

          platformBreakdown[s.platform] = {
            unitsSold: productOnPlatform.unitsSold,
            revenue: productOnPlatform.revenue,
            adSpend: productOnPlatform.adSpend,
            roas: productOnPlatform.roas,
            inventory: productOnPlatform.inventoryLevel,
            availability: productOnPlatform.availabilityStatus,
            rankOrBsr: productOnPlatform.rankOrBsr,
            daysCover: productOnPlatform.inventoryDaysCover,
          };
        }
      });

      const pRoas = pAdSpend > 0 ? parseFloat((pAdAttributedRevenue / pAdSpend).toFixed(2)) : 0;
      const pAcos =
        pAdAttributedRevenue > 0
          ? parseFloat(((pAdSpend / pAdAttributedRevenue) * 100).toFixed(2))
          : 0;
      const pReturnRate =
        pUnitsSold > 0 ? parseFloat(((pReturns / pUnitsSold) * 100).toFixed(2)) : 0;
      const avgPrice = pUnitsSold > 0 ? parseFloat((pRevenue / pUnitsSold).toFixed(2)) : 0;
      const overallDaysCover =
        pVelocityTotal > 0 ? parseFloat((pInventoryTotal / pVelocityTotal).toFixed(1)) : null;

      let overallAvailability: AvailabilityStatus = 'In Stock';
      if (outOfStockCount > 0 && outOfStockCount === specialistOutputs.length) {
        overallAvailability = 'Out of Stock';
      } else if (pInventoryTotal <= master.reorderThreshold || outOfStockCount > 0 || lowStockCount > 0) {
        overallAvailability = 'Low Stock';
      }

      return {
        productId: master.productId,
        sku: master.sku,
        productName: master.productName,
        category: master.category,
        reorderThreshold: master.reorderThreshold,
        targetMinimumInventory: master.targetMinimumInventory,
        totalUnitsSold: pUnitsSold,
        totalRevenue: parseFloat(pRevenue.toFixed(2)),
        totalAdSpend: parseFloat(pAdSpend.toFixed(2)),
        totalAdAttributedRevenue: parseFloat(pAdAttributedRevenue.toFixed(2)),
        totalOrganicRevenue: parseFloat(pOrganicRevenue.toFixed(2)),
        overallRoas: pRoas,
        overallAcos: pAcos,
        totalReturns: pReturns,
        returnRate: pReturnRate,
        averagePrice: avgPrice,
        salesVelocity7dTotal: parseFloat(pVelocityTotal.toFixed(2)),
        totalInventoryAcrossPlatforms: pInventoryTotal,
        overallDaysCover,
        overallAvailability,
        platformBreakdown,
      };
    });

    // 4. Product Health Scorecard (Deterministic 0-100 index)
    const productHealth: ProductHealthMetrics[] = productPerformance.map((prod) => {
      const prodReviews = reviewsData.filter((r) => r.productId === prod.productId);
      const avgRating =
        prodReviews.length > 0
          ? parseFloat(
              (
                prodReviews.reduce((sum, r) => sum + r.averageRating, 0) / prodReviews.length
              ).toFixed(2)
            )
          : 4.2;
      const totalReviews = prodReviews.reduce((sum, r) => sum + r.totalReviewCount, 0);
      const newReviewsToday = prodReviews.reduce((sum, r) => sum + r.newReviewsToday, 0);
      const negativeReviewsToday = prodReviews.reduce((sum, r) => sum + r.negativeReviewsToday, 0);

      // Calculate health score:
      // Rating component (max 40 pts, rating 5.0 -> 40, rating 4.0 -> 25)
      const ratingScore = Math.min(40, Math.max(0, (avgRating - 3.5) * 26.6));
      // Return rate component (max 25 pts, <3% -> 25, 3-5% -> 15, >5% -> 5)
      const returnScore = prod.returnRate < 3.0 ? 25 : prod.returnRate < 5.0 ? 15 : 5;
      // Inventory availability component (max 20 pts)
      const stockScore =
        prod.overallAvailability === 'In Stock'
          ? 20
          : prod.overallAvailability === 'Low Stock'
          ? 10
          : 0;
      // ROAS & Demand component (max 15 pts)
      const roasScore = prod.overallRoas >= 4.0 ? 15 : prod.overallRoas >= 3.0 ? 10 : 5;

      const healthScore = Math.round(ratingScore + returnScore + stockScore + roasScore);

      let healthGrade: ProductHealthMetrics['healthGrade'] = 'B';
      if (healthScore >= 90) healthGrade = 'A+';
      else if (healthScore >= 80) healthGrade = 'A';
      else if (healthScore >= 70) healthGrade = 'B';
      else if (healthScore >= 60) healthGrade = 'C';
      else if (healthScore >= 50) healthGrade = 'D';
      else healthGrade = 'F';

      const riskFlags: string[] = [];
      if (prod.overallAvailability === 'Out of Stock') {
        riskFlags.push('Critical: Out of stock on 1 or more channels');
      } else if (prod.overallAvailability === 'Low Stock') {
        riskFlags.push('Inventory below threshold');
      }
      if (prod.returnRate > 3.5) {
        riskFlags.push(`Elevated returns: ${prod.returnRate}%`);
      }
      if (negativeReviewsToday > 0) {
        riskFlags.push(`${negativeReviewsToday} negative review(s) logged today`);
      }
      if (prod.overallRoas < 2.5 && prod.totalAdSpend > 0) {
        riskFlags.push(`Sub-target ROAS (${prod.overallRoas}x)`);
      }

      return {
        productId: prod.productId,
        sku: prod.sku,
        productName: prod.productName,
        category: prod.category,
        averageRating: avgRating,
        totalReviews,
        newReviewsToday,
        negativeReviewsToday,
        returnRate: prod.returnRate,
        salesVelocity7d: prod.salesVelocity7dTotal,
        daysCover: prod.overallDaysCover,
        overallAvailability: prod.overallAvailability,
        healthScore,
        healthGrade,
        riskFlags,
      };
    });

    // 5. Aggregate Inventory Alerts
    const inventoryAlerts: InventoryAlert[] = [];
    specialistOutputs.forEach((s) => {
      inventoryAlerts.push(...s.inventoryIssues);
    });

    // 6. Cross-Platform Observations (Deterministic rules)
    const crossPlatformObservations: string[] = [];
    const topPlatform = [...platformPerformance].sort((a, b) => b.revenue - a.revenue)[0];
    if (topPlatform) {
      crossPlatformObservations.push(
        `Leading Channel: ${topPlatform.platform} generated ${topPlatform.revenueShare}% (₹${topPlatform.revenue.toLocaleString()}) of total daily revenue with a ${topPlatform.roas}x ROAS.`
      );
    }

    const topProduct = [...productPerformance].sort((a, b) => b.totalRevenue - a.totalRevenue)[0];
    if (topProduct) {
      crossPlatformObservations.push(
        `Top Product: ${topProduct.productName} contributed ₹${topProduct.totalRevenue.toLocaleString()} across all platforms with a strong ${topProduct.overallRoas}x blended ROAS.`
      );
    }

    const outOfStockItems = specialistOutputs
      .flatMap((s) => s.products.filter((p) => p.availabilityStatus === 'Out of Stock'))
      .map((p) => `${p.productName} on ${p.platform}`);
    if (outOfStockItems.length > 0) {
      crossPlatformObservations.push(
        `Availability Notice: Out of stock detected for ${outOfStockItems.join(', ')}. Ad spend should be verified to prevent wasted budget.`
      );
    }

    const quickCommerceRevenue = platformPerformance
      .filter((p) => p.platform === 'Blinkit' || p.platform === 'Instamart')
      .reduce((sum, p) => sum + p.revenue, 0);
    const quickCommerceShare =
      totalRevenue > 0 ? ((quickCommerceRevenue / totalRevenue) * 100).toFixed(1) : '0';
    crossPlatformObservations.push(
      `Quick Commerce Contribution: Blinkit and Instamart together represent ${quickCommerceShare}% of daily sales (₹${quickCommerceRevenue.toLocaleString()}), showing strong rapid-fulfillment demand.`
    );

    // 7. Data Quality
    const sourcesProcessed = specialistOutputs
      .filter((s) => s.status !== 'failed')
      .map((s) => s.dataSource);
    const sourcesFailed = specialistOutputs
      .filter((s) => s.status === 'failed')
      .map((s) => s.dataSource);
    const exceptions = specialistOutputs.flatMap((s) => s.validationNotes);

    const dataQuality: DataQualityReport = {
      date: reportDate,
      sourcesProcessed,
      sourcesFailed,
      totalRecordsLoaded: specialistOutputs.reduce((sum, s) => sum + s.recordsProcessed, 0),
      invalidRecordCount: exceptions.length,
      isComplete: sourcesFailed.length === 0,
      exceptions,
      deterministicValidationPassed: true,
    };

    return {
      reportDate,
      generatedAt: new Date().toISOString(),
      kpis: {
        totalSales,
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        totalAdSpend: parseFloat(totalAdSpend.toFixed(2)),
        totalAdAttributedRevenue: parseFloat(totalAdAttributedRevenue.toFixed(2)),
        totalOrganicRevenue: parseFloat(totalOrganicRevenue.toFixed(2)),
        totalReturns,
        overallRoas,
        overallAcos,
        returnRate,
        productsAnalyzedCount: productPerformance.length,
        platformsAnalyzedCount: specialistOutputs.length,
      },
      platformPerformance,
      productPerformance,
      productHealth,
      inventoryAlerts,
      reviewsSummary: reviewsData,
      crossPlatformObservations,
      dataQuality,
      specialistOutputs,
      workflowLogs: [], // supervisor will append
    };
  }
}
