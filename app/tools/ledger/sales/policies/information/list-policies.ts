/**
 * List Policies Tool
 * Retrieves a paginated list of policies with filtering options
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../../../client";

export function registerListPoliciesTool(server: McpServer) {
  server.tool(
    "ledger_sales_policies_information_list",
    "Get a paginated list of policies with comprehensive filtering and search options",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      filters: z.object({
        customerId: z.string().optional().describe("Filter by customer ID"),
        brokerId: z.string().optional().describe("Filter by broker ID"),
        productType: z.string().optional().describe("Filter by insurance product type"),
        status: z.array(z.string()).optional().describe("Filter by policy status (draft, active, expired, etc.)"),
        effectiveDateFrom: z.string().optional().describe("Filter by effective date from (YYYY-MM-DD)"),
        effectiveDateTo: z.string().optional().describe("Filter by effective date to (YYYY-MM-DD)"),
        expiryDateFrom: z.string().optional().describe("Filter by expiry date from (YYYY-MM-DD)"),
        expiryDateTo: z.string().optional().describe("Filter by expiry date to (YYYY-MM-DD)"),
        premiumMin: z.number().optional().describe("Minimum premium amount filter"),
        premiumMax: z.number().optional().describe("Maximum premium amount filter"),
        currency: z.string().optional().describe("Filter by currency code"),
        searchTerm: z.string().optional().describe("Search term for policy number, customer name, etc.")
      }).optional().describe("Filtering options"),
      pagination: z.object({
        page: z.number().optional().describe("Page number (default: 1)"),
        limit: z.number().optional().describe("Number of items per page (default: 20)"),
        sortBy: z.string().optional().describe("Field to sort by (createdAt, effectiveDate, premium, etc.)"),
        sortOrder: z.enum(["asc", "desc"]).optional().describe("Sort order (default: desc)")
      }).optional().describe("Pagination options")
    },
    async ({ bearerToken, tenantId, filters, pagination }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const queryParams = new URLSearchParams();
        
        // Add pagination parameters
        const page = pagination?.page || 1;
        const limit = pagination?.limit || 20;
        const sortBy = pagination?.sortBy || 'createdAt';
        const sortOrder = pagination?.sortOrder || 'desc';
        
        queryParams.append('page', page.toString());
        queryParams.append('limit', limit.toString());
        queryParams.append('sortBy', sortBy);
        queryParams.append('sortOrder', sortOrder);
        
        // Add filter parameters
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
        
        const response = await client.get(`/api/v1/ledger/sales/policies?${queryParams.toString()}`);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                policies: response.data || response,
                pagination: {
                  currentPage: page,
                  itemsPerPage: limit,
                  totalItems: response.total || response.totalCount || 0,
                  totalPages: Math.ceil((response.total || response.totalCount || 0) / limit),
                  hasNextPage: page * limit < (response.total || response.totalCount || 0),
                  hasPreviousPage: page > 1
                },
                filters: filters || {},
                metadata: {
                  searchExecutedAt: new Date().toISOString(),
                  sortBy: sortBy,
                  sortOrder: sortOrder
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
                error: "Failed to retrieve policies list",
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