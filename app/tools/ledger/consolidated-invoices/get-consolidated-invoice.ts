/**
 * Get Consolidated Invoice Tool
 * Retrieves detailed information about a specific consolidated invoice
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createLedgerClient } from "../client";

export function registerGetConsolidatedInvoiceTool(server: McpServer) {
  server.tool(
    "ledger_consolidated_invoices_get",
    "Retrieve detailed details about a specific consolidated invoice",
    {
      bearerToken: z.string().min(1).describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      invoiceId: z.string().min(1).describe("ID of the consolidated invoice to retrieve"),
    },
    async ({ bearerToken, tenantId, invoiceId }) => {
      try {
        const client = createLedgerClient(bearerToken, tenantId);
        
        const response = await client.get(`/api/v1/ledger/consolidated-invoices/${invoiceId}`);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                consolidatedInvoice: response
              }, null, 2)
            }
          ]
        };
      } catch (error: any) {
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: false,
                error: "Failed to retrieve consolidated invoice",
                details: error.message,
                statusCode: error.status,
                invoiceId: invoiceId
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}