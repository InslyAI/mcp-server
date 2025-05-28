import { createLedgerClient } from "../../client";
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerRenewBinderTools(server: McpServer) {
  server.tool(
    "ledger_sales_binders_renew",
    "Renew an existing binder for the next period. Creates a renewal binder based on the original binder configuration",
    {
      bearerToken: z.string().min(1).describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header (e.g., 'accelerate')"),
      binderId: z.number().int().positive().describe("Unique identifier of the binder to renew"),
    },
    async ({ bearerToken, tenantId, binderId }) => {
      try {
        const client = createLedgerClient(bearerToken, tenantId);
        
        const data = await client.post(`/api/v1/ledger/sales/binders/${binderId}/renew`, {});
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                renewalBinder: data.data || data,
                links: data.links || {},
                message: `Binder ${binderId} renewed successfully`,
                meta: {
                  originalBinderId: binderId,
                  renewedAt: new Date().toISOString(),
                  renewalBinderId: data.data?.id || null,
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