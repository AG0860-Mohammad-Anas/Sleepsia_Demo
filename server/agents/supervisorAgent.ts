import {
  AgentWorkflowStepLog,
  FullDailyReportResponse,
  PlatformName,
  SpecialistAgentResult,
} from '../../src/types/reporting.ts';
import { SleepsiaDataLoader } from '../data/csvDataLoader.ts';
import { EcommercePerformanceConsolidationAgent } from './consolidationAgent.ts';
import { MarketplaceSpecialistAgents } from './marketplaceAgents.ts';
import { SleepsiaReportingAgent } from './reportingAgent.ts';

export class SleepsiaReportingSupervisor {
  private loader: SleepsiaDataLoader;
  private specialists: MarketplaceSpecialistAgents;
  private consolidationAgent: EcommercePerformanceConsolidationAgent;
  private reportingAgent: SleepsiaReportingAgent;

  constructor() {
    this.loader = new SleepsiaDataLoader();
    this.specialists = new MarketplaceSpecialistAgents(this.loader);
    this.consolidationAgent = new EcommercePerformanceConsolidationAgent(this.loader);
    this.reportingAgent = new SleepsiaReportingAgent();
  }

  public async runDailyReport(targetDate: string = '2026-08-19'): Promise<FullDailyReportResponse> {
    const logs: AgentWorkflowStepLog[] = [];
    const platforms: PlatformName[] = ['Amazon', 'Flipkart', 'Blinkit', 'Instamart'];

    // Step 1: Supervisor Initialization
    const supervisorStart = Date.now();
    logs.push({
      stepId: 'step-1-supervisor',
      agentName: 'Sleepsia Reporting Supervisor',
      agentRole: 'Supervisor',
      status: 'completed',
      timestamp: new Date().toISOString(),
      durationMs: Date.now() - supervisorStart,
      message: `Supervisor initialized daily reporting run for date ${targetDate}. Delegating tasks to 4 marketplace specialist agents.`,
      details: { targetDate, targetPlatforms: platforms },
    });

    // Step 2-5: Marketplace Specialist Agents Execution
    const specialistOutputs: SpecialistAgentResult[] = [];

    for (const platform of platforms) {
      const stepStart = Date.now();
      const result = await this.specialists.runAgent(platform, targetDate);
      specialistOutputs.push(result);

      logs.push({
        stepId: `step-specialist-${platform.toLowerCase()}`,
        agentName: result.agentName,
        agentRole: 'Specialist',
        status: result.status === 'failed' ? 'failed' : 'completed',
        timestamp: new Date().toISOString(),
        durationMs: Date.now() - stepStart,
        message:
          result.status === 'failed'
            ? `${result.agentName} encountered errors: ${result.validationNotes.join(', ')}`
            : `${result.agentName} successfully processed ${result.recordsProcessed} product records from ${result.dataSource}. Revenue: ₹${result.totalRevenue.toLocaleString()}, ROAS: ${result.platformRoas}x.`,
        details: {
          platform,
          unitsSold: result.totalUnitsSold,
          revenue: result.totalRevenue,
          adSpend: result.totalAdSpend,
          roas: result.platformRoas,
          alertsCount: result.inventoryIssues.length,
        },
      });
    }

    // Step 6: Performance Consolidation Agent
    const consolidationStart = Date.now();
    const consolidatedData = this.consolidationAgent.consolidate(targetDate, specialistOutputs);
    logs.push({
      stepId: 'step-6-consolidation',
      agentName: 'E-commerce Performance Consolidation Agent',
      agentRole: 'Consolidation',
      status: 'completed',
      timestamp: new Date().toISOString(),
      durationMs: Date.now() - consolidationStart,
      message: `Consolidated performance across ${specialistOutputs.length} marketplaces. Total gross revenue: ₹${consolidatedData.kpis.totalRevenue.toLocaleString()}, Overall ROAS: ${consolidatedData.kpis.overallRoas}x, Flagged ${consolidatedData.inventoryAlerts.length} inventory alerts.`,
      details: {
        totalRevenue: consolidatedData.kpis.totalRevenue,
        totalSales: consolidatedData.kpis.totalSales,
        overallRoas: consolidatedData.kpis.overallRoas,
        productsCount: consolidatedData.productPerformance.length,
      },
    });

    // Step 7: Reporting Agent (Gemini AI Executive Intelligence)
    const reportingStart = Date.now();
    const aiIntelligence = await this.reportingAgent.generateIntelligence(consolidatedData);
    logs.push({
      stepId: 'step-7-reporting',
      agentName: 'Sleepsia Reporting Agent',
      agentRole: 'Reporting',
      status: 'completed',
      timestamp: new Date().toISOString(),
      durationMs: Date.now() - reportingStart,
      message: `Generated full 14-section executive management report with AI trend interpretation (${aiIntelligence.aiModelUsed}) and ${aiIntelligence.managementDecisionPoints.length} management action points.`,
      details: {
        aiModel: aiIntelligence.aiModelUsed,
        actionPointsCount: aiIntelligence.managementDecisionPoints.length,
      },
    });

    // Step 8: Competitor Benchmarking Intelligence
    const competitorComparison = this.loader.loadCompetitorComparison(targetDate);

    // Step 9: Final Report Completion
    logs.push({
      stepId: 'step-8-complete',
      agentName: 'Sleepsia Reporting Supervisor',
      agentRole: 'Supervisor',
      status: 'completed',
      timestamp: new Date().toISOString(),
      durationMs: 5,
      message: `Daily reporting cycle completed successfully. Report ready for employee review and export.`,
      details: {
        isComplete: consolidatedData.dataQuality.isComplete,
        totalDurationMs: logs.reduce((sum, l) => sum + l.durationMs, 0),
      },
    });

    consolidatedData.workflowLogs = logs;

    return {
      consolidatedData,
      aiIntelligence,
      competitorComparison,
      isSimulatedDemo: true,
      futureMigrationNotes: {
        amazon: 'In production, replace amazon_report_14d.csv with Amazon Selling Partner API (SP-API: Reports API & Sponsored Products API). Agent contract remains identical.',
        flipkart: 'In production, replace flipkart_report_14d.csv with Flipkart Seller API & Flipkart Ads API. Specialist agent schema remains unchanged.',
        blinkit: 'In production, replace blinkit_report_14d.csv with Blinkit Vendor Portal API / Dark Store Stock Webhooks. Specialist agent schema remains unchanged.',
        instamart: 'In production, replace instamart_report_14d.csv with Swiggy Instamart Brand Partner API. Specialist agent schema remains unchanged.',
      },
    };
  }
}
