/**
 * Get Policy Customer Tool
 * Retrieves customer information associated with a policy
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../../../client";

export function registerGetPolicyCustomerTool(server: McpServer) {
  server.tool(
    "ledger_sales_policies_get_customer",
    "Retrieve customer details associated with a specific policy",
    {
      bearerToken: z.string().min(1).describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      policyId: z.string().min(1).describe("ID of the policy to get customer for"),
    },
    async ({ bearerToken, tenantId, policyId }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const response = await client.get(`/api/v1/ledger/sales/policies/${policyId}/getCustomer`);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                policyId: policyId,
                customer: response
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
                error: "Failed to retrieve policy customer",
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