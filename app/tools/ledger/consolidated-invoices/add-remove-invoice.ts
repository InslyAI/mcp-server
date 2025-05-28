/**
 * Add/Remove Invoice Tool
 * Adds or removes individual invoices from consolidated invoice
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createLedgerClient } from "../client";

export function registerAddRemoveInvoiceTool(server: McpServer) {
  server.tool(
    "ledger_consolidated_invoices_add_remove_invoice",
    "Add or remove individual invoices from a consolidated invoice",
    {
      bearerToken: z.string().min(1).describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      consolidatedInvoiceId: z.string().min(1).describe("ID of the consolidated invoice"),
      invoiceNumber: z.string().describe("Invoice number to add or remove"),
      action: z.enum(["add", "remove"]).describe("Action to perform"),
      invoiceData: z.object({
        amount: z.number().positive().optional().describe("Invoice amount"),
        dueDate: z.string().optional().describe("Invoice due date"),
        description: z.string().optional().describe("Invoice description"),
        notes: z.string().optional().describe("Additional notes")
      }).optional().describe("Invoice data for add action")
    },
    async ({ bearerToken, tenantId, consolidatedInvoiceId, invoiceNumber, action, invoiceData }) => {
      try {
        const client = createLedgerClient(bearerToken, tenantId);
        
        const endpoint = `/api/v1/ledger/consolidated-invoices/${consolidatedInvoiceId}/invoices/${invoiceNumber}`;
        let response;

        switch (action) {
          case "add":
            response = await client.post(endpoint, invoiceData || {});
            break;
          case "remove":
            response = await client.delete(endpoint);
            break;
        }

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                consolidatedInvoiceId: consolidatedInvoiceId,
                invoiceNumber: invoiceNumber,
                action: action,
                result: response,
                message: `Invoice ${action === "add" ? "added to" : "removed from"} consolidated invoice successfully`
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
                error: `Failed to ${action} invoice`,
                details: error.message,
                statusCode: error.status,
                consolidatedInvoiceId: consolidatedInvoiceId,
                invoiceNumber: invoiceNumber,
                action: action
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}