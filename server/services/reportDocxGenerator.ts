import {
  AlignmentType,
  BorderStyle,
  Document,
  HeadingLevel,
  HeightRule,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from 'docx';
import { FullDailyReportResponse } from '../../src/types/reporting.ts';

export async function generateManagementDocx(report: FullDailyReportResponse): Promise<Buffer> {
  const { consolidatedData: data, aiIntelligence: ai } = report;
  const kpis = data.kpis;

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Header / Title
          new Paragraph({
            text: 'SLEEPSIA E-COMMERCE DAILY INTELLIGENCE REPORT',
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: `Report Date: ${data.reportDate} | Generated: ${new Date(data.generatedAt).toLocaleString()}`,
                color: '555555',
                size: 20,
              }),
            ],
            spacing: { after: 240 },
          }),

          // Disclaimer Pill
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'DEMO PROTOTYPE | Multi-Marketplace Synthetic Data Consolidation | Human-in-the-Loop Decision Support',
                italics: true,
                color: '2B4C7E',
                bold: true,
                size: 18,
              }),
            ],
            spacing: { after: 300 },
          }),

          // Section 1: Executive Overview
          new Paragraph({
            text: '1. Executive Overview & Daily KPIs',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: ai.executiveOverview,
                size: 22,
              }),
            ],
            spacing: { after: 200 },
          }),

          // Top KPI Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createHeaderCell('Total Sales (Units)'),
                  createHeaderCell('Gross Revenue'),
                  createHeaderCell('Total Ad Spend'),
                  createHeaderCell('Overall ROAS'),
                  createHeaderCell('Total Returns'),
                ],
              }),
              new TableRow({
                children: [
                  createDataCell(`${kpis.totalSales.toLocaleString()} units`),
                  createDataCell(`₹${kpis.totalRevenue.toLocaleString()}`),
                  createDataCell(`₹${kpis.totalAdSpend.toLocaleString()}`),
                  createDataCell(`${kpis.overallRoas}x (ACOS ${kpis.overallAcos}%)`),
                  createDataCell(`${kpis.totalReturns} (${kpis.returnRate}%)`),
                ],
              }),
            ],
          }),

          new Paragraph({ text: '', spacing: { after: 200 } }),

          // Section 2: Platform Comparison
          new Paragraph({
            text: '2. Marketplace Channel Comparison',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 120 },
          }),
          new Paragraph({
            children: [new TextRun({ text: ai.platformObservations, size: 22 })],
            spacing: { after: 160 },
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createHeaderCell('Platform'),
                  createHeaderCell('Units Sold'),
                  createHeaderCell('Revenue (INR)'),
                  createHeaderCell('Share %'),
                  createHeaderCell('Ad Spend'),
                  createHeaderCell('ROAS'),
                  createHeaderCell('Return Rate'),
                ],
              }),
              ...data.platformPerformance.map(
                (p) =>
                  new TableRow({
                    children: [
                      createDataCell(p.platform, true),
                      createDataCell(p.unitsSold.toLocaleString()),
                      createDataCell(`₹${p.revenue.toLocaleString()}`),
                      createDataCell(`${p.revenueShare}%`),
                      createDataCell(`₹${p.adSpend.toLocaleString()}`),
                      createDataCell(`${p.roas}x`),
                      createDataCell(`${p.returnRate}%`),
                    ],
                  })
              ),
            ],
          }),

          new Paragraph({ text: '', spacing: { after: 200 } }),

          // Section 3: Product Performance Matrix
          new Paragraph({
            text: '3. Product Performance & Cross-Channel Matrix',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 120 },
          }),
          new Paragraph({
            children: [new TextRun({ text: ai.productPerformanceAnalysis, size: 22 })],
            spacing: { after: 160 },
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createHeaderCell('SKU / Product'),
                  createHeaderCell('Category'),
                  createHeaderCell('Units'),
                  createHeaderCell('Total Revenue'),
                  createHeaderCell('Ad Spend'),
                  createHeaderCell('ROAS'),
                  createHeaderCell('Stock Status'),
                  createHeaderCell('7d Velocity'),
                ],
              }),
              ...data.productPerformance.map(
                (prod) =>
                  new TableRow({
                    children: [
                      createDataCell(`${prod.productName} (${prod.sku})`, true),
                      createDataCell(prod.category),
                      createDataCell(prod.totalUnitsSold.toLocaleString()),
                      createDataCell(`₹${prod.totalRevenue.toLocaleString()}`),
                      createDataCell(`₹${prod.totalAdSpend.toLocaleString()}`),
                      createDataCell(`${prod.overallRoas}x`),
                      createDataCell(prod.overallAvailability),
                      createDataCell(`${prod.salesVelocity7dTotal} /day`),
                    ],
                  })
              ),
            ],
          }),

          new Paragraph({ text: '', spacing: { after: 200 } }),

          // Section 4: Advertising Efficiency & ROAS Analysis
          new Paragraph({
            text: '4. Advertising Efficiency & Attribution Analysis',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 120 },
          }),
          new Paragraph({
            children: [new TextRun({ text: ai.advertisingEfficiencyAnalysis, size: 22 })],
            spacing: { after: 200 },
          }),

          // Section 5: Inventory & Stock Risk Alerts
          new Paragraph({
            text: '5. Inventory & Channel Availability Alerts',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 120 },
          }),
          new Paragraph({
            children: [new TextRun({ text: ai.inventoryAndRiskAnalysis, size: 22 })],
            spacing: { after: 160 },
          }),

          ...(data.inventoryAlerts.length > 0
            ? [
                new Table({
                  width: { size: 100, type: WidthType.PERCENTAGE },
                  rows: [
                    new TableRow({
                      children: [
                        createHeaderCell('Product / SKU'),
                        createHeaderCell('Platform'),
                        createHeaderCell('Current Stock'),
                        createHeaderCell('Reorder Limit'),
                        createHeaderCell('Days Cover'),
                        createHeaderCell('Status & Impact'),
                      ],
                    }),
                    ...data.inventoryAlerts.map(
                      (alert) =>
                        new TableRow({
                          children: [
                            createDataCell(alert.productName, true),
                            createDataCell(alert.platform),
                            createDataCell(`${alert.inventoryLevel} units`),
                            createDataCell(`${alert.reorderThreshold} units`),
                            createDataCell(alert.daysCover !== null ? `${alert.daysCover} days` : 'N/A'),
                            createDataCell(`${alert.status}: ${alert.reason}`),
                          ],
                        })
                    ),
                  ],
                }),
              ]
            : [new Paragraph({ text: 'All products currently within safety stock thresholds.' })]),

          new Paragraph({ text: '', spacing: { after: 200 } }),

          // Section 6: Customer Reviews & Quality Sentiment
          new Paragraph({
            text: '6. Reviews, Ratings & Product Quality Sentiment',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 120 },
          }),
          new Paragraph({
            children: [new TextRun({ text: ai.reviewsAndCustomerSentimentAnalysis, size: 22 })],
            spacing: { after: 200 },
          }),

          // Section 7: Management Decision Action Points
          new Paragraph({
            text: '7. Management Decision Checklist (Action Items for Review)',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'NOTE: These items are structured decision-support recommendations. Autonomous budget or campaign modifications are strictly disabled in this system.',
                italics: true,
                color: '666666',
                size: 20,
              }),
            ],
            spacing: { after: 140 },
          }),
          ...ai.managementDecisionPoints.map(
            (point, idx) =>
              new Paragraph({
                bullet: { level: 0 },
                children: [
                  new TextRun({ text: `Action ${idx + 1}: `, bold: true }),
                  new TextRun({ text: point, size: 22 }),
                ],
                spacing: { after: 100 },
              })
          ),

          new Paragraph({ text: '', spacing: { after: 200 } }),

          // Section 8: Data Integrity & Future Architecture Note
          new Paragraph({
            text: '8. Data Integrity & Production API Migration Guide',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 120 },
          }),
          new Paragraph({
            children: [new TextRun({ text: ai.dataIntegrityStatement, size: 20, italics: true })],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Future Production Migration: In production, the 4 marketplace specialist agents will connect directly to Amazon Selling Partner API (SP-API), Flipkart Seller API, Blinkit Vendor Portal Webhooks, and Swiggy Instamart Brand Partner API without altering supervisor orchestration, consolidation logic, or reporting formatting.',
                size: 20,
              }),
            ],
            spacing: { after: 200 },
          }),
        ],
      },
    ],
  });

  return await Packer.toBuffer(doc);
}

function createHeaderCell(text: string): TableCell {
  return new TableCell({
    shading: { fill: '1E3A8A' },
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text, bold: true, color: 'FFFFFF', size: 18 })],
      }),
    ],
  });
}

function createDataCell(text: string, isBold: boolean = false): TableCell {
  return new TableCell({
    children: [
      new Paragraph({
        children: [new TextRun({ text, bold: isBold, size: 18 })],
      }),
    ],
  });
}
