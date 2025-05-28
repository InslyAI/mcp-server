/**
 * List Endorsements Tool
 * Gets paginated list of endorsements with filtering options
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../../client";

export function registerListEndorsementsTool(server: McpServer) {
  server.tool(
    "ledger_sales_endorsements_list",
    "Get paginated list of policy endorsements with advanced filtering, search capabilities, and sorting options",
    {
      bearerToken: z.string().min(1).describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      policyId: z.string().optional().describe("Filter by specific policy ID"),
      status: z.enum(['draft', 'pending_approval', 'approved', 'rejected', 'issued']).optional().describe("Filter by endorsement status"),
      type: z.string().optional().describe("Filter by endorsement type"),
      dateFrom: z.string().optional().describe("Filter by effective date from (ISO date)"),
      dateTo: z.string().optional().describe("Filter by effective date to (ISO date)"),
      requestedBy: z.string().optional().describe("Filter by who requested the endorsement"),
      search: z.string().optional().describe("Search term for endorsement reason or description"),
      page: z.number().int().min(1).optional().describe("Page number for pagination (default: 1) (starting from 1)"),
      limit: z.number().int().min(1).max(1000).optional().describe("Number of results per page (default: 20, max: 100) (1-1000)"),
      sortBy: z.enum(['effectiveDate', 'createdAt', 'updatedAt', 'premiumAdjustment']).optional().describe("Field to sort by"),
      sortOrder: z.enum(['asc', 'desc']).optional().describe("Sort order (default: desc)"),
    },
    async ({ 
      bearerToken, 
      tenantId, 
      policyId,
      status,
      type,
      dateFrom,
      dateTo,
      requestedBy,
      search,
      page,
      limit,
      sortBy,
      sortOrder 
    }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const queryParams = new URLSearchParams();
        if (policyId) queryParams.append('policy_id', policyId);
        if (status) queryParams.append('status', status);
        if (type) queryParams.append('type', type);
        if (dateFrom) queryParams.append('date_from', dateFrom);
        if (dateTo) queryParams.append('date_to', dateTo);
        if (requestedBy) queryParams.append('requested_by', requestedBy);
        if (search) queryParams.append('search', search);
        if (page) queryParams.append('page', page.toString());
        if (limit) queryParams.append('limit', limit.toString());
        if (sortBy) queryParams.append('sort_by', sortBy);
        if (sortOrder) queryParams.append('sort_order', sortOrder);
        
        const response = await client.get(
          `/endorsements?${queryParams.toString()}`
        );

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                endorsements: response.data.map((endorsement: any) => ({
                  id: endorsement.id,
                  policyId: endorsement.policyId,
                  policyNumber: endorsement.policyNumber,
                  type: endorsement.type,
                  status: endorsement.status,
                  reason: endorsement.reason,
                  effectiveDate: endorsement.effectiveDate,
                  createdAt: endorsement.createdAt,
                  requestedBy: endorsement.requestedBy,
                  premiumAdjustment: endorsement.premiumAdjustment,
                  endorsementNumber: endorsement.endorsementNumber
                })),
                pagination: {
                  currentPage: response.pagination.currentPage,
                  totalPages: response.pagination.totalPages,
                  totalItems: response.pagination.totalItems,
                  itemsPerPage: response.pagination.itemsPerPage,
                  hasNext: response.pagination.hasNext,
                  hasPrevious: response.pagination.hasPrevious
                },
                filters: {
                  policyId,
                  status,
                  type,
                  dateFrom,
                  dateTo,
                  requestedBy,
                  search
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
                error: "Failed to retrieve endorsements",
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