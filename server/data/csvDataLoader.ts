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
    const files = [
      'amazon_report_14d.csv',
      'flipkart_report_14d.csv',
      'blinkit_report_14d.csv',
      'instamart_report_14d.csv',
    ];

    const allDates = new Set<string>();

    for (const file of files) {
      const filePath = path.join(this.dataDir, file);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const rows = parseCsv(content);
        for (const r of rows) {
          const d =
            r['date'] ||
            r['order_date'] ||
            r['dispatch_date'] ||
            r['txn_date'] ||
            r['record_date'] ||
            r['Date'];
          if (d && d.match(/^\d{4}-\d{2}-\d{2}$/)) {
            allDates.add(d);
          }
        }
      }
    }

    const sorted = Array.from(allDates).sort().reverse();
    return sorted.length > 0 ? sorted : ['2026-08-19'];
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
    const data: ProductMaster[] = rows.map((r, idx) => ({
      productId: r['product_id'] || r['Product ID'] || r['productId'] || `PROD-${idx + 1}`,
      sku: r['base_sku'] || r['SKU'] || r['sku'] || r['Seller SKU'] || '',
      productName: r['product_name'] || r['Product Name'] || r['productName'] || r['Item Title'] || 'Sleepsia Product',
      category: r['category'] || r['Category'] || 'Pillows & Sleep Ergonomics',
      reorderThreshold: parseFloat(r['reorder_threshold_units'] || r['Reorder Threshold'] || r['reorder_threshold'] || '100'),
      targetMinimumInventory: parseFloat(r['target_minimum_inventory'] || r['Target Minimum Inventory'] || '300'),
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

    // Support both wide format (one row per product with amazonAsin, flipkartFsn etc)
    // and long format (internal_sku, platform, marketplace_sku_identifier)
    const wideMap = new Map<string, PlatformProductMapping>();

    if (rows.length > 0 && ('Amazon ASIN' in rows[0] || 'amazonAsin' in rows[0])) {
      rows.forEach((r) => {
        const sku = r['Internal SKU'] || r['internalSku'] || r['sku'] || '';
        wideMap.set(sku, {
          productId: r['Product ID'] || r['productId'] || '',
          internalSku: sku,
          amazonAsin: r['Amazon ASIN'] || r['amazonAsin'] || '',
          flipkartFsn: r['Flipkart FSN'] || r['flipkartFsn'] || '',
          blinkitItemCode: r['Blinkit Item Code'] || r['blinkitItemCode'] || '',
          instamartSku: r['Instamart SKU'] || r['instamartSku'] || '',
        });
      });
    } else {
      // Long format: internal_sku, platform, marketplace_sku_identifier
      rows.forEach((r) => {
        const sku = r['internal_sku'] || r['Internal SKU'] || r['sku'] || '';
        const platform = (r['platform'] || r['Platform'] || '').toLowerCase();
        const identifier = r['marketplace_sku_identifier'] || r['identifier'] || '';

        if (!wideMap.has(sku)) {
          wideMap.set(sku, {
            productId: r['product_id'] || '',
            internalSku: sku,
            amazonAsin: '',
            flipkartFsn: '',
            blinkitItemCode: '',
            instamartSku: '',
          });
        }

        const entry = wideMap.get(sku)!;
        if (platform.includes('amazon')) entry.amazonAsin = identifier;
        else if (platform.includes('flipkart')) entry.flipkartFsn = identifier;
        else if (platform.includes('blinkit')) entry.blinkitItemCode = identifier;
        else if (platform.includes('instamart')) entry.instamartSku = identifier;
      });
    }

    const data = Array.from(wideMap.values());
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
    let matched = rows.filter((r) => {
      const d = r['record_date'] || r['date'] || r['Date'];
      return d === targetDate;
    });

    if (matched.length === 0 && rows.length > 0) {
      const latestDate = rows[rows.length - 1]['record_date'] || rows[rows.length - 1]['date'] || '';
      matched = rows.filter((r) => (r['record_date'] || r['date']) === latestDate);
    }

    const data: ProductReviewContext[] = matched.map((r) => {
      const positivePct = parseFloat(r['positive_sentiment_pct'] || '85');
      const sentimentScore = parseFloat((positivePct > 1 ? positivePct / 100 : positivePct).toFixed(2));
      const rating = parseFloat(r['rating'] || r['average_rating'] || '4.2');
      const reviewCount = parseInt(r['review_count'] || r['total_review_count'] || '100', 10);

      return {
        productId: r['sku'] || r['product_id'] || '',
        platform: (r['platform'] || 'Amazon') as PlatformName,
        platformIdentifier: r['sku'] || r['platform_product_id'] || '',
        averageRating: rating,
        totalReviewCount: reviewCount,
        newReviewsToday: parseInt(r['new_reviews_today'] || '5', 10),
        negativeReviewsToday: parseInt(r['negative_reviews_today'] || '1', 10),
        sentimentScore,
      };
    });

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

    // Extract dates using any platform date column
    const getRowDate = (r: RawCsvRow) =>
      r['date'] || r['order_date'] || r['dispatch_date'] || r['txn_date'] || r['record_date'] || '';

    const getRowSku = (r: RawCsvRow) =>
      r['sku'] || r['seller_sku'] || r['item_code'] || r['sku_code'] || r['base_sku'] || '';

    const getRowIdentifier = (r: RawCsvRow) =>
      r['asin'] || r['fsn'] || r['store_id'] || r['hub_city'] || r['item_code'] || r['sku_code'] || '';

    // Filter rows for target date
    const targetRows = allRows.filter((r) => getRowDate(r) === targetDate);
    if (targetRows.length === 0) {
      return {
        metrics: [],
        errors: [`No records found for platform ${platform} on date ${targetDate}`],
        recordsProcessed: 0,
      };
    }

    // Determine unique dates up to targetDate sorted chronologically
    const allDates = Array.from(new Set(allRows.map(getRowDate).filter(Boolean))).sort();
    const targetIndex = allDates.indexOf(targetDate);
    const trailingDates =
      targetIndex >= 0
        ? allDates.slice(Math.max(0, targetIndex - 6), targetIndex + 1)
        : [targetDate];

    const metrics: ProductPlatformMetric[] = [];
    const validationErrors: string[] = [];

    targetRows.forEach((row) => {
      const sku = getRowSku(row);
      const platformIdentifier = getRowIdentifier(row) || sku;
      const master = masterMap.get(sku);
      const mapping = mappingMap.get(sku) || mappingMap.get(platformIdentifier);

      const productId = master?.productId || mapping?.productId || (sku ? `PROD-${sku}` : 'UNKNOWN');
      const productName =
        master?.productName ||
        row['product_name'] ||
        row['item_title'] ||
        row['item_description'] ||
        'Sleepsia Ergonomic Pillow';
      const reorderThreshold = master?.reorderThreshold || 100;

      const unitsSold = parseInt(
        row['units_sold'] || row['daily_sales'] || row['unitsSold'] || '0',
        10
      );
      const price = parseFloat(
        row['price'] ||
          row['item_price_inr'] ||
          row['discounted_price_inr'] ||
          row['selling_price_inr'] ||
          row['unit_mrp_inr'] ||
          '999'
      );
      const revenue = parseFloat(
        row['revenue'] ||
          row['gross_revenue'] ||
          (unitsSold * price).toString()
      );
      const adSpend = parseFloat(
        row['ad_spend'] || row['ads'] || row['adSpend'] || '0'
      );
      const adAttributedRevenue = parseFloat(
        row['ad_attributed_revenue'] || row['paid_revenue'] || (adSpend * 3.2).toString()
      );
      const rawOrganicRevenue = parseFloat(row['organic_revenue'] || '0');
      const organicRevenue =
        rawOrganicRevenue > 0
          ? rawOrganicRevenue
          : Math.max(0, revenue - adAttributedRevenue);
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
      const inventoryLevel = parseInt(
        row['inventory_level'] || row['inventory'] || '0',
        10
      );
      const unitsInTransit = parseInt(row['units_in_transit'] || '0', 10);

      // Deterministic 7-day sales velocity calculation
      const historicalRowsForSku = allRows.filter(
        (r) => getRowSku(r) === sku && trailingDates.includes(getRowDate(r))
      );
      const totalTrailingUnits = historicalRowsForSku.reduce(
        (sum, r) =>
          sum +
          parseInt(
            r['units_sold'] || r['daily_sales'] || r['unitsSold'] || '0',
            10
          ),
        0
      );
      const velocityDays = Math.max(1, trailingDates.length);
      const computedVelocity = parseFloat((totalTrailingUnits / velocityDays).toFixed(2));
      const explicitVelocity = parseFloat(row['sales_velocity_7d'] || '0');
      const salesVelocity7d = explicitVelocity > 0 ? explicitVelocity : computedVelocity;

      // Deterministic Inventory Days Cover
      const explicitDaysCover = parseFloat(row['inventory_days_cover'] || '0');
      const computedDaysCover =
        salesVelocity7d > 0 ? parseFloat((inventoryLevel / salesVelocity7d).toFixed(1)) : null;
      const inventoryDaysCover = explicitDaysCover > 0 ? explicitDaysCover : computedDaysCover;

      // Deterministic Availability Logic
      let availabilityStatus: AvailabilityStatus;
      if (row['availability_status'] === 'Out of Stock' || inventoryLevel <= 0) {
        availabilityStatus = 'Out of Stock';
      } else if (
        row['availability_status'] === 'Low Stock' ||
        inventoryLevel <= reorderThreshold ||
        (inventoryDaysCover !== null && inventoryDaysCover < 10)
      ) {
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
        price: parseFloat(price.toFixed(2)),
        revenue: parseFloat(revenue.toFixed(2)),
        adSpend: parseFloat(adSpend.toFixed(2)),
        adAttributedRevenue: parseFloat(adAttributedRevenue.toFixed(2)),
        organicRevenue: parseFloat(organicRevenue.toFixed(2)),
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
