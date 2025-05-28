/**
 * Generate Report Tool
 * Generates business reports with various data sources and formats
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../client";

export function registerGenerateReportTool(server: McpServer) {
  server.tool(
    "ledger_reports_generate",
    "Generate comprehensive business reports with various data sources and output formats",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      reportConfig: z.object({
        reportType: z.enum([
          'financial_summary',
          'underwriting_performance',
          'claims_analysis',
          'broker_performance',
          'product_analysis',
          'risk_assessment',
          'compliance_audit',
          'renewal_pipeline',
          'premium_analysis',
          'loss_ratio',
          'custom'
        ]).describe("Type of report to generate"),
        title: z.string().describe("Report title"),
        description: z.string().optional().describe("Report description"),
        dateRange: z.object({
          startDate: z.string().describe("Report start date (ISO date)"),
          endDate: z.string().describe("Report end date (ISO date)"),
          period: z.enum(['daily', 'weekly', 'monthly', 'quarterly', 'yearly']).optional().describe("Period granularity")
        }).describe("Date range for the report"),
        filters: z.object({
          productIds: z.array(z.string()).optional().describe("Filter by specific product IDs"),
          brokerIds: z.array(z.string()).optional().describe("Filter by specific broker IDs"),
          policyStatuses: z.array(z.string()).optional().describe("Filter by policy statuses"),
          riskLevels: z.array(z.string()).optional().describe("Filter by risk levels"),
          regions: z.array(z.string()).optional().describe("Filter by geographic regions"),
          customFilters: z.record(z.any()).optional().describe("Custom filter criteria")
        }).optional().describe("Report filters"),
        format: z.enum(['pdf', 'excel', 'csv', 'json', 'html']).describe("Output format"),
        includeCharts: z.boolean().optional().describe("Whether to include charts and visualizations"),
        includeRawData: z.boolean().optional().describe("Whether to include raw data appendix"),
        aggregationLevel: z.enum(['summary', 'detailed', 'granular']).optional().describe("Level of data aggregation"),
        groupBy: z.array(z.string()).optional().describe("Fields to group data by"),
        metrics: z.array(z.string()).optional().describe("Specific metrics to include"),
        customQuery: z.string().optional().describe("Custom SQL query for advanced reports"),
        recipients: z.array(z.string()).optional().describe("Email addresses to send report to"),
        confidentialityLevel: z.enum(['public', 'internal', 'restricted', 'confidential']).optional().describe("Report confidentiality level")
      }).describe("Report generation configuration"),
    },
    async ({ bearerToken, tenantId, reportConfig }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const response = await client.post(
          `/reports/generate`,
          reportConfig,
          {
            "Accept-Language": "en"
          }
        );

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                report: {
                  id: response.id,
                  reportNumber: response.reportNumber,
                  title: response.title,
                  reportType: response.reportType,
                  status: response.status,
                  format: response.format,
                  generatedAt: response.generatedAt,
                  generatedBy: response.generatedBy,
                  dateRange: response.dateRange,
                  recordCount: response.recordCount,
                  fileSize: response.fileSize,
                  downloadUrl: response.downloadUrl,
                  expiresAt: response.expiresAt,
                  confidentialityLevel: response.confidentialityLevel,
                  processingTime: response.processingTime,
                  recipientsSent: response.recipientsSent
                },
                message: "Report generated successfully"
              }, null, 2)
            }
          ]
        };
      } catch (error: any) {
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: false,
                error: "Failed to generate report",
                details: error.message,
                statusCode: error.status
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}