/**
 * Submit E-proposal Tool
 * Submits an e-proposal for underwriting review and approval
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../../client";

export function registerSubmitEProposalTool(server: McpServer) {
  server.tool(
    "ledger_sales_e_proposals_submit",
    "Submit an electronic proposal for underwriting review and approval workflow",
    {
      bearerToken: z.string().min(1).describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      proposalId: z.string().min(1).describe("ID of the e-proposal to submit"),
      submissionData: z.object({
        underwriterAssignment: z.string().optional().describe("Specific underwriter to assign (if not auto-assigned)"),
        submissionComments: z.string().optional().describe("Additional comments for underwriter"),
        requestedReviewDate: z.string().optional().describe("Requested review completion date (ISO date)"),
        escalationLevel: z.enum(['standard', 'expedited', 'emergency']).optional().describe("Review escalation level"),
        notifyBroker: z.boolean().optional().describe("Whether to notify broker of submission"),
        attachFinalDocuments: z.boolean().optional().describe("Whether to attach all supporting documents"),
        certifyCompleteness: z.boolean().describe("Broker certifies proposal is complete and accurate")
      }).describe("Submission configuration"),
    },
    async ({ bearerToken, tenantId, proposalId, submissionData }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const response = await client.post(
          `/e-proposals/${proposalId}/submit`,
          submissionData,
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
                submission: {
                  proposalId: response.proposalId,
                  proposalNumber: response.proposalNumber,
                  status: response.status,
                  submittedAt: response.submittedAt,
                  submittedBy: response.submittedBy,
                  assignedUnderwriter: response.assignedUnderwriter,
                  reviewQueue: response.reviewQueue,
                  targetReviewDate: response.targetReviewDate,
                  workflowStage: response.workflowStage,
                  referenceNumber: response.referenceNumber,
                  notificationsSent: response.notificationsSent
                },
                message: "E-proposal submitted successfully for underwriting review"
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
                error: "Failed to submit e-proposal",
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