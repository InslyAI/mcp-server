import { createLedgerClient } from "../../client";
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerCreateQuoteTools(server: McpServer) {
  server.tool(
    "ledger_sales_quotes_create",
    "Create a new insurance quote using a specific product schema with customer and risk data",
    {
      bearerToken: z.string().min(1).describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header (e.g., 'accelerate')"),
      schema: z.string().describe("Product schema name (e.g., 'casco', 'liability', 'property')"),
      quoteData: z.record(z.any()).describe("Quote data according to the product schema structure"),
      acceptLanguage: z.string().optional().describe("Accept-Language header (e.g., 'en-US', 'et-EE')"),
    },
    async ({ bearerToken, tenantId, schema, quoteData, acceptLanguage }) => {
      try {
        const client = createLedgerClient(bearerToken, tenantId);
        
        const headers = acceptLanguage ? { 'Accept-Language': acceptLanguage } : undefined;
        const data = await client.post(`/api/v1/ledger/sales/quotes/${schema}`, quoteData, headers);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                quote: data,
                schema,
                message: `Quote created successfully using ${schema} schema`,
                meta: {
                  quoteId: data.data?.id || data.id,
                  schemaPath: data.meta?.schemaPath,
                  createdAt: new Date().toISOString(),
                  schema,
                },
                relatedTools: {
                  update: "Use ledger_update_quote to modify this quote",
                  calculate: "Use ledger_calculate_quote to calculate premiums",
                  issue: "Use ledger_issue_quote to convert to policy"
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
                schema,
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}