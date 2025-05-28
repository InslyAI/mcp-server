/**
 * Manage Consolidated Invoice Items Tool
 * Add/remove invoices from consolidated invoice
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../client";

export function registerManageConsolidatedInvoiceItemsTool(server: McpServer) {
  server.tool(
    "ledger_consolidated_invoices_manage",
    "Add or remove individual invoices from a consolidated invoice",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      consolidatedInvoiceId: z.string().describe("ID of the consolidated invoice"),
      action: z.enum(["add", "remove", "list"]).describe("Action to perform"),
      invoiceNumbers: z.array(z.string()).optional().describe("Invoice numbers to add or remove"),
    },
    async ({ bearerToken, tenantId, consolidatedInvoiceId, action, invoiceNumbers }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        let response;
        let endpoint = `/api/v1/ledger/consolidated-invoices/${consolidatedInvoiceId}/invoices`;
        
        if (action === "list") {
          response = await client.get(endpoint);
        } else if (action === "add" && invoiceNumbers) {
          response = await client.post(endpoint, { invoiceNumbers });
        } else if (action === "remove" && invoiceNumbers) {
          // For removing specific invoices
          const promises = invoiceNumbers.map(invoiceNo => 
            client.delete(`${endpoint}/${invoiceNo}`)
          );
          response = await Promise.all(promises);
        }

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                action: action,
                consolidatedInvoiceId: consolidatedInvoiceId,
                invoiceNumbers: invoiceNumbers || [],
                result: response
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
                error: "Failed to manage consolidated invoice items",
                details: error.message,
                statusCode: error.status,
                consolidatedInvoiceId: consolidatedInvoiceId,
                action: action
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}