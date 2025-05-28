/**
 * Create Consolidated Invoice Tool
 * Creates a new consolidated invoice
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../client";

export function registerCreateConsolidatedInvoiceTool(server: McpServer) {
  server.tool(
    "ledger_consolidated_invoices_create",
    "Create a new consolidated invoice for multiple individual invoices",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      invoiceData: z.object({
        brokerId: z.string().describe("Broker ID for the consolidated invoice"),
        invoiceIds: z.array(z.string()).describe("Array of individual invoice IDs to consolidate"),
        dueDate: z.string().optional().describe("Due date for the consolidated invoice (YYYY-MM-DD)"),
        description: z.string().optional().describe("Description for the consolidated invoice"),
        paymentTerms: z.string().optional().describe("Payment terms"),
        notes: z.string().optional().describe("Additional notes")
      }).describe("Consolidated invoice data")
    },
    async ({ bearerToken, tenantId, invoiceData }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const response = await client.post(`/api/v1/ledger/consolidated-invoices`, invoiceData);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                message: "Consolidated invoice created successfully",
                consolidatedInvoiceId: response.id || response.data?.id,
                brokerId: invoiceData.brokerId,
                invoiceCount: invoiceData.invoiceIds.length,
                createdAt: new Date().toISOString(),
                data: response.data || response
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
                error: "Failed to create consolidated invoice",
                details: error.message,
                statusCode: error.status,
                brokerId: invoiceData.brokerId
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}