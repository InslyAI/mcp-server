/**
 * Escalate High Risk Case Tool
 * Escalates a high-risk case to higher authority levels for review
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../../client";

export function registerEscalateHighRiskCaseTool(server: McpServer) {
  server.tool(
    "ledger_escalate_high_risk_case",
    "Escalate a high-risk case to higher authority levels for specialized review and decision-making",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      caseId: z.string().describe("ID of the high-risk case to escalate"),
      escalationData: z.object({
        escalateTo: z.enum(['senior', 'executive', 'board', 'external_expert']).describe("Escalation level to escalate to"),
        reason: z.string().describe("Detailed reason for escalation"),
        urgency: z.enum(['normal', 'urgent', 'critical']).describe("Urgency level of the escalation"),
        requestedBy: z.string().describe("User ID requesting the escalation"),
        specificRecipient: z.string().optional().describe("Specific person/role to escalate to (if not automatic assignment)"),
        additionalContext: z.string().optional().describe("Additional context for the escalation"),
        attachedDocuments: z.array(z.string()).optional().describe("Document IDs to attach to escalation"),
        deadlineForResponse: z.string().optional().describe("Requested response deadline (ISO date)"),
        escalationNotes: z.string().optional().describe("Notes for the escalated authority"),
        riskImpact: z.object({
          financial: z.string().optional().describe("Potential financial impact"),
          reputational: z.string().optional().describe("Potential reputational impact"),
          regulatory: z.string().optional().describe("Potential regulatory impact"),
          operational: z.string().optional().describe("Potential operational impact")
        }).optional().describe("Detailed risk impact assessment"),
        recommendedAction: z.string().optional().describe("Recommended action for the escalated authority"),
        previousEscalations: z.boolean().optional().describe("Whether this case has been previously escalated"),
        notifyStakeholders: z.array(z.string()).optional().describe("Additional stakeholders to notify of escalation")
      }).describe("Escalation configuration and context"),
    },
    async ({ bearerToken, tenantId, caseId, escalationData }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const response = await client.post(
          `/high-risk-cases/${caseId}/escalate`,
          escalationData,
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
                escalation: {
                  caseId: response.caseId,
                  caseNumber: response.caseNumber,
                  escalationId: response.escalationId,
                  escalatedTo: response.escalatedTo,
                  escalatedToName: response.escalatedToName,
                  escalationLevel: response.escalationLevel,
                  escalatedAt: response.escalatedAt,
                  escalatedBy: response.escalatedBy,
                  escalatedByName: response.escalatedByName,
                  urgency: response.urgency,
                  status: response.status,
                  deadlineForResponse: response.deadlineForResponse,
                  reason: response.reason,
                  workflow: response.workflow,
                  notificationsSent: response.notificationsSent,
                  trackingNumber: response.trackingNumber,
                  caseStatus: response.caseStatus
                },
                message: "High-risk case escalated successfully"
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
                error: "Failed to escalate high-risk case",
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