/**
 * Create High Risk Case Tool
 * Creates a new high-risk case for special handling and review
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../client";

export function registerCreateHighRiskCaseTool(server: McpServer) {
  server.tool(
    "ledger_create_high_risk_case",
    "Create a new high-risk case requiring special underwriting attention and management",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      caseData: z.object({
        relatedEntityType: z.enum(['quote', 'policy', 'endorsement', 'claim', 'e_proposal']).describe("Type of entity this case relates to"),
        relatedEntityId: z.string().describe("ID of the related quote, policy, endorsement, claim, or e-proposal"),
        riskLevel: z.enum(['high', 'critical', 'extreme']).describe("Risk level classification"),
        riskCategories: z.array(z.string()).describe("Risk categories (e.g., ['financial', 'operational', 'regulatory', 'fraud'])"),
        riskFactors: z.array(z.object({
          category: z.string().describe("Risk factor category"),
          description: z.string().describe("Detailed description of the risk factor"),
          severity: z.enum(['low', 'medium', 'high', 'critical']).describe("Severity level"),
          evidenceUrls: z.array(z.string()).optional().describe("URLs to supporting evidence or documents")
        })).describe("Specific risk factors identified"),
        detectedBy: z.string().describe("Who or what detected this risk (user ID, system, etc.)"),
        detectionMethod: z.enum(['manual_review', 'automated_screening', 'third_party_alert', 'broker_report', 'client_disclosure']).describe("How the risk was detected"),
        priority: z.enum(['low', 'medium', 'high', 'urgent']).describe("Case priority level"),
        assignTo: z.string().optional().describe("User ID to assign the case to"),
        escalationLevel: z.enum(['standard', 'senior', 'executive', 'board']).optional().describe("Initial escalation level"),
        reviewDeadline: z.string().optional().describe("Deadline for case review (ISO date)"),
        initialNotes: z.string().optional().describe("Initial case notes or observations"),
        requiresImmediateAction: z.boolean().optional().describe("Whether case requires immediate action"),
        notifyStakeholders: z.array(z.string()).optional().describe("List of stakeholder IDs to notify")
      }).describe("High-risk case data"),
    },
    async ({ bearerToken, tenantId, caseData }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const response = await client.post(
          `/high-risk-cases`,
          caseData,
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
                  relatedEntityType: response.relatedEntityType,
                  relatedEntityId: response.relatedEntityId,
                  riskCategories: response.riskCategories,
                  priority: response.priority,
                  assignedTo: response.assignedTo,
                  escalationLevel: response.escalationLevel,
                  createdAt: response.createdAt,
                  createdBy: response.createdBy,
                  reviewDeadline: response.reviewDeadline,
                  workflow: response.workflow,
                  notificationsSent: response.notificationsSent
                },
                message: "High-risk case created successfully"
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
                error: "Failed to create high-risk case",
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