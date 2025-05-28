/**
 * Schedule Report Tool
 * Schedules automatic generation of reports on recurring basis
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createLedgerClient } from "../client";

export function registerScheduleReportTool(server: McpServer) {
  server.tool(
    "ledger_reports_schedule",
    "Schedule automatic generation of business reports on a recurring basis with customizable parameters",
    {
      bearerToken: z.string().min(1).describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      scheduleConfig: z.object({
        name: z.string().describe("Name for the scheduled report"),
        description: z.string().optional().describe("Description of the scheduled report"),
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
          title: z.string().describe("Report title template (can include date placeholders)"),
          format: z.enum(['pdf', 'excel', 'csv', 'json', 'html']).describe("Output format"),
          filters: z.object({
            productIds: z.array(z.string()).optional(),
            brokerIds: z.array(z.string()).optional(),
            policyStatuses: z.array(z.string()).optional(),
            riskLevels: z.array(z.string()).optional(),
            regions: z.array(z.string()).optional(),
            customFilters: z.record(z.any()).optional()
          }).optional().describe("Static filters to apply"),
          includeCharts: z.boolean().optional().describe("Whether to include charts"),
          aggregationLevel: z.enum(['summary', 'detailed', 'granular']).optional(),
          confidentialityLevel: z.enum(['public', 'internal', 'restricted', 'confidential']).optional()
        }).describe("Report generation configuration"),
        schedule: z.object({
          frequency: z.enum(['daily', 'weekly', 'monthly', 'quarterly', 'yearly']).describe("How often to generate the report"),
          startDate: z.string().describe("When to start generating reports (ISO date)"),
          endDate: z.string().optional().describe("When to stop generating reports (ISO date, optional for indefinite)"),
          timeOfDay: z.string().optional().describe("Time of day to generate (HH:MM format, default: 09:00)"),
          dayOfWeek: z.number().optional().describe("Day of week for weekly reports (0=Sunday, 1=Monday, etc.)"),
          dayOfMonth: z.number().optional().describe("Day of month for monthly reports (1-31)"),
          timezone: z.string().optional().describe("Timezone for scheduling (default: UTC)")
        }).describe("Schedule configuration"),
        recipients: z.array(z.object({
          email: z.string().email().describe("Recipient email address"),
          role: z.string().optional().describe("Recipient role/title"),
          deliveryMethod: z.enum(['email_attachment', 'email_link', 'portal_notification']).optional().describe("How to deliver the report")
        })).optional().describe("Report recipients"),
        retentionDays: z.number().optional().describe("How many days to keep generated reports (default: 30)"),
        enabled: z.boolean().optional().describe("Whether the schedule is active (default: true)"),
        alertOnFailure: z.boolean().optional().describe("Whether to send alerts if generation fails"),
        customParameters: z.record(z.any()).optional().describe("Custom parameters for advanced scheduling")
      }).describe("Schedule configuration"),
    },
    async ({ bearerToken, tenantId, scheduleConfig }) => {
      try {
        const client = createLedgerClient(bearerToken, tenantId);
        
        const response = await client.post(
          `/reports/schedules`,
          scheduleConfig,
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
                schedule: {
                  id: response.id,
                  name: response.name,
                  description: response.description,
                  reportType: response.reportConfig.reportType,
                  frequency: response.schedule.frequency,
                  startDate: response.schedule.startDate,
                  endDate: response.schedule.endDate,
                  nextRunAt: response.nextRunAt,
                  timezone: response.schedule.timezone,
                  enabled: response.enabled,
                  createdAt: response.createdAt,
                  createdBy: response.createdBy,
                  recipients: response.recipients,
                  retentionDays: response.retentionDays,
                  runsCompleted: response.runsCompleted,
                  lastRunAt: response.lastRunAt,
                  lastRunStatus: response.lastRunStatus
                },
                message: "Report schedule created successfully"
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
                error: "Failed to create report schedule",
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