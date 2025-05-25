import { createLedgerClient } from "../client";
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerQuotesRenewalTools(server: McpServer) {
  server.tool(
    "ledger_get_quotes_renewal",
    "Get dashboard data for renewal quotes that have been created by renewal processes and are not yet issued. Supports filtering by product, status, and broker",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header (e.g., 'accelerate')"),
      filterProduct: z.string().optional().describe("Filter by product name (e.g., 'casco', 'liability')"),
      filterStatus: z.string().optional().describe("Filter by renewal quote status"),
      filterBrokerShortName: z.string().optional().describe("Filter by broker short name"),
    },
    async ({ bearerToken, tenantId, filterProduct, filterStatus, filterBrokerShortName }) => {
      try {
        const client = createLedgerClient(bearerToken, tenantId);
        
        const params = new URLSearchParams();
        if (filterProduct) params.set('filters[schema.name]', filterProduct);
        if (filterStatus) params.set('filters[status]', filterStatus);
        if (filterBrokerShortName) params.set('filters[broker.shortName]', filterBrokerShortName);
        
        const queryString = params.toString();
        const endpoint = `/api/v1/ledger/dashboards/quotes-renewal${queryString ? `?${queryString}` : ''}`;
        
        const data = await client.get(endpoint);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                renewalQuotes: data.data || [],
                links: data.links || {},
                pagination: {
                  hasNext: !!data.links?.next,
                  hasPrev: !!data.links?.prev,
                },
                filters: {
                  product: filterProduct,
                  status: filterStatus,
                  brokerShortName: filterBrokerShortName,
                },
                meta: {
                  count: data.data?.length || 0,
                  retrievedAt: new Date().toISOString(),
                  filtered: !!(filterProduct || filterStatus || filterBrokerShortName),
                },
                usage: "These are renewal quotes created from existing policies that haven't been issued yet. Use this dashboard to track and manage renewal workflow.",
                relatedTools: {
                  referral: "Use ledger_get_quotes_in_referral for quotes awaiting approval",
                  products: "Use ledger_get_renewal_products to see available renewable products",
                  issue: "Use ledger_issue_quote to convert renewal quotes to policies"
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
                filters: { filterProduct, filterStatus, filterBrokerShortName }
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}