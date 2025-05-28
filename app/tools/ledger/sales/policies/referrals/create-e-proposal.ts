/**
 * Create E-Proposal Tool
 * Creates electronic proposals from policies/quotes
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../../../client";

export function registerCreateEProposalTool(server: McpServer) {
  server.tool(
    "ledger_create_policy_e_proposal",
    "Create an electronic proposal from a policy/quote for customer review and acceptance",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      quoteId: z.string().describe("ID of the quote to create e-proposal from"),
      proposalData: z.object({
        customerEmail: z.string().email().describe("Customer email for proposal delivery"),
        expiryDate: z.string().optional().describe("Proposal expiry date (YYYY-MM-DD)"),
        templateId: z.string().optional().describe("E-proposal template ID"),
        customMessage: z.string().optional().describe("Custom message for the customer"),
        requireDigitalSignature: z.boolean().optional().describe("Whether digital signature is required"),
        allowModifications: z.boolean().optional().describe("Whether customer can modify the proposal"),
        notificationSettings: z.object({
          sendImmediately: z.boolean().optional(),
          reminderDays: z.array(z.number()).optional(),
          includeDocuments: z.boolean().optional()
        }).optional().describe("Notification preferences")
      }).describe("E-proposal configuration")
    },
    async ({ bearerToken, tenantId, quoteId, proposalData }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const response = await client.post(`/api/v1/ledger/sales/policies/${quoteId}/e-proposal`, proposalData);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                message: "E-proposal created successfully",
                quoteId: quoteId,
                proposalId: response.proposalId || response.data?.id,
                proposalUrl: response.proposalUrl,
                customerEmail: proposalData.customerEmail,
                expiryDate: proposalData.expiryDate,
                status: "sent",
                proposalData: proposalData,
                response: response
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
                error: "Failed to create e-proposal",
                details: error.message,
                statusCode: error.status,
                quoteId: quoteId
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}