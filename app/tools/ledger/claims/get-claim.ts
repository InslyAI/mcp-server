/**
 * Get Claim Tool
 * Retrieves detailed information about a specific insurance claim
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../client";

export function registerGetClaimTool(server: McpServer) {
  server.tool(
    "ledger_get_claim",
    "Get comprehensive information about a specific insurance claim including all details and history",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      claimId: z.string().describe("ID of the claim to retrieve"),
      includeHistory: z.boolean().optional().describe("Whether to include claim processing history"),
      includeDocuments: z.boolean().optional().describe("Whether to include document metadata"),
      includePayments: z.boolean().optional().describe("Whether to include payment history"),
      includeNotes: z.boolean().optional().describe("Whether to include adjuster and internal notes"),
      includePolicy: z.boolean().optional().describe("Whether to include related policy details"),
    },
    async ({ bearerToken, tenantId, claimId, includeHistory, includeDocuments, includePayments, includeNotes, includePolicy }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const queryParams = new URLSearchParams();
        if (includeHistory) queryParams.append('include_history', 'true');
        if (includeDocuments) queryParams.append('include_documents', 'true');
        if (includePayments) queryParams.append('include_payments', 'true');
        if (includeNotes) queryParams.append('include_notes', 'true');
        if (includePolicy) queryParams.append('include_policy', 'true');
        
        const endpoint = `/claims/${claimId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        
        const response = await client.get(endpoint);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                claim: {
                  id: response.id,
                  claimNumber: response.claimNumber,
                  status: response.status,
                  claimType: response.claimType,
                  severity: response.severity,
                  priority: response.priority,
                  policyId: response.policyId,
                  policyNumber: response.policyNumber,
                  lossDetails: response.lossDetails,
                  claimantInformation: response.claimantInformation,
                  damageAssessment: response.damageAssessment,
                  reportingDetails: response.reportingDetails,
                  financials: {
                    estimatedAmount: response.financials.estimatedAmount,
                    reserveAmount: response.financials.reserveAmount,
                    paidAmount: response.financials.paidAmount,
                    outstandingAmount: response.financials.outstandingAmount,
                    recoveryAmount: response.financials.recoveryAmount,
                    currency: response.financials.currency
                  },
                  assignedAdjuster: response.assignedAdjuster,
                  adjusterName: response.adjusterName,
                  adjusterContact: response.adjusterContact,
                  investigationStatus: response.investigationStatus,
                  settlementStatus: response.settlementStatus,
                  createdAt: response.createdAt,
                  updatedAt: response.updatedAt,
                  closedAt: response.closedAt,
                  daysOpen: response.daysOpen,
                  workflow: response.workflow,
                  currentStage: response.currentStage,
                  thirdPartyInformation: response.thirdPartyInformation,
                  specialInstructions: response.specialInstructions,
                  relatedClaims: response.relatedClaims,
                  ...(includeHistory && { 
                    history: response.history,
                    statusChanges: response.statusChanges 
                  }),
                  ...(includeDocuments && { 
                    documents: response.documents,
                    photos: response.photos 
                  }),
                  ...(includePayments && { 
                    payments: response.payments,
                    reserveHistory: response.reserveHistory 
                  }),
                  ...(includeNotes && { 
                    notes: response.notes,
                    adjusterNotes: response.adjusterNotes 
                  }),
                  ...(includePolicy && { 
                    policy: response.policy 
                  })
                }
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
                error: "Failed to retrieve claim",
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