import fs from 'fs';
import path from 'path';
import {
  AvailabilityStatus,
  PlatformName,
  PlatformProductMapping,
  ProductMaster,
  ProductPlatformMetric,
  ProductReviewContext,
} from '../../src/types/reporting.ts';

export interface RawCsvRow {
  [key: string]: string;
}

// Simple robust CSV parser handling commas, quotes, and newlines
export function parseCsv(fileContent: string): RawCsvRow[] {
  const lines = fileContent.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length === 0) return [];

  const headers = splitCsvLine(lines[0]);
  const rows: RawCsvRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = splitCsvLine(lines[i]);
    if (values.length === headers.length) {
      const row: RawCsvRow = {};
      headers.forEach((header, index) => {
        row[header.trim()] = values[index].trim();
      });
      rows.push(row);
    }
  }

  return rows;
}

function splitCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === ',' && !insideQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

export class SleepsiaDataLoader {
  private dataDir: string;
  private productMasterCache: ProductMaster[] | null = null;
  private platformMappingCache: PlatformProductMapping[] | null = null;

  constructor(dataDir: string = path.join(process.cwd(), 'data')) {
    this.dataDir = dataDir;
  }

  public getAvailableDates(): string[] {
    const amazonPath = path.join(this.dataDir, 'amazon_report_14d.csv');
    if (!fs.existsSync(amazonPath)) return ['2026-08-19'];

    const content = fs.readFileSync(amazonPath, 'utf-8');
    const rows = parseCsv(content);
    const dates = Array.from(new Set(rows.map((r) => r['date']))).filter(Boolean);
    return dates.sort().reverse(); // newest first
  }

  public loadProductMaster(): { data: ProductMaster[]; errors: string[] } {
    if (this.productMasterCache) {
      return { data: this.productMasterCache, errors: [] };
    }

    const filePath = path.join(this.dataDir, 'product_master.csv');
    const errors: string[] = [];
    if (!fs.existsSync(filePath)) {
      return { data: [], errors: ['product_master.csv not found in data directory'] };
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const rows = parseCsv(content);
    const data: ProductMaster[] = rows.map((r) => ({
      productId: r['Product ID'] || r['productId'] || '',
      sku: r['SKU'] || r['sku'] || '',
      productName: r['Product Name'] || r['productName'] || '',
      category: r['Category'] || r['category'] || '',
      reorderThreshold: parseFloat(r['Reorder Threshold'] || '100'),
      targetMinimumInventory: parseFloat(r['Target Minimum Inventory'] || '300'),
    }));

    this.productMasterCache = data;
    return { data, errors };
  }

  public loadPlatformMapping(): { data: PlatformProductMapping[]; errors: string[] } {
    if (this.platformMappingCache) {
      return { data: this.platformMappingCache, errors: [] };
    }

    const filePath = path.join(this.dataDir, 'platform_product_mapping.csv');
    const errors: string[] = [];
    if (!fs.existsSync(filePath)) {
      return { data: [], errors: ['platform_product_mapping.csv not found in data directory'] };
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const rows = parseCsv(content);
    const data: PlatformProductMapping[] = rows.map((r) => ({
      productId: r['Product ID'] || r['productId'] || '',
      internalSku: r['Internal SKU'] || r['sku'] || '',
      amazonAsin: r['Amazon ASIN'] || '',
      flipkartFsn: r['Flipkart FSN'] || '',
      blinkitItemCode: r['Blinkit Item Code'] || '',
      instamartSku: r['Instamart SKU'] || '',
    }));

    this.platformMappingCache = data;
    return { data, errors };
  }

  public loadMarketplaceRaw(platform: PlatformName): { rows: RawCsvRow[]; errors: string[] } {
    const fileMap: Record<PlatformName, string> = {
      Amazon: 'amazon_report_14d.csv',
      Flipkart: 'flipkart_report_14d.csv',
      Blinkit: 'blinkit_report_14d.csv',
      Instamart: 'instamart_report_14d.csv',
    };

    const fileName = fileMap[platform];
    const filePath = path.join(this.dataDir, fileName);
    if (!fs.existsSync(filePath)) {
      return { rows: [], errors: [`Marketplace file '${fileName}' unavailable`] };
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const rows = parseCsv(content);
    return { rows, errors: [] };
  }

  public loadReviewsData(targetDate: string): { data: ProductReviewContext[]; errors: string[] } {
    const filePath = path.join(this.dataDir, 'reviews_rating_data_14d.csv');
    if (!fs.existsSync(filePath)) {
      return { data: [], errors: ['reviews_rating_data_14d.csv unavailable'] };
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const rows = parseCsv(content);
    // Find records for targetDate or closest fallback
    let matched = rows.filter((r) => r['date'] === targetDate);
    if (matched.length === 0 && rows.length > 0) {
      matched = rows.filter((r) => r['date'] === rows[0]['date']);
    }

    const data: ProductReviewContext[] = matched.map((r) => ({
      productId: r['product_id'] || '',
      platform: (r['platform'] || 'Amazon') as PlatformName,
      platformIdentifier: r['platform_product_id'] || '',
      averageRating: parseFloat(r['average_rating'] || '4.0'),
      totalReviewCount: parseInt(r['total_review_count'] || '0', 10),
      newReviewsToday: parseInt(r['new_reviews_today'] || '0', 10),
      negativeReviewsToday: parseInt(r['negative_reviews_today'] || '0', 10),
      sentimentScore: parseFloat(r['sentiment_score'] || '0.8'),
    }));

    return { data, errors: [] };
  }

  /**
   * Deterministic processing of a platform's records for a given date.
   * Calculates 7-day sales velocity from preceding 7 days (or available trailing records).
   */
  public processPlatformMetrics(
    platform: PlatformName,
    targetDate: string
  ): {
    metrics: ProductPlatformMetric[];
    errors: string[];
    recordsProcessed: number;
  } {
    const { rows: allRows, errors: rawErrors } = this.loadMarketplaceRaw(platform);
    if (rawErrors.length > 0 || allRows.length === 0) {
      return { metrics: [], errors: rawErrors, recordsProcessed: 0 };
    }

    const { data: productMaster } = this.loadProductMaster();
    const { data: mappings } = this.loadPlatformMapping();

    const masterMap = new Map<string, ProductMaster>();
    productMaster.forEach((p) => masterMap.set(p.sku, p));

    const mappingMap = new Map<string, PlatformProductMapping>();
    mappings.forEach((m) => {
      mappingMap.set(m.internalSku, m);
      if (m.amazonAsin) mappingMap.set(m.amazonAsin, m);
      if (m.flipkartFsn) mappingMap.set(m.flipkartFsn, m);
      if (m.blinkitItemCode) mappingMap.set(m.blinkitItemCode, m);
      if (m.instamartSku) mappingMap.set(m.instamartSku, m);
    });

    // Filter rows for target date
    const targetRows = allRows.filter((r) => r['date'] === targetDate);
    if (targetRows.length === 0) {
      return {
        metrics: [],
        errors: [`No records found for platform ${platform} on date ${targetDate}`],
        recordsProcessed: 0,
      };
    }

    // Determine unique dates up to targetDate sorted chronologically
    const allDates = Array.from(new Set(allRows.map((r) => r['date']))).sort();
    const targetIndex = allDates.indexOf(targetDate);
    const trailingDates =
      targetIndex >= 0
        ? allDates.slice(Math.max(0, targetIndex - 6), targetIndex + 1)
        : [targetDate];

    const metrics: ProductPlatformMetric[] = [];
    const validationErrors: string[] = [];

    targetRows.forEach((row) => {
      const sku = row['sku'] || '';
      const platformIdentifier =
        row['asin'] || row['fsn'] || row['item_code'] || row['instamart_sku'] || '';
      const master = masterMap.get(sku);
      const mapping = mappingMap.get(sku) || mappingMap.get(platformIdentifier);

      const productId = master?.productId || mapping?.productId || 'UNKNOWN';
      const productName = master?.productName || row['product_name'] || 'Sleepsia Product';
      const reorderThreshold = master?.reorderThreshold || 100;

      const unitsSold = parseInt(row['units_sold'] || '0', 10);
      const price = parseFloat(row['price'] || '0');
      const revenue = parseFloat(row['revenue'] || (unitsSold * price).toString());
      const adSpend = parseFloat(row['ad_spend'] || '0');
      const adAttributedRevenue = parseFloat(row['ad_attributed_revenue'] || '0');
      const organicRevenue = Math.max(0, revenue - adAttributedRevenue);
      const returns = parseInt(row['returns'] || '0', 10);
      const returnRate = unitsSold > 0 ? (returns / unitsSold) * 100 : 0;

      const roas = adSpend > 0 ? adAttributedRevenue / adSpend : 0;
      const acos = adAttributedRevenue > 0 ? (adSpend / adAttributedRevenue) * 100 : 0;

      const rankOrBsr = row['bsr']
        ? parseInt(row['bsr'], 10)
        : row['rank']
        ? parseInt(row['rank'], 10)
        : row['city_rank']
        ? parseInt(row['city_rank'], 10)
        : null;

      const storeCoverage = row['store_coverage'] ? parseFloat(row['store_coverage']) : null;
      const inventoryLevel = parseInt(row['inventory_level'] || '0', 10);
      const unitsInTransit = parseInt(row['units_in_transit'] || '0', 10);

      // Deterministic 7-day sales velocity calculation
      const historicalRowsForSku = allRows.filter(
        (r) => r['sku'] === sku && trailingDates.includes(r['date'])
      );
      const totalTrailingUnits = historicalRowsForSku.reduce(
        (sum, r) => sum + parseInt(r['units_sold'] || '0', 10),
        0
      );
      const velocityDays = Math.max(1, trailingDates.length);
      const salesVelocity7d = parseFloat((totalTrailingUnits / velocityDays).toFixed(2));

      // Deterministic Inventory Days Cover
      const inventoryDaysCover =
        salesVelocity7d > 0 ? parseFloat((inventoryLevel / salesVelocity7d).toFixed(1)) : null;

      // Deterministic Availability Logic
      let availabilityStatus: AvailabilityStatus;
      if (inventoryLevel <= 0) {
        availabilityStatus = 'Out of Stock';
      } else if (inventoryLevel <= reorderThreshold) {
        availabilityStatus = 'Low Stock';
      } else {
        availabilityStatus = 'In Stock';
      }

      metrics.push({
        productId,
        sku,
        productName,
        platform,
        platformIdentifier,
        unitsSold,
        price,
        revenue,
        adSpend,
        adAttributedRevenue,
        organicRevenue,
        returns,
        returnRate: parseFloat(returnRate.toFixed(2)),
        roas: parseFloat(roas.toFixed(2)),
        acos: parseFloat(acos.toFixed(2)),
        rankOrBsr,
        storeCoverage,
        inventoryLevel,
        unitsInTransit,
        salesVelocity7d,
        inventoryDaysCover,
        availabilityStatus,
        reorderThreshold,
      });
    });

    return {
      metrics,
      errors: validationErrors,
      recordsProcessed: targetRows.length,
    };
  }
}
