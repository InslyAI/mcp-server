import { createLedgerClient } from "../../client";
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerGetBinderTools(server: McpServer) {
  server.tool(
    "ledger_get_binder",
    "Get detailed information about a specific binder by ID",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header (e.g., 'accelerate')"),
      binderId: z.number().int().positive().describe("Unique identifier of the binder to retrieve"),
    },
    async ({ bearerToken, tenantId, binderId }) => {
      try {
        const client = createLedgerClient(bearerToken, tenantId);
        
        const data = await client.get(`/api/v1/ledger/sales/binders/${binderId}`);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                binder: data.data || data,
                links: data.links || {},
                meta: {
                  binderId,
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