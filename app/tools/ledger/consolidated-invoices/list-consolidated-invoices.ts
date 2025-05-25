/**
 * List Consolidated Invoices Tool
 * Retrieves paginated list of consolidated invoices
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../client";

export function registerListConsolidatedInvoicesTool(server: McpServer) {
  server.tool(
    "ledger_list_consolidated_invoices",
    "Get paginated list of consolidated invoices with filtering options",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      filters: z.object({
        brokerId: z.string().optional().describe("Filter by broker ID"),
        status: z.array(z.string()).optional().describe("Filter by invoice status"),
        dateFrom: z.string().optional().describe("Start date filter (YYYY-MM-DD)"),
        dateTo: z.string().optional().describe("End date filter (YYYY-MM-DD)"),
        minAmount: z.number().optional().describe("Minimum invoice amount"),
        maxAmount: z.number().optional().describe("Maximum invoice amount")
      }).optional().describe("Filter parameters"),
      pagination: z.object({
        page: z.number().optional().describe("Page number (default: 1)"),
        limit: z.number().optional().describe("Items per page (default: 20)")
      }).optional().describe("Pagination parameters")
    },
    async ({ bearerToken, tenantId, filters, pagination }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const queryParams = new URLSearchParams();
        
        if (pagination?.page) queryParams.append('page', pagination.page.toString());
        if (pagination?.limit) queryParams.append('limit', pagination.limit.toString());
        
        if (filters) {
          Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              if (Array.isArray(value)) {
                value.forEach(v => queryParams.append(`${key}[]`, v.toString()));
              } else {
                queryParams.append(key, value.toString());
              }
            }
          });
        }
        
        const response = await client.get(`/api/v1/ledger/consolidated-invoices?${queryParams.toString()}`);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                invoices: response.data || response,
                pagination: {
                  currentPage: pagination?.page || 1,
                  itemsPerPage: pagination?.limit || 20,
                  totalItems: response.total || 0,
                  totalPages: Math.ceil((response.total || 0) / (pagination?.limit || 20))
                },
                filters: filters || {}
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
                error: "Failed to retrieve consolidated invoices",
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