import { createLedgerClient } from "../../../client";
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerGetBrokerEventsTools(server: McpServer) {
  server.tool(
    "ledger_sales_policies_get_broker_events",
    "Get list of sales policy events for a specific broker within a date range",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header (e.g., 'accelerate')"),
      broker: z.string().describe("Broker short name or identifier"),
      from: z.string().describe("Start date in ISO format (e.g., '2023-11-16T00:00:00+02:00')"),
      to: z.string().describe("End date in ISO format (e.g., '2023-11-17T23:59:59+02:00')"),
      pageLimit: z.number().int().positive().optional().describe("Number of events per page (default: 25)"),
      cursor: z.string().optional().describe("Pagination cursor for next/previous page"),
    },
    async ({ bearerToken, tenantId, broker, from, to, pageLimit, cursor }) => {
      try {
        const client = createLedgerClient(bearerToken, tenantId);
        
        const params = new URLSearchParams();
        params.set('broker', broker);
        params.set('from', from);
        params.set('to', to);
        if (pageLimit) params.set('page[limit]', pageLimit.toString());
        if (cursor) params.set('cursor', cursor);
        
        const queryString = params.toString();
        const endpoint = `/api/v1/ledger/policies/broker-events?${queryString}`;
        
        const data = await client.get(endpoint);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                events: data.data || [],
                links: data.links || {},
                pagination: {
                  hasNext: !!data.links?.next,
                  hasPrev: !!data.links?.prev,
                  nextCursor: data.links?.next ? new URL(data.links.next).searchParams.get('cursor') : null,
                  prevCursor: data.links?.prev ? new URL(data.links.prev).searchParams.get('cursor') : null,
                },
                meta: {
                  broker,
                  dateRange: { from, to },
                  count: data.data?.length || 0,
                  retrievedAt: new Date().toISOString(),
                },
                usage: "Events include policy creation, modifications, renewals, terminations, and other broker-related activities"
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
                broker,
                dateRange: { from, to },
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}