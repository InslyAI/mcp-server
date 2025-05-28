/**
 * Get Customer Notes Tool
 * Retrieves notes and comments associated with a customer
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../client";

export function registerGetCustomerNotesTool(server: McpServer) {
  server.tool(
    "ledger_customers_get",
    "Get all notes and comments associated with a customer, including internal notes and customer communications",
    {
      bearerToken: z.string().min(1).describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      customerId: z.string().min(1).describe("ID of the customer to get notes for"),
      limit: z.number().optional().describe("Maximum number of notes to return"),
      offset: z.number().optional().describe("Number of notes to skip for pagination"),
      noteType: z.string().optional().describe("Filter by note type (internal, customer_communication, system, etc.)"),
      authorId: z.string().optional().describe("Filter by note author ID"),
      dateFrom: z.string().optional().describe("Start date for filtering notes (YYYY-MM-DD)"),
      dateTo: z.string().optional().describe("End date for filtering notes (YYYY-MM-DD)")
    },
    async ({ bearerToken, tenantId, customerId, limit, offset, noteType, authorId, dateFrom, dateTo }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const queryParams = new URLSearchParams();
        if (limit) queryParams.append('limit', limit.toString());
        if (offset) queryParams.append('offset', offset.toString());
        if (noteType) queryParams.append('note_type', noteType);
        if (authorId) queryParams.append('author_id', authorId);
        if (dateFrom) queryParams.append('date_from', dateFrom);
        if (dateTo) queryParams.append('date_to', dateTo);
        
        const endpoint = `/api/v1/ledger/customers/${customerId}/notes${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        
        const response = await client.get(endpoint);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                customerId: customerId,
                filters: {
                  noteType: noteType || "all",
                  authorId: authorId || null,
                  dateFrom: dateFrom || null,
                  dateTo: dateTo || null,
                  limit: limit || null,
                  offset: offset || 0
                },
                notes: {
                  items: response.notes || response.data || [],
                  totalCount: response.totalCount || 0,
                  hasMore: response.hasMore || false,
                  summary: {
                    internalNotes: response.summary?.internalNotes || 0,
                    customerCommunications: response.summary?.customerCommunications || 0,
                    systemNotes: response.summary?.systemNotes || 0,
                    importantNotes: response.summary?.importantNotes || 0
                  },
                  recentNotes: response.recentNotes || []
                }
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
                error: "Failed to retrieve customer notes",
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