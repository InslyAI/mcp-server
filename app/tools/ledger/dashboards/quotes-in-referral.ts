import { createLedgerClient } from "../client";
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerQuotesInReferralTools(server: McpServer) {
  server.tool(
    "ledger_dashboards_quotes_in_referral",
    "Get dashboard data for quotes currently in referral status awaiting underwriter review. Supports filtering and search capabilities",
    {
      bearerToken: z.string().min(1).describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header (e.g., 'accelerate')"),
      filterProduct: z.string().optional().describe("Filter by product name (e.g., 'casco', 'liability')"),
      filterTransaction: z.string().optional().describe("Filter by transaction type"),
      filterUnderwriter: z.string().optional().describe("Filter by underwriter identifier"),
      filterLowestAcceptor: z.boolean().optional().describe("Apply filter by lowest acceptor role"),
      search: z.string().optional().describe("Search term to find quotes by various fields"),
    },
    async ({ bearerToken, tenantId, filterProduct, filterTransaction, filterUnderwriter, filterLowestAcceptor, search }) => {
      try {
        const client = createLedgerClient(bearerToken, tenantId);
        
        const params = new URLSearchParams();
        if (filterProduct) params.set('filters[schema.name]', filterProduct);
        if (filterTransaction) params.set('filters[transaction]', filterTransaction);
        if (filterUnderwriter) params.set('filters[referrals.underwriter.sub]', filterUnderwriter);
        if (filterLowestAcceptor !== undefined) params.set('filters[lowest_acceptor]', filterLowestAcceptor.toString());
        if (search) params.set('search', search);
        
        const queryString = params.toString();
        const endpoint = `/api/v1/ledger/dashboards/quotes-in-referral${queryString ? `?${queryString}` : ''}`;
        
        const quotes = await client.get(endpoint);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                quotesInReferral: Array.isArray(quotes) ? quotes : [],
                filters: {
                  product: filterProduct,
                  transaction: filterTransaction,
                  underwriter: filterUnderwriter,
                  lowestAcceptor: filterLowestAcceptor,
                  search,
                },
                meta: {
                  count: Array.isArray(quotes) ? quotes.length : 0,
                  retrievedAt: new Date().toISOString(),
                  filtered: !!(filterProduct || filterTransaction || filterUnderwriter || filterLowestAcceptor !== undefined || search),
                },
                usage: "These quotes are awaiting underwriter review and approval. Use this data to manage the referral workflow and track pending approvals.",
                relatedTools: {
                  renewal: "Use ledger_get_quotes_renewal for renewal quotes dashboard",
                  policies: "Use ledger_get_policies_renewal for policies ready for renewal",
                  quote: "Use ledger_get_quote to view detailed quote information"
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
                filters: { filterProduct, filterTransaction, filterUnderwriter, filterLowestAcceptor, search }
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}