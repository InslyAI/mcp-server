import { createLedgerClient } from "../client";
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerPoliciesRenewalTools(server: McpServer) {
  server.tool(
    "ledger_dashboards_policies_renewal",
    "Get dashboard data for policies that are eligible for renewal and don't have renewed policies issued yet. Filters by expiry timeframe",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header (e.g., 'accelerate')"),
      daysBeforeExpiry: z.number().int().positive().describe("Filter by days before expiry date (required - e.g., 30 for policies expiring within 30 days)"),
      filterProduct: z.string().optional().describe("Filter by product name (e.g., 'casco', 'liability')"),
      filterBrokerShortName: z.string().optional().describe("Filter by broker short name"),
    },
    async ({ bearerToken, tenantId, daysBeforeExpiry, filterProduct, filterBrokerShortName }) => {
      try {
        const client = createLedgerClient(bearerToken, tenantId);
        
        const params = new URLSearchParams();
        params.set('filters[daysBeforeExpiry]', daysBeforeExpiry.toString());
        if (filterProduct) params.set('filters[schema.name]', filterProduct);
        if (filterBrokerShortName) params.set('filters[broker.shortName]', filterBrokerShortName);
        
        const queryString = params.toString();
        const endpoint = `/api/v1/ledger/dashboards/policies-renewal?${queryString}`;
        
        const data = await client.get(endpoint);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                renewalPolicies: data.data || [],
                links: data.links || {},
                pagination: {
                  hasNext: !!data.links?.next,
                  hasPrev: !!data.links?.prev,
                },
                filters: {
                  daysBeforeExpiry,
                  product: filterProduct,
                  brokerShortName: filterBrokerShortName,
                },
                meta: {
                  count: data.data?.length || 0,
                  retrievedAt: new Date().toISOString(),
                  expiryWindow: `${daysBeforeExpiry} days`,
                },
                usage: `Policies expiring within ${daysBeforeExpiry} days that are eligible for renewal. Use this dashboard to manage renewal campaigns and track renewal opportunities.`,
                relatedTools: {
                  prepare: "Use ledger_renew_policy to prepare renewal quotes for these policies",
                  products: "Use ledger_get_policies_renewal_products to see available renewable products",
                  renewalQuotes: "Use ledger_get_quotes_renewal to see created renewal quotes"
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
                filters: { daysBeforeExpiry, filterProduct, filterBrokerShortName }
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}