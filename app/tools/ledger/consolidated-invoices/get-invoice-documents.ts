/**
 * Get Invoice Documents Tool
 * Retrieves documents associated with a consolidated invoice
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../client";

export function registerGetInvoiceDocumentsTool(server: McpServer) {
  server.tool(
    "ledger_consolidated_invoices_get",
    "Get documents associated with a consolidated invoice including PDFs and supporting files",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      consolidatedInvoiceId: z.string().describe("ID of the consolidated invoice"),
      documentFilters: z.object({
        documentType: z.string().optional().describe("Filter by document type (pdf, excel, etc.)"),
        includeAttachments: z.boolean().optional().describe("Include attached documents"),
        dateFrom: z.string().optional().describe("Filter documents from date (YYYY-MM-DD)"),
        dateTo: z.string().optional().describe("Filter documents to date (YYYY-MM-DD)")
      }).optional().describe("Document filtering options")
    },
    async ({ bearerToken, tenantId, consolidatedInvoiceId, documentFilters }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const queryParams = new URLSearchParams();
        if (documentFilters) {
          Object.entries(documentFilters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              queryParams.append(key, value.toString());
            }
          });
        }
        
        const endpoint = `/api/v1/ledger/consolidated-invoices/${consolidatedInvoiceId}/documents${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        
        const response = await client.get(endpoint);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                consolidatedInvoiceId: consolidatedInvoiceId,
                documents: {
                  items: response.documents || response.data || response,
                  totalCount: Array.isArray(response.documents || response.data || response) ? (response.documents || response.data || response).length : 0,
                  documentTypes: response.documentTypes || [],
                  generatedAt: response.generatedAt,
                  lastUpdated: response.lastUpdated
                },
                documentFilters: documentFilters || {}
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
                error: "Failed to retrieve invoice documents",
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