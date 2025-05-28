/**
 * List High Risk Cases Tool
 * Gets paginated list of high-risk cases requiring special handling
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../../client";

export function registerListHighRiskCasesTool(server: McpServer) {
  server.tool(
    "ledger_list_high_risk_cases",
    "Get paginated list of high-risk cases requiring special underwriting attention and management",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      status: z.enum(['open', 'under_review', 'pending_decision', 'approved', 'declined', 'escalated', 'resolved']).optional().describe("Filter by case status"),
      riskLevel: z.enum(['high', 'critical', 'extreme']).optional().describe("Filter by risk level"),
      assignedTo: z.string().optional().describe("Filter by assigned underwriter or specialist"),
      productId: z.string().optional().describe("Filter by specific product ID"),
      createdFrom: z.string().optional().describe("Filter by creation date from (ISO date)"),
      createdTo: z.string().optional().describe("Filter by creation date to (ISO date)"),
      escalationLevel: z.enum(['standard', 'senior', 'executive', 'board']).optional().describe("Filter by escalation level"),
      riskCategory: z.array(z.string()).optional().describe("Filter by risk categories (e.g., ['financial', 'operational', 'regulatory'])"),
      search: z.string().optional().describe("Search term for case details, client name, or risk factors"),
      page: z.number().optional().describe("Page number for pagination (default: 1)"),
      limit: z.number().optional().describe("Number of results per page (default: 20, max: 100)"),
      sortBy: z.enum(['createdAt', 'riskLevel', 'status', 'assignedTo', 'escalationLevel']).optional().describe("Field to sort by"),
      sortOrder: z.enum(['asc', 'desc']).optional().describe("Sort order (default: desc)"),
    },
    async ({ 
      bearerToken, 
      tenantId, 
      status,
      riskLevel,
      assignedTo,
      productId,
      createdFrom,
      createdTo,
      escalationLevel,
      riskCategory,
      search,
      page,
      limit,
      sortBy,
      sortOrder 
    }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const queryParams = new URLSearchParams();
        if (status) queryParams.append('status', status);
        if (riskLevel) queryParams.append('risk_level', riskLevel);
        if (assignedTo) queryParams.append('assigned_to', assignedTo);
        if (productId) queryParams.append('product_id', productId);
        if (createdFrom) queryParams.append('created_from', createdFrom);
        if (createdTo) queryParams.append('created_to', createdTo);
        if (escalationLevel) queryParams.append('escalation_level', escalationLevel);
        if (riskCategory) riskCategory.forEach(cat => queryParams.append('risk_category[]', cat));
        if (search) queryParams.append('search', search);
        if (page) queryParams.append('page', page.toString());
        if (limit) queryParams.append('limit', limit.toString());
        if (sortBy) queryParams.append('sort_by', sortBy);
        if (sortOrder) queryParams.append('sort_order', sortOrder);
        
        const response = await client.get(
          `/high-risk-cases?${queryParams.toString()}`
        );

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                highRiskCases: response.data.map((riskCase: any) => ({
                  id: riskCase.id,
                  caseNumber: riskCase.caseNumber,
                  status: riskCase.status,
                  riskLevel: riskCase.riskLevel,
                  riskScore: riskCase.riskScore,
                  productId: riskCase.productId,
                  productName: riskCase.productName,
                  clientName: riskCase.clientName,
                  brokerId: riskCase.brokerId,
                  brokerName: riskCase.brokerName,
                  assignedTo: riskCase.assignedTo,
                  assignedToName: riskCase.assignedToName,
                  createdAt: riskCase.createdAt,
                  lastUpdated: riskCase.lastUpdated,
                  escalationLevel: riskCase.escalationLevel,
                  riskCategories: riskCase.riskCategories,
                  priority: riskCase.priority,
                  reviewDeadline: riskCase.reviewDeadline,
                  riskSummary: riskCase.riskSummary
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
                  riskLevel,
                  assignedTo,
                  productId,
                  createdFrom,
                  createdTo,
                  escalationLevel,
                  riskCategory,
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
                error: "Failed to retrieve high-risk cases",
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