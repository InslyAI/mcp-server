/**
 * Copy Policy Tool
 * Creates a copy of an existing policy/quote for reuse
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../../../client";

export function registerCopyPolicyTool(server: McpServer) {
  server.tool(
    "ledger_sales_policies_lifecycle_copy",
    "Create a copy of an existing policy/quote for reuse or modification",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      sourcePolicyId: z.string().describe("ID of the source policy to copy"),
      copyOptions: z.object({
        newCustomerId: z.string().optional().describe("Customer ID for the new policy copy"),
        copyName: z.string().optional().describe("Name/reference for the copied policy"),
        resetDates: z.boolean().optional().describe("Whether to reset effective/expiry dates"),
        newEffectiveDate: z.string().optional().describe("New effective date (YYYY-MM-DD)"),
        newExpiryDate: z.string().optional().describe("New expiry date (YYYY-MM-DD)"),
        copyDocuments: z.boolean().optional().describe("Whether to copy associated documents"),
        copyNotes: z.boolean().optional().describe("Whether to copy policy notes"),
        resetPremium: z.boolean().optional().describe("Whether to recalculate premium"),
        copyStatus: z.string().optional().describe("Initial status for the copied policy")
      }).optional().describe("Copy configuration options")
    },
    async ({ bearerToken, tenantId, sourcePolicyId, copyOptions }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const requestBody = {
          sourcePolicyId: sourcePolicyId,
          ...copyOptions
        };
        
        const response = await client.post(`/api/v1/ledger/sales/policies/copy`, requestBody);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                message: "Policy copied successfully",
                sourcePolicyId: sourcePolicyId,
                newPolicyId: response.id || response.data?.id,
                copyOptions: copyOptions,
                copiedAt: new Date().toISOString(),
                data: response.data,
                meta: response.meta
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
                error: "Failed to copy policy",
                details: error.message,
                statusCode: error.status,
                sourcePolicyId: sourcePolicyId
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}