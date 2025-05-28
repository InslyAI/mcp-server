/**
 * List E-proposals Tool
 * Gets paginated list of electronic proposals with filtering options
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createLedgerClient } from "../../client";

export function registerListEProposalsTool(server: McpServer) {
  server.tool(
    "ledger_sales_e_proposals_list",
    "Get paginated list of electronic proposals with advanced filtering, search capabilities, and sorting options",
    {
      bearerToken: z.string().min(1).describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      status: z.enum(['draft', 'submitted', 'under_review', 'approved', 'rejected', 'more_info_requested', 'conditionally_approved']).optional().describe("Filter by proposal status"),
      brokerId: z.string().optional().describe("Filter by specific broker ID"),
      productId: z.string().optional().describe("Filter by specific product ID"),
      assignedUnderwriter: z.string().optional().describe("Filter by assigned underwriter"),
      priority: z.enum(['normal', 'urgent', 'rush']).optional().describe("Filter by priority level"),
      submittedFrom: z.string().optional().describe("Filter by submission date from (ISO date)"),
      submittedTo: z.string().optional().describe("Filter by submission date to (ISO date)"),
      clientName: z.string().optional().describe("Filter by client name (partial match)"),
      proposalNumber: z.string().optional().describe("Filter by proposal number"),
      search: z.string().optional().describe("Search term for client name, proposal number, or notes"),
      page: z.number().int().min(1).optional().describe("Page number for pagination (default: 1) (starting from 1)"),
      limit: z.number().int().min(1).max(1000).optional().describe("Number of results per page (default: 20, max: 100) (1-1000)"),
      sortBy: z.enum(['submittedAt', 'lastUpdated', 'clientName', 'priority', 'status']).optional().describe("Field to sort by"),
      sortOrder: z.enum(['asc', 'desc']).optional().describe("Sort order (default: desc)"),
    },
    async ({ 
      bearerToken, 
      tenantId, 
      status,
      brokerId,
      productId,
      assignedUnderwriter,
      priority,
      submittedFrom,
      submittedTo,
      clientName,
      proposalNumber,
      search,
      page,
      limit,
      sortBy,
      sortOrder 
    }) => {
      try {
        const client = createLedgerClient(bearerToken, tenantId);
        
        const queryParams = new URLSearchParams();
        if (status) queryParams.append('status', status);
        if (brokerId) queryParams.append('broker_id', brokerId);
        if (productId) queryParams.append('product_id', productId);
        if (assignedUnderwriter) queryParams.append('assigned_underwriter', assignedUnderwriter);
        if (priority) queryParams.append('priority', priority);
        if (submittedFrom) queryParams.append('submitted_from', submittedFrom);
        if (submittedTo) queryParams.append('submitted_to', submittedTo);
        if (clientName) queryParams.append('client_name', clientName);
        if (proposalNumber) queryParams.append('proposal_number', proposalNumber);
        if (search) queryParams.append('search', search);
        if (page) queryParams.append('page', page.toString());
        if (limit) queryParams.append('limit', limit.toString());
        if (sortBy) queryParams.append('sort_by', sortBy);
        if (sortOrder) queryParams.append('sort_order', sortOrder);
        
        const response = await client.get(
          `/e-proposals?${queryParams.toString()}`
        );

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                eProposals: response.data.map((proposal: any) => ({
                  id: proposal.id,
                  proposalNumber: proposal.proposalNumber,
                  status: proposal.status,
                  productId: proposal.productId,
                  productName: proposal.productName,
                  brokerId: proposal.brokerId,
                  brokerName: proposal.brokerName,
                  clientName: proposal.clientData.name,
                  clientEmail: proposal.clientData.email,
                  submittedAt: proposal.submittedAt,
                  lastUpdated: proposal.lastUpdated,
                  priority: proposal.priority,
                  assignedUnderwriter: proposal.assignedUnderwriter,
                  workflowStage: proposal.workflowStage,
                  effectiveDate: proposal.coverageRequirements.effectiveDate
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
                  status,
                  brokerId,
                  productId,
                  assignedUnderwriter,
                  priority,
                  submittedFrom,
                  submittedTo,
                  clientName,
                  proposalNumber,
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
                error: "Failed to retrieve e-proposals",
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