/**
 * Get Compliance Report Tool
 * Generates compliance reports for regulatory requirements
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../client";

export function registerGetComplianceReportTool(server: McpServer) {
  server.tool(
    "ledger_get_compliance_report",
    "Generate comprehensive compliance reports for regulatory requirements and internal audits",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      reportConfig: z.object({
        reportType: z.enum([
          'sarbanes_oxley',
          'gdpr_compliance',
          'hipaa_compliance',
          'pci_dss',
          'iso_27001',
          'soc2',
          'data_retention',
          'access_control',
          'change_management',
          'incident_response',
          'custom'
        ]).describe("Type of compliance report to generate"),
        dateRange: z.object({
          startDate: z.string().describe("Report start date (ISO date)"),
          endDate: z.string().describe("Report end date (ISO date)")
        }).describe("Date range for the compliance report"),
        scope: z.object({
          includeUserActivity: z.boolean().optional().describe("Include user activity analysis"),
          includeDataAccess: z.boolean().optional().describe("Include data access patterns"),
          includeSystemChanges: z.boolean().optional().describe("Include system configuration changes"),
          includeSecurityEvents: z.boolean().optional().describe("Include security-related events"),
          includePrivilegedOperations: z.boolean().optional().describe("Include privileged user operations"),
          includePolicyChanges: z.boolean().optional().describe("Include policy and procedure changes"),
          specificEntities: z.array(z.string()).optional().describe("Specific entity IDs to focus on"),
          specificUsers: z.array(z.string()).optional().describe("Specific user IDs to include"),
          departments: z.array(z.string()).optional().describe("Specific departments to include")
        }).optional().describe("Report scope configuration"),
        format: z.enum(['pdf', 'excel', 'csv', 'json']).describe("Output format for the report"),
        detailLevel: z.enum(['summary', 'detailed', 'comprehensive']).describe("Level of detail in the report"),
        includeRecommendations: z.boolean().optional().describe("Whether to include compliance recommendations"),
        includeMetrics: z.boolean().optional().describe("Whether to include compliance metrics and KPIs"),
        includeCharts: z.boolean().optional().describe("Whether to include visual charts and graphs"),
        anonymizeData: z.boolean().optional().describe("Whether to anonymize personal data in the report"),
        customCriteria: z.array(z.object({
          criterion: z.string().describe("Custom compliance criterion"),
          weight: z.number().optional().describe("Weight/importance of this criterion"),
          threshold: z.any().optional().describe("Threshold value for compliance")
        })).optional().describe("Custom compliance criteria"),
        regulatoryFramework: z.string().optional().describe("Specific regulatory framework or standard"),
        certificationBody: z.string().optional().describe("Certification body if applicable"),
        auditPurpose: z.enum(['internal_audit', 'external_audit', 'certification', 'regulatory_filing', 'due_diligence']).optional().describe("Purpose of the audit/report"),
        confidentialityLevel: z.enum(['public', 'internal', 'restricted', 'confidential']).optional().describe("Confidentiality classification")
      }).describe("Compliance report configuration"),
    },
    async ({ bearerToken, tenantId, reportConfig }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const response = await client.post(
          `/audit/compliance-report`,
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
                complianceReport: {
                  id: response.id,
                  reportNumber: response.reportNumber,
                  reportType: response.reportType,
                  generatedAt: response.generatedAt,
                  generatedBy: response.generatedBy,
                  dateRange: response.dateRange,
                  format: response.format,
                  status: response.status,
                  summary: {
                    totalEvents: response.summary.totalEvents,
                    complianceScore: response.summary.complianceScore,
                    criticalFindings: response.summary.criticalFindings,
                    riskLevel: response.summary.riskLevel,
                    nonComplianceIssues: response.summary.nonComplianceIssues,
                    recommendationsCount: response.summary.recommendationsCount
                  },
                  findings: response.findings.map((finding: any) => ({
                    id: finding.id,
                    severity: finding.severity,
                    category: finding.category,
                    description: finding.description,
                    impact: finding.impact,
                    recommendation: finding.recommendation,
                    riskRating: finding.riskRating,
                    remediation: finding.remediation
                  })),
                  metrics: response.metrics,
                  downloadUrl: response.downloadUrl,
                  expiresAt: response.expiresAt,
                  confidentialityLevel: response.confidentialityLevel,
                  auditTrail: response.auditTrail,
                  certificationStatus: response.certificationStatus
                },
                message: "Compliance report generated successfully"
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
                error: "Failed to generate compliance report",
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