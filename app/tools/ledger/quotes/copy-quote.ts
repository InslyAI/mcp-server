import { createLedgerClient } from "../client";
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerCopyQuoteTools(server: McpServer) {
  server.tool(
    "ledger_copy_quote",
    "Create a copy of an existing quote. Only non-MTA (non-Mid Term Adjustment) quotes can be copied",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header (e.g., 'accelerate')"),
      sourceQuoteId: z.number().int().positive().describe("ID of the quote to copy"),
      acceptLanguage: z.string().optional().describe("Accept-Language header (e.g., 'en-US', 'et-EE')"),
    },
    async ({ bearerToken, tenantId, sourceQuoteId, acceptLanguage }) => {
      try {
        const client = createLedgerClient(bearerToken, tenantId);
        
        const copyData = {
          "policy.id": sourceQuoteId
        };
        
        const headers = acceptLanguage ? { 'Accept-Language': acceptLanguage } : undefined;
        const data = await client.post('/api/v1/ledger/sales/policies/copy', copyData, headers);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                copiedQuote: data,
                sourceQuoteId,
                message: `Quote ${sourceQuoteId} copied successfully`,
                meta: {
                  sourceQuoteId,
                  newQuoteId: data.data?.id || data.id,
                  copiedAt: new Date().toISOString(),
                  schemaPath: data.meta?.schemaPath,
                },
                usage: "The copied quote is independent and can be modified without affecting the original quote",
                relatedTools: {
                  update: "Use ledger_update_quote to modify the copied quote",
                  calculate: "Use ledger_calculate_quote to calculate premiums for the copy",
                  get: "Use ledger_get_quote to view the copied quote details"
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
                sourceQuoteId,
                note: "Only non-MTA quotes can be copied. Check if the source quote is eligible for copying."
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}