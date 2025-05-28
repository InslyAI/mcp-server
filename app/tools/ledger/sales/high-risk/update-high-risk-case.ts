/**
 * Update High Risk Case Tool
 * Updates an existing high-risk case with new information or status changes
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createLedgerClient } from "../../client";

export function registerUpdateHighRiskCaseTool(server: McpServer) {
  server.tool(
    "ledger_sales_high_risk_update",
    "Update an existing high-risk case using new information, status changes, or additional risk factors for accurate record management",
    {
      bearerToken: z.string().min(1).describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      caseId: z.string().min(1).describe("ID of the high-risk case to update"),
      updateData: z.object({
        status: z.enum(['open', 'under_review', 'pending_decision', 'approved', 'declined', 'escalated', 'resolved']).optional().describe("Updated case status"),
        riskLevel: z.enum(['high', 'critical', 'extreme']).optional().describe("Updated risk level classification"),
        priority: z.enum(['low', 'medium', 'high', 'urgent']).optional().describe("Updated case priority"),
        assignTo: z.string().optional().describe("Reassign case to different user ID"),
        escalationLevel: z.enum(['standard', 'senior', 'executive', 'board']).optional().describe("Updated escalation level"),
        reviewDeadline: z.string().optional().describe("Updated review deadline (ISO date)"),
        additionalRiskFactors: z.array(z.object({
          category: z.string().describe("Risk factor category"),
          description: z.string().describe("Detailed description of the risk factor"),
          severity: z.enum(['low', 'medium', 'high', 'critical']).describe("Severity level"),
          evidenceUrls: z.array(z.string()).optional().describe("URLs to supporting evidence")
        })).optional().describe("Additional risk factors to add"),
        resolution: z.object({
          decision: z.enum(['approved', 'declined', 'conditional_approval', 'escalated', 'referred']).describe("Final decision"),
          reasoning: z.string().describe("Detailed reasoning for the decision"),
          conditions: z.array(z.string()).optional().describe("Conditions if conditionally approved"),
          mitigationMeasures: z.array(z.string()).optional().describe("Risk mitigation measures implemented"),
          resolvedBy: z.string().describe("User ID who resolved the case"),
          resolvedAt: z.string().optional().describe("Resolution date (ISO date, defaults to current)")
        }).optional().describe("Case resolution details"),
        notes: z.string().optional().describe("Additional case notes"),
        notifyStakeholders: z.boolean().optional().describe("Whether to notify stakeholders of updates")
      }).describe("Data to update in the high-risk case"),
    },
    async ({ bearerToken, tenantId, caseId, updateData }) => {
      try {
        const client = createLedgerClient(bearerToken, tenantId);
        
        const response = await client.put(
          `/high-risk-cases/${caseId}`,
          updateData,
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
                highRiskCase: {
                  id: response.id,
                  caseNumber: response.caseNumber,
                  status: response.status,
                  riskLevel: response.riskLevel,
                  riskScore: response.riskScore,
                  priority: response.priority,
                  assignedTo: response.assignedTo,
                  escalationLevel: response.escalationLevel,
                  lastUpdated: response.lastUpdated,
                  updatedBy: response.updatedBy,
                  reviewDeadline: response.reviewDeadline,
                  workflow: response.workflow,
                  resolution: response.resolution,
                  notificationsSent: response.notificationsSent
                },
                message: "High-risk case updated successfully"
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
                error: "Failed to update high-risk case",
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