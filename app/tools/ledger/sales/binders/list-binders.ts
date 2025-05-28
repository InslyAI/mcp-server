import { createLedgerClient } from "../../client";
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerListBindersTools(server: McpServer) {
  server.tool(
    "ledger_sales_binders_list",
    "Get paginated list of binders with full details and filtering options",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header (e.g., 'accelerate')"),
      pageLimit: z.number().int().positive().optional().describe("Number of items per page (default: 25)"),
      cursor: z.string().optional().describe("Pagination cursor for next/previous page"),
      filterProduct: z.string().optional().describe("Filter by product"),
      filterStatus: z.string().optional().describe("Filter by binder status (e.g., 'active')"),
      filterBroker: z.string().optional().describe("Filter by broker"),
      useNewFeature: z.boolean().optional().describe("Use new feature flag (default: false)"),
    },
    async ({ bearerToken, tenantId, pageLimit, cursor, filterProduct, filterStatus, filterBroker, useNewFeature }) => {
      try {
        const client = createLedgerClient(bearerToken, tenantId);
        
        const params = new URLSearchParams();
        if (pageLimit) params.append('page[limit]', pageLimit.toString());
        if (cursor) params.append('cursor', cursor);
        if (filterProduct) params.append('filter[product]', filterProduct);
        if (filterStatus) params.append('filter[status]', filterStatus);
        if (filterBroker) params.append('filter[broker]', filterBroker);
        if (useNewFeature !== undefined) params.append('_useNewFeature', useNewFeature.toString());
        
        const queryString = params.toString();
        const endpoint = `/api/v1/ledger/sales/binders${queryString ? `?${queryString}` : ''}`;
        
        const data = await client.get(endpoint);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                data: data.data || [],
                links: data.links || {},
                pagination: {
                  hasNext: !!data.links?.next,
                  hasPrev: !!data.links?.prev,
                  nextCursor: data.links?.next ? new URL(data.links.next).searchParams.get('cursor') : null,
                  prevCursor: data.links?.prev ? new URL(data.links.prev).searchParams.get('cursor') : null,
                },
                meta: {
                  count: data.data?.length || 0,
                  filtered: !!(filterProduct || filterStatus || filterBroker),
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