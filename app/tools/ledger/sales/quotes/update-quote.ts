import { createLedgerClient } from "../../client";
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerUpdateQuoteTools(server: McpServer) {
  server.tool(
    "ledger_update_quote",
    "Update an existing quote with new data according to the product schema",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header (e.g., 'accelerate')"),
      schema: z.string().describe("Product schema name (e.g., 'casco', 'liability', 'property')"),
      quoteId: z.number().int().positive().describe("Unique identifier of the quote to update"),
      quoteData: z.record(z.any()).describe("Updated quote data according to the product schema structure"),
      acceptLanguage: z.string().optional().describe("Accept-Language header (e.g., 'en-US', 'et-EE')"),
    },
    async ({ bearerToken, tenantId, schema, quoteId, quoteData, acceptLanguage }) => {
      try {
        const client = createLedgerClient(bearerToken, tenantId);
        
        const headers = acceptLanguage ? { 'Accept-Language': acceptLanguage } : undefined;
        const data = await client.put(`/api/v1/ledger/sales/quotes/${schema}/${quoteId}`, quoteData, headers);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                quote: data,
                schema,
                quoteId,
                message: `Quote ${quoteId} updated successfully using ${schema} schema`,
                meta: {
                  quoteId,
                  schemaPath: data.meta?.schemaPath,
                  updatedAt: new Date().toISOString(),
                  schema,
                },
                relatedTools: {
                  get: "Use ledger_get_quote to see updated quote details",
                  calculate: "Use ledger_calculate_quote to recalculate premiums",
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
                quoteId,
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}