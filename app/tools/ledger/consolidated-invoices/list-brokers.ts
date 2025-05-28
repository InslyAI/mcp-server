/**
 * List Consolidated Invoice Brokers Tool
 * Retrieves brokers available for consolidated invoicing
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../client";

export function registerListConsolidatedInvoiceBrokersTool(server: McpServer) {
  server.tool(
    "ledger_consolidated_invoices_list",
    "Get list of brokers available for consolidated invoicing",
    {
      bearerToken: z.string().min(1).describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
    },
    async ({ bearerToken, tenantId }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const response = await client.get(`/api/v1/ledger/consolidated-invoices/brokers`);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                brokers: response,
                totalCount: Array.isArray(response) ? response.length : 0
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
                error: "Failed to retrieve consolidated invoice brokers",
                details: error.message,
                statusCode: error.status
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}