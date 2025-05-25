import { createLedgerClient } from "../client";
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerCalculateQuoteTools(server: McpServer) {
  server.tool(
    "ledger_calculate_quote",
    "Calculate premiums and pricing for a quote by updating and calculating in one operation",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header (e.g., 'accelerate')"),
      schema: z.string().describe("Product schema name (e.g., 'casco', 'liability', 'property')"),
      quoteId: z.number().int().positive().describe("Unique identifier of the quote to calculate"),
      quoteData: z.record(z.any()).describe("Quote data to update before calculation according to the product schema"),
      acceptLanguage: z.string().optional().describe("Accept-Language header (e.g., 'en-US', 'et-EE')"),
    },
    async ({ bearerToken, tenantId, schema, quoteId, quoteData, acceptLanguage }) => {
      try {
        const client = createLedgerClient(bearerToken, tenantId);
        
        const headers = acceptLanguage ? { 'Accept-Language': acceptLanguage } : undefined;
        const data = await client.post(`/api/v1/ledger/sales/quotes/${schema}/${quoteId}/calculate`, quoteData, headers);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                calculation: data,
                schema,
                quoteId,
                message: `Quote ${quoteId} calculated successfully using ${schema} schema`,
                meta: {
                  quoteId,
                  schemaPath: data.meta?.schemaPath,
                  calculatedAt: new Date().toISOString(),
                  schema,
                  premiums: data.data?.premiums || data.premiums,
                  totalPremium: data.data?.totalPremium || data.totalPremium,
                },
                usage: "Calculation updates the quote data and returns premium calculations, coverage details, and validation results",
                relatedTools: {
                  get: "Use ledger_get_quote to see updated quote with calculations",
                  update: "Use ledger_update_quote to modify quote before recalculating",
                  issue: "Use ledger_issue_quote to convert calculated quote to policy"
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