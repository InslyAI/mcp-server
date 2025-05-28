/**
 * Decline Policy Tool
 * Declines a policy draft with specified reason
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createLedgerClient } from "../../../client";

export function registerDeclinePolicyTool(server: McpServer) {
  server.tool(
    "ledger_sales_policies_lifecycle_decline",
    "Decline a policy draft with specified reason and optional details",
    {
      bearerToken: z.string().min(1).describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      policyId: z.string().min(1).describe("ID of the policy to decline"),
      declineData: z.object({
        reason: z.string().describe("Reason for declining the policy"),
        details: z.string().optional().describe("Detailed explanation for the decline"),
        declineCode: z.string().optional().describe("Internal decline code for categorization"),
        customerNotification: z.boolean().optional().describe("Whether to notify the customer"),
        notificationMethod: z.string().optional().describe("Method to notify customer (email, letter, etc.)"),
        followUpRequired: z.boolean().optional().describe("Whether follow-up is required")
      }).describe("Decline information and parameters")
    },
    async ({ bearerToken, tenantId, policyId, declineData }) => {
      try {
        const client = createLedgerClient(bearerToken, tenantId);
        
        const response = await client.post(`/api/v1/ledger/sales/policies/${policyId}/decline`, declineData);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                message: "Policy declined successfully",
                policyId: policyId,
                status: "declined",
                declinedAt: new Date().toISOString(),
                declineReason: declineData.reason,
                declineDetails: declineData.details,
                customerNotified: declineData.customerNotification || false,
                followUpRequired: declineData.followUpRequired || false
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
                error: "Failed to decline policy",
                details: error.message,
                statusCode: error.status,
                policyId: policyId
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}