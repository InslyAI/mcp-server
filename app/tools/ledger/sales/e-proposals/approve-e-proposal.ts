/**
 * Approve E-proposal Tool
 * Approves or rejects an e-proposal after underwriting review
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../../client";

export function registerApproveEProposalTool(server: McpServer) {
  server.tool(
    "ledger_approve_e_proposal",
    "Approve or reject an electronic proposal after underwriting review with decision details",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      proposalId: z.string().describe("ID of the e-proposal to approve/reject"),
      decision: z.object({
        action: z.enum(['approve', 'reject', 'request_more_info', 'conditional_approval']).describe("Underwriting decision"),
        approvalTerms: z.object({
          premiumAdjustment: z.number().optional().describe("Premium adjustment percentage"),
          deductibleChanges: z.record(z.any()).optional().describe("Required deductible changes"),
          coverageLimitations: z.array(z.string()).optional().describe("Coverage limitations or exclusions"),
          specialConditions: z.array(z.string()).optional().describe("Special conditions or requirements"),
          policyTerm: z.string().optional().describe("Approved policy term if different from requested"),
        }).optional().describe("Approval terms and conditions"),
        rejectionReasons: z.array(z.string()).optional().describe("Reasons for rejection"),
        requestedInformation: z.array(z.string()).optional().describe("Additional information needed"),
        underwriterComments: z.string().optional().describe("Detailed underwriter comments"),
        reviewedBy: z.string().describe("Underwriter ID making the decision"),
        decisionDate: z.string().optional().describe("Decision date (ISO date, defaults to current)"),
        notifyBroker: z.boolean().optional().describe("Whether to notify broker of decision"),
        generateQuote: z.boolean().optional().describe("Whether to auto-generate quote if approved")
      }).describe("Underwriting decision and terms"),
    },
    async ({ bearerToken, tenantId, proposalId, decision }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const response = await client.post(
          `/e-proposals/${proposalId}/decision`,
          decision,
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
                decision: {
                  proposalId: response.proposalId,
                  proposalNumber: response.proposalNumber,
                  action: response.action,
                  status: response.status,
                  decisionDate: response.decisionDate,
                  reviewedBy: response.reviewedBy,
                  underwriterComments: response.underwriterComments,
                  ...(response.action === 'approve' && {
                    approvalTerms: response.approvalTerms,
                    quoteId: response.quoteId
                  }),
                  ...(response.action === 'reject' && {
                    rejectionReasons: response.rejectionReasons
                  }),
                  ...(response.action === 'request_more_info' && {
                    requestedInformation: response.requestedInformation
                  }),
                  ...(response.action === 'conditional_approval' && {
                    conditions: response.conditions
                  }),
                  workflowStage: response.workflowStage,
                  notificationsSent: response.notificationsSent
                },
                message: `E-proposal ${response.action === 'approve' ? 'approved' : response.action === 'reject' ? 'rejected' : 'processed'} successfully`
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
                error: "Failed to process e-proposal decision",
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