/**
 * Get Available Invoices Tool
 * Retrieves invoices that can be added to a consolidated invoice
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createLedgerClient } from "../client";

export function registerGetAvailableInvoicesTool(server: McpServer) {
  server.tool(
    "ledger_consolidated_invoices_available_get",
    "Get list of invoices that can be added to a consolidated invoice",
    {
      bearerToken: z.string().min(1).describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      consolidatedInvoiceId: z.string().min(1).describe("ID of the consolidated invoice"),
      pagination: z.object({
        cursor: z.string().optional().describe("Cursor for pagination navigation"),
        limit: z.number().optional().describe("Maximum number of invoices to return")
      }).optional().describe("Pagination parameters")
    },
    async ({ bearerToken, tenantId, consolidatedInvoiceId, pagination }) => {
      try {
        const client = createLedgerClient(bearerToken, tenantId);
        
        const queryParams = new URLSearchParams();
        if (pagination?.cursor) queryParams.append('cursor', pagination.cursor);
        if (pagination?.limit) queryParams.append('page[limit]', pagination.limit.toString());
        
        const endpoint = `/api/v1/ledger/consolidated-invoices/${consolidatedInvoiceId}/available-invoices${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        
        const response = await client.get(endpoint);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                consolidatedInvoiceId: consolidatedInvoiceId,
                availableInvoices: response.data || response,
                pagination: {
                  cursor: pagination?.cursor,
                  limit: pagination?.limit,
                  hasMore: response.hasMore || false,
                  nextCursor: response.nextCursor
                },
                totalAvailable: Array.isArray(response.data || response) ? (response.data || response).length : 0
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
                error: "Failed to retrieve available invoices",
                details: error.message,
                statusCode: error.status,
                consolidatedInvoiceId: consolidatedInvoiceId
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}