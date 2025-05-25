import { createLedgerClient } from "../client";
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerGetRenewalProductsTools(server: McpServer) {
  server.tool(
    "ledger_get_renewal_products",
    "Get list of renewable products that are editable by the current user. These products support renewal quote generation",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header (e.g., 'accelerate')"),
    },
    async ({ bearerToken, tenantId }) => {
      try {
        const client = createLedgerClient(bearerToken, tenantId);
        
        const products = await client.get('/api/v1/ledger/dashboards/quotes-renewal/products');
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                renewableProducts: Array.isArray(products) ? products : [],
                meta: {
                  count: Array.isArray(products) ? products.length : 0,
                  retrievedAt: new Date().toISOString(),
                },
                usage: "These products support renewal quote generation. Use the 'name' field to filter renewal dashboards and the 'title' field for display purposes.",
                examples: {
                  filterUsage: "Use product 'name' values with ledger_get_quotes_renewal filterProduct parameter",
                  schemaUsage: "Use product 'name' values with ledger_get_renewal_schema tool"
                },
                relatedTools: {
                  renewalQuotes: "Use ledger_get_quotes_renewal with these product names",
                  renewalSchemas: "Use ledger_get_renewal_schema for product-specific renewal schemas",
                  policyRenewal: "Use ledger_renew_policy to prepare renewal data"
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