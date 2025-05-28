/**
 * Issue Consolidated Invoice Tool
 * Issues a consolidated invoice to make it final and binding
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createLedgerClient } from "../client";

export function registerIssueConsolidatedInvoiceTool(server: McpServer) {
  server.tool(
    "ledger_consolidated_invoices_issue",
    "Issue a consolidated invoice to make it final and binding for payment",
    {
      bearerToken: z.string().min(1).describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      consolidatedInvoiceId: z.string().min(1).describe("ID of the consolidated invoice to issue"),
      issuanceData: z.object({
        issueDate: z.string().optional().describe("Date of issuance (defaults to current date)"),
        dueDate: z.string().describe("Payment due date for the invoice"),
        paymentTerms: z.string().optional().describe("Payment terms and conditions"),
        notes: z.string().optional().describe("Additional notes for the issued invoice"),
        sendNotification: z.boolean().optional().describe("Whether to send notification to customer"),
        notificationEmail: z.string().email().optional().describe("Email address for notification"),
        generateDocuments: z.boolean().optional().describe("Whether to generate PDF documents")
      }).describe("Invoice issuance configuration")
    },
    async ({ bearerToken, tenantId, consolidatedInvoiceId, issuanceData }) => {
      try {
        const client = createLedgerClient(bearerToken, tenantId);
        
        const response = await client.post(`/api/v1/ledger/consolidated-invoices/${consolidatedInvoiceId}/issue`, issuanceData);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                message: "Consolidated invoice issued successfully",
                consolidatedInvoiceId: consolidatedInvoiceId,
                invoiceNumber: response.invoiceNumber || response.data?.invoiceNumber,
                issueDate: issuanceData.issueDate || new Date().toISOString().split('T')[0],
                dueDate: issuanceData.dueDate,
                status: "issued",
                totalAmount: response.totalAmount,
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
                error: "Failed to issue consolidated invoice",
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