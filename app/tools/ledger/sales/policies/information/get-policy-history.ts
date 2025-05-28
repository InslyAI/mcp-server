import { createLedgerClient } from "../../../client";
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerGetPolicyHistoryTools(server: McpServer) {
  server.tool(
    "ledger_sales_policies_get_history",
    "Get the complete change history for a specific sales policy including all modifications, endorsements, and status changes",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header (e.g., 'accelerate')"),
      policyId: z.number().int().positive().describe("Unique identifier of the policy"),
      pageLimit: z.number().int().positive().optional().describe("Number of history items per page (default: 25)"),
      cursor: z.string().optional().describe("Pagination cursor for next/previous page"),
    },
    async ({ bearerToken, tenantId, policyId, pageLimit, cursor }) => {
      try {
        const client = createLedgerClient(bearerToken, tenantId);
        
        const params = new URLSearchParams();
        if (pageLimit) params.set('page[limit]', pageLimit.toString());
        if (cursor) params.set('cursor', cursor);
        
        const queryString = params.toString();
        const endpoint = `/api/v1/ledger/policies/${policyId}/history${queryString ? `?${queryString}` : ''}`;
        
        const data = await client.get(endpoint);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                policyId,
                history: data.data || [],
                links: data.links || {},
                pagination: {
                  hasNext: !!data.links?.next,
                  hasPrev: !!data.links?.prev,
                  nextCursor: data.links?.next ? new URL(data.links.next).searchParams.get('cursor') : null,
                  prevCursor: data.links?.prev ? new URL(data.links.prev).searchParams.get('cursor') : null,
                },
                meta: {
                  policyId,
                  count: data.data?.length || 0,
                  retrievedAt: new Date().toISOString(),
                },
                usage: "History shows all changes made to the policy including endorsements, status changes, and data modifications"
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
                policyId,
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}