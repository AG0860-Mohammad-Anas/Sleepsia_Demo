import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { SleepsiaReportingSupervisor } from './server/agents/supervisorAgent.ts';
import { SleepsiaDataLoader } from './server/data/csvDataLoader.ts';
import { generateManagementDocx } from './server/services/reportDocxGenerator.ts';

dotenv.config();

const PORT = 3000;

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  const dataLoader = new SleepsiaDataLoader();
  const supervisor = new SleepsiaReportingSupervisor();

  // API Routes FIRST
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'Sleepsia E-Commerce Daily Intelligence API',
      timestamp: new Date().toISOString(),
      hasGeminiApiKey: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  // Get available dates from historical data
  app.get('/api/dates', (req, res) => {
    try {
      const dates = dataLoader.getAvailableDates();
      res.json({ dates });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Run the multi-agent daily reporting workflow
  app.post('/api/run-report', async (req, res) => {
    try {
      const targetDate = req.body.date || '2026-08-19';
      const result = await supervisor.runDailyReport(targetDate);
      res.json(result);
    } catch (err: any) {
      console.error('Error running daily report:', err);
      res.status(500).json({ error: err.message || 'Failed to generate report' });
    }
  });

  // Export report to Microsoft Word .docx
  app.post('/api/export-docx', async (req, res) => {
    try {
      let reportData = req.body.reportData;
      if (!reportData) {
        const targetDate = req.body.date || '2026-08-19';
        reportData = await supervisor.runDailyReport(targetDate);
      }

      const docxBuffer = await generateManagementDocx(reportData);
      const filename = `Sleepsia_Daily_Report_${reportData.consolidatedData.reportDate}.docx`;

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(docxBuffer);
    } catch (err: any) {
      console.error('Error exporting DOCX:', err);
      res.status(500).json({ error: err.message || 'Failed to export DOCX' });
    }
  });

  // Synthetic files metadata & dictionary inspection
  app.get('/api/synthetic-files', (req, res) => {
    try {
      const { data: master } = dataLoader.loadProductMaster();
      const { data: mappings } = dataLoader.loadPlatformMapping();
      res.json({
        files: [
          { name: 'amazon_report_14d.csv', type: 'Marketplace operational data (14 days)' },
          { name: 'flipkart_report_14d.csv', type: 'Marketplace operational data (14 days)' },
          { name: 'blinkit_report_14d.csv', type: 'Quick-commerce dark store metrics (14 days)' },
          { name: 'instamart_report_14d.csv', type: 'Quick-commerce metro metrics (14 days)' },
          { name: 'reviews_rating_data_14d.csv', type: 'Customer reviews & sentiment (14 days)' },
          { name: 'product_master.csv', type: 'Product catalog & reorder thresholds' },
          { name: 'platform_product_mapping.csv', type: 'ASIN/FSN/SKU multi-channel mapping' },
          { name: 'data_dictionary.csv', type: 'Operational field definitions & formulas' },
        ],
        productMaster: master,
        platformMappings: mappings,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Sleepsia Intelligence Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
