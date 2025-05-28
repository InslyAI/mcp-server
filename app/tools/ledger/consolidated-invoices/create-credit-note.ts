/**
 * Create Credit Note Tool
 * Creates a credit note for a consolidated invoice
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createLedgerClient } from "../client";

export function registerCreateCreditNoteTool(server: McpServer) {
  server.tool(
    "ledger_consolidated_invoices_credit_note_create",
    "Create a credit note for a consolidated invoice to handle refunds or adjustments",
    {
      bearerToken: z.string().min(1).describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      consolidatedInvoiceId: z.string().min(1).describe("ID of the consolidated invoice to credit"),
      creditData: z.object({
        creditAmount: z.number().positive().describe("Amount to credit"),
        creditReason: z.string().describe("Reason for the credit note"),
        creditType: z.string().optional().describe("Type of credit (refund, adjustment, error, etc.)"),
        affectedInvoices: z.array(z.string()).optional().describe("Specific invoice numbers affected"),
        notes: z.string().optional().describe("Additional notes for the credit"),
        issueDate: z.string().optional().describe("Credit note issue date (defaults to current date)"),
        refundMethod: z.string().optional().describe("Method for refund if applicable"),
        approvedBy: z.string().optional().describe("User ID who approved the credit"),
        sendNotification: z.boolean().optional().describe("Whether to notify customer of credit")
      }).describe("Credit note configuration")
    },
    async ({ bearerToken, tenantId, consolidatedInvoiceId, creditData }) => {
      try {
        const client = createLedgerClient(bearerToken, tenantId);
        
        const response = await client.post(`/api/v1/ledger/consolidated-invoices/${consolidatedInvoiceId}/credit`, creditData);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                message: "Credit note created successfully",
                consolidatedInvoiceId: consolidatedInvoiceId,
                creditNoteId: response.creditNoteId || response.data?.id,
                creditNoteNumber: response.creditNoteNumber,
                creditAmount: creditData.creditAmount,
                creditReason: creditData.creditReason,
                issueDate: creditData.issueDate || new Date().toISOString().split('T')[0],
                status: "issued",
                response: response
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
                error: "Failed to create credit note",
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