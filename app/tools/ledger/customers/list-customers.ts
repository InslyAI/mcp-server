/**
 * List Customers Tool
 * Retrieves a list of all customers
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../client";

export function registerListCustomersTool(server: McpServer) {
  server.tool(
    "ledger_customers_list",
    "Get a list of all customers in the system",
    {
      bearerToken: z.string().min(1).describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
    },
    async ({ bearerToken, tenantId }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const response = await client.get("/api/v1/ledger/customers");

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                customers: response,
                totalCount: Array.isArray(response) ? response.length : 0
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
                error: "Failed to retrieve customers",
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