/**
 * List Claims Tool
 * Gets paginated list of insurance claims with filtering options
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../client";

export function registerListClaimsTool(server: McpServer) {
  server.tool(
    "ledger_list_claims",
    "Get paginated list of insurance claims with comprehensive filtering and search options",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      status: z.enum(['reported', 'under_investigation', 'approved', 'denied', 'closed', 'reopened', 'settled']).optional().describe("Filter by claim status"),
      claimType: z.array(z.string()).optional().describe("Filter by claim types (e.g., ['property', 'liability', 'auto'])"),
      policyId: z.string().optional().describe("Filter by specific policy ID"),
      claimantName: z.string().optional().describe("Filter by claimant name"),
      adjusterId: z.string().optional().describe("Filter by assigned adjuster ID"),
      reportedFrom: z.string().optional().describe("Filter by report date from (ISO date)"),
      reportedTo: z.string().optional().describe("Filter by report date to (ISO date)"),
      lossDateFrom: z.string().optional().describe("Filter by loss date from (ISO date)"),
      lossDateTo: z.string().optional().describe("Filter by loss date to (ISO date)"),
      amountFrom: z.number().optional().describe("Filter by claim amount from"),
      amountTo: z.number().optional().describe("Filter by claim amount to"),
      reserveFrom: z.number().optional().describe("Filter by reserve amount from"),
      reserveTo: z.number().optional().describe("Filter by reserve amount to"),
      severity: z.enum(['minor', 'moderate', 'major', 'catastrophic']).optional().describe("Filter by claim severity"),
      productId: z.string().optional().describe("Filter by product type"),
      region: z.string().optional().describe("Filter by geographic region"),
      search: z.string().optional().describe("Search term for claim number, claimant, or description"),
      includeTotals: z.boolean().optional().describe("Whether to include financial totals summary"),
      page: z.number().optional().describe("Page number for pagination (default: 1)"),
      limit: z.number().optional().describe("Number of results per page (default: 20, max: 100)"),
      sortBy: z.enum(['reportedAt', 'lossDate', 'amount', 'reserve', 'status', 'severity']).optional().describe("Field to sort by"),
      sortOrder: z.enum(['asc', 'desc']).optional().describe("Sort order (default: desc)"),
    },
    async ({ 
      bearerToken, 
      tenantId, 
      status,
      claimType,
      policyId,
      claimantName,
      adjusterId,
      reportedFrom,
      reportedTo,
      lossDateFrom,
      lossDateTo,
      amountFrom,
      amountTo,
      reserveFrom,
      reserveTo,
      severity,
      productId,
      region,
      search,
      includeTotals,
      page,
      limit,
      sortBy,
      sortOrder 
    }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const queryParams = new URLSearchParams();
        if (status) queryParams.append('status', status);
        if (claimType) claimType.forEach(type => queryParams.append('claim_type[]', type));
        if (policyId) queryParams.append('policy_id', policyId);
        if (claimantName) queryParams.append('claimant_name', claimantName);
        if (adjusterId) queryParams.append('adjuster_id', adjusterId);
        if (reportedFrom) queryParams.append('reported_from', reportedFrom);
        if (reportedTo) queryParams.append('reported_to', reportedTo);
        if (lossDateFrom) queryParams.append('loss_date_from', lossDateFrom);
        if (lossDateTo) queryParams.append('loss_date_to', lossDateTo);
        if (amountFrom) queryParams.append('amount_from', amountFrom.toString());
        if (amountTo) queryParams.append('amount_to', amountTo.toString());
        if (reserveFrom) queryParams.append('reserve_from', reserveFrom.toString());
        if (reserveTo) queryParams.append('reserve_to', reserveTo.toString());
        if (severity) queryParams.append('severity', severity);
        if (productId) queryParams.append('product_id', productId);
        if (region) queryParams.append('region', region);
        if (search) queryParams.append('search', search);
        if (includeTotals) queryParams.append('include_totals', 'true');
        if (page) queryParams.append('page', page.toString());
        if (limit) queryParams.append('limit', limit.toString());
        if (sortBy) queryParams.append('sort_by', sortBy);
        if (sortOrder) queryParams.append('sort_order', sortOrder);
        
        const response = await client.get(
          `/claims?${queryParams.toString()}`
        );

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                claims: response.data.map((claim: any) => ({
                  id: claim.id,
                  claimNumber: claim.claimNumber,
                  status: claim.status,
                  claimType: claim.claimType,
                  severity: claim.severity,
                  policyId: claim.policyId,
                  policyNumber: claim.policyNumber,
                  claimantName: claim.claimantName,
                  claimantEmail: claim.claimantEmail,
                  claimantPhone: claim.claimantPhone,
                  adjusterId: claim.adjusterId,
                  adjusterName: claim.adjusterName,
                  reportedAt: claim.reportedAt,
                  lossDate: claim.lossDate,
                  lossLocation: claim.lossLocation,
                  lossDescription: claim.lossDescription,
                  claimAmount: claim.claimAmount,
                  reserveAmount: claim.reserveAmount,
                  paidAmount: claim.paidAmount,
                  currency: claim.currency,
                  productId: claim.productId,
                  productName: claim.productName,
                  region: claim.region,
                  lastUpdated: claim.lastUpdated,
                  daysOpen: claim.daysOpen
                })),
                pagination: {
                  currentPage: response.pagination.currentPage,
                  totalPages: response.pagination.totalPages,
                  totalItems: response.pagination.totalItems,
                  itemsPerPage: response.pagination.itemsPerPage,
                  hasNext: response.pagination.hasNext,
                  hasPrevious: response.pagination.hasPrevious
                },
                ...(includeTotals && {
                  totals: {
                    totalClaims: response.totals.totalClaims,
                    totalClaimAmount: response.totals.totalClaimAmount,
                    totalReserveAmount: response.totals.totalReserveAmount,
                    totalPaidAmount: response.totals.totalPaidAmount,
                    averageClaimAmount: response.totals.averageClaimAmount,
                    currency: response.totals.currency
                  }
                }),
                filters: {
                  status,
                  claimType,
                  policyId,
                  claimantName,
                  adjusterId,
                  reportedFrom,
                  reportedTo,
                  lossDateFrom,
                  lossDateTo,
                  amountFrom,
                  amountTo,
                  reserveFrom,
                  reserveTo,
                  severity,
                  productId,
                  region,
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
                error: "Failed to retrieve claims",
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