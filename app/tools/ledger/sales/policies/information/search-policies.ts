import { createLedgerClient } from "../../../client";
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerSearchPoliciesTools(server: McpServer) {
  server.tool(
    "ledger_search_policies",
    "Search for policies using various filters and search terms with pagination support",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header (e.g., 'accelerate')"),
      searchTerm: z.string().describe("Search term to find policies (policy number, customer name, etc.)"),
      date: z.string().describe("Date filter in ISO format (e.g., '2022-02-02T00:00')"),
      pageLimit: z.number().int().positive().optional().describe("Number of items per page (default: 25)"),
      cursor: z.string().optional().describe("Pagination cursor for next/previous page"),
    },
    async ({ bearerToken, tenantId, searchTerm, date, pageLimit, cursor }) => {
      try {
        const client = createLedgerClient(bearerToken, tenantId);
        
        const params = new URLSearchParams();
        params.set('search_term', searchTerm);
        params.set('date', date);
        if (pageLimit) params.set('page[limit]', pageLimit.toString());
        if (cursor) params.set('cursor', cursor);
        
        const queryString = params.toString();
        const endpoint = `/api/v1/ledger/policies/versions/search?${queryString}`;
        
        const data = await client.get(endpoint);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                policies: data.data || [],
                links: data.links || {},
                pagination: {
                  hasNext: !!data.links?.next,
                  hasPrev: !!data.links?.prev,
                  nextCursor: data.links?.next ? new URL(data.links.next).searchParams.get('cursor') : null,
                  prevCursor: data.links?.prev ? new URL(data.links.prev).searchParams.get('cursor') : null,
                },
                meta: {
                  searchTerm,
                  date,
                  count: data.data?.length || 0,
                },
                usage: "Use this tool to find policies by policy number, customer name, or other search criteria"
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