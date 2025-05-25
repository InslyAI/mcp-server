/**
 * Set Claim Reserve Tool
 * Sets or updates the financial reserve amount for a claim
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../client";

export function registerSetClaimReserveTool(server: McpServer) {
  server.tool(
    "ledger_set_claim_reserve",
    "Set or update the financial reserve amount for an insurance claim with detailed justification",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      claimId: z.string().describe("ID of the claim to set reserve for"),
      reserveDetails: z.object({
        reserveAmount: z.number().describe("New reserve amount to set"),
        currency: z.string().describe("Currency code (e.g., 'USD', 'EUR')"),
        reserveType: z.enum(['case_reserve', 'expense_reserve', 'total_reserve', 'ibnr_reserve']).describe("Type of reserve being set"),
        justification: z.string().describe("Detailed justification for the reserve amount"),
        assessmentBasis: z.enum(['initial_estimate', 'adjuster_assessment', 'expert_evaluation', 'repair_estimate', 'settlement_negotiation', 'legal_advice']).describe("Basis for the reserve assessment"),
        confidenceLevel: z.enum(['low', 'medium', 'high']).describe("Confidence level in the reserve estimate"),
        reserveComponents: z.array(z.object({
          component: z.string().describe("Component description (e.g., 'Property damage', 'Medical expenses', 'Legal fees')"),
          amount: z.number().describe("Amount allocated to this component"),
          notes: z.string().optional().describe("Notes about this component")
        })).optional().describe("Breakdown of reserve components"),
        previousReserveAmount: z.number().optional().describe("Previous reserve amount (for reference)"),
        adjustmentReason: z.string().optional().describe("Reason for reserve adjustment if this is an update"),
        effectiveDate: z.string().optional().describe("Effective date for the reserve (ISO date, defaults to current)"),
        reviewDate: z.string().optional().describe("Date when reserve should be reviewed next (ISO date)"),
        setBy: z.string().describe("User ID of person setting the reserve"),
        approvalRequired: z.boolean().optional().describe("Whether managerial approval is required"),
        approvedBy: z.string().optional().describe("User ID of approver if approval was obtained"),
        specialConsiderations: z.array(z.string()).optional().describe("Special considerations affecting the reserve"),
        riskFactors: z.array(z.string()).optional().describe("Risk factors that influenced reserve amount"),
        documentReferences: z.array(z.string()).optional().describe("References to supporting documents"),
        automaticReviewTriggers: z.object({
          timeBasedReview: z.number().optional().describe("Days after which to trigger automatic review"),
          percentageChangeThreshold: z.number().optional().describe("Percentage change threshold for automatic review"),
          statusChangeReview: z.boolean().optional().describe("Whether to review when claim status changes")
        }).optional().describe("Automatic review triggers")
      }).describe("Reserve setting details"),
    },
    async ({ bearerToken, tenantId, claimId, reserveDetails }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const response = await client.post(
          `/claims/${claimId}/reserve`,
          reserveDetails,
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
                reserve: {
                  claimId: response.claimId,
                  claimNumber: response.claimNumber,
                  reserveId: response.reserveId,
                  reserveAmount: response.reserveAmount,
                  currency: response.currency,
                  reserveType: response.reserveType,
                  previousAmount: response.previousAmount,
                  changeAmount: response.changeAmount,
                  changePercentage: response.changePercentage,
                  effectiveDate: response.effectiveDate,
                  setAt: response.setAt,
                  setBy: response.setBy,
                  setByName: response.setByName,
                  justification: response.justification,
                  assessmentBasis: response.assessmentBasis,
                  confidenceLevel: response.confidenceLevel,
                  approvalStatus: response.approvalStatus,
                  approvedBy: response.approvedBy,
                  approvedByName: response.approvedByName,
                  reviewDate: response.reviewDate,
                  reserveComponents: response.reserveComponents,
                  totalClaimFinancials: {
                    totalReserve: response.totalClaimFinancials.totalReserve,
                    paidAmount: response.totalClaimFinancials.paidAmount,
                    outstandingReserve: response.totalClaimFinancials.outstandingReserve,
                    projectedTotal: response.totalClaimFinancials.projectedTotal
                  },
                  automaticReviewScheduled: response.automaticReviewScheduled,
                  nextReviewDate: response.nextReviewDate,
                  workflowStatus: response.workflowStatus
                },
                message: "Claim reserve set successfully"
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
                error: "Failed to set claim reserve",
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