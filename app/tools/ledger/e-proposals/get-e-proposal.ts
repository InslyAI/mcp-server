/**
 * Get E-proposal Tool
 * Retrieves detailed information about a specific electronic proposal
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../client";

export function registerGetEProposalTool(server: McpServer) {
  server.tool(
    "ledger_get_e_proposal",
    "Get detailed information about a specific electronic proposal including status and workflow",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      proposalId: z.string().describe("ID of the e-proposal to retrieve"),
      includeHistory: z.boolean().optional().describe("Whether to include workflow history"),
      includeAttachments: z.boolean().optional().describe("Whether to include attachment metadata"),
      includeComments: z.boolean().optional().describe("Whether to include underwriter comments"),
    },
    async ({ bearerToken, tenantId, proposalId, includeHistory, includeAttachments, includeComments }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const queryParams = new URLSearchParams();
        if (includeHistory) queryParams.append('include_history', 'true');
        if (includeAttachments) queryParams.append('include_attachments', 'true');
        if (includeComments) queryParams.append('include_comments', 'true');
        
        const endpoint = `/e-proposals/${proposalId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        
        const response = await client.get(endpoint);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                eProposal: {
                  id: response.id,
                  proposalNumber: response.proposalNumber,
                  status: response.status,
                  productId: response.productId,
                  productName: response.productName,
                  brokerId: response.brokerId,
                  brokerName: response.brokerName,
                  clientData: response.clientData,
                  riskData: response.riskData,
                  coverageRequirements: response.coverageRequirements,
                  submittedAt: response.submittedAt,
                  lastUpdated: response.lastUpdated,
                  priority: response.priority,
                  workflow: response.workflow,
                  currentStep: response.currentStep,
                  assignedUnderwriter: response.assignedUnderwriter,
                  submissionNotes: response.submissionNotes,
                  ...(includeHistory && { history: response.history }),
                  ...(includeAttachments && { attachments: response.attachments }),
                  ...(includeComments && { comments: response.comments })
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
                error: "Failed to retrieve e-proposal",
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