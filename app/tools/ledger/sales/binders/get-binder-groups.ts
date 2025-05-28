import { createLedgerClient } from "../../client";
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerGetBinderGroupsTools(server: McpServer) {
  server.tool(
    "ledger_sales_binders_get",
    "Get list of available binder groups/categories for organizing binders",
    {
      bearerToken: z.string().min(1).describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header (e.g., 'accelerate')"),
    },
    async ({ bearerToken, tenantId }) => {
      try {
        const client = createLedgerClient(bearerToken, tenantId);
        
        const groups = await client.get('/api/v1/ledger/sales/binders/groups');
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                groups: Array.isArray(groups) ? groups : [],
                meta: {
                  count: Array.isArray(groups) ? groups.length : 0,
                  retrievedAt: new Date().toISOString(),
                }
              }, null, 2)
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred',
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}