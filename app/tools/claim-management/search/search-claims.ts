import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export function registerSearchClaimsToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_search_claims',
    'Advanced search across all claims with multiple filters and sorting options',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      
      // Basic Search
      query: z.string().optional().describe('Full-text search query across claim fields'),
      claimNumber: z.string().optional().describe('Exact or partial claim number match'),
      
      // Date Filters
      dateOfLossFrom: z.string().optional().describe('Search claims with date of loss from this date (YYYY-MM-DD)'),
      dateOfLossTo: z.string().optional().describe('Search claims with date of loss to this date (YYYY-MM-DD)'),
      reportedDateFrom: z.string().optional().describe('Search claims reported from this date (YYYY-MM-DD)'),
      reportedDateTo: z.string().optional().describe('Search claims reported to this date (YYYY-MM-DD)'),
      
      // Status and Type Filters
      claimStatus: z.array(z.string()).optional().describe('Filter by claim status (open, closed, pending, under-investigation, etc.)'),
      claimType: z.array(z.string()).optional().describe('Filter by claim type (auto, property, liability, workers-comp, etc.)'),
      lineOfBusiness: z.array(z.string()).optional().describe('Filter by line of business'),
      
      // Financial Filters
      totalIncurredFrom: z.number().optional().describe('Minimum total incurred amount'),
      totalIncurredTo: z.number().optional().describe('Maximum total incurred amount'),
      totalPaidFrom: z.number().optional().describe('Minimum total paid amount'),
      totalPaidTo: z.number().optional().describe('Maximum total paid amount'),
      reserveAmountFrom: z.number().optional().describe('Minimum reserve amount'),
      reserveAmountTo: z.number().optional().describe('Maximum reserve amount'),
      
      // Assignment Filters
      assignedAdjuster: z.array(z.string()).optional().describe('Filter by assigned adjuster ID or name'),
      assignedSupervisor: z.array(z.string()).optional().describe('Filter by assigned supervisor ID or name'),
      handlingOffice: z.array(z.string()).optional().describe('Filter by handling office or branch'),
      
      // Policy Filters
      policyNumber: z.string().optional().describe('Filter by policy number (exact or partial match)'),
      insuredName: z.string().optional().describe('Filter by insured name (partial match supported)'),
      policyType: z.array(z.string()).optional().describe('Filter by policy type'),
      
      // Location Filters
      lossLocation: z.string().optional().describe('Filter by loss location (city, state, or address)'),
      jurisdiction: z.array(z.string()).optional().describe('Filter by legal jurisdiction'),
      
      // Priority and Complexity
      priority: z.array(z.string()).optional().describe('Filter by priority level (low, medium, high, critical)'),
      complexity: z.array(z.string()).optional().describe('Filter by complexity level (simple, moderate, complex)'),
      
      // Litigation and Legal
      litigationStatus: z.array(z.string()).optional().describe('Filter by litigation status (none, potential, active, settled)'),
      attorneyInvolved: z.boolean().optional().describe('Filter claims with attorney involvement'),
      
      // Fraud and Investigation
      fraudIndicators: z.boolean().optional().describe('Filter claims with fraud indicators'),
      investigationStatus: z.array(z.string()).optional().describe('Filter by investigation status'),
      
      // Age and Duration
      ageInDaysFrom: z.number().optional().describe('Filter claims open for at least this many days'),
      ageInDaysTo: z.number().optional().describe('Filter claims open for at most this many days'),
      
      // Coverage and Deductible
      coverageType: z.array(z.string()).optional().describe('Filter by coverage type'),
      deductibleFrom: z.number().optional().describe('Minimum deductible amount'),
      deductibleTo: z.number().optional().describe('Maximum deductible amount'),
      
      // Tags and Categories
      tags: z.array(z.string()).optional().describe('Filter by custom tags'),
      categories: z.array(z.string()).optional().describe('Filter by claim categories'),
      
      // Sorting and Pagination
      sortBy: z.string().optional().describe('Sort field (dateOfLoss, reportedDate, totalIncurred, claimNumber, etc.)'),
      sortOrder: z.enum(['asc', 'desc']).optional().describe('Sort order (ascending or descending)'),
      page: z.number().optional().describe('Page number for pagination (default: 1)'),
      limit: z.number().optional().describe('Number of results per page (default: 50, max: 1000)'),
      
      // Advanced Options
      includeClosedClaims: z.boolean().optional().describe('Include closed claims in results (default: true)'),
      includeSubrogation: z.boolean().optional().describe('Include subrogation information'),
      includeReinsurance: z.boolean().optional().describe('Include reinsurance information'),
      includeDocumentCount: z.boolean().optional().describe('Include document count for each claim'),
      fieldSelection: z.array(z.string()).optional().describe('Specific fields to return (for performance optimization)')
    },
    async ({ bearerToken, tenantId, ...searchParams }) => {
      try {
        const queryParams = new URLSearchParams();
        
        // Add all search parameters to query string
        Object.entries(searchParams).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
              value.forEach(item => queryParams.append(key, item.toString()));
            } else {
              queryParams.append(key, value.toString());
            }
          }
        });
        
        const response = await fetch(`/api/v1/claim-management/search/claims?${queryParams.toString()}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${bearerToken}`,
            'Content-Type': 'application/json',
            'X-Tenant-ID': tenantId
          }
        });

        if (!response.ok) {
          const errorData = await response.text();
          return {
            content: [{
              type: 'text' as const,
              text: `Error searching claims: ${response.status} ${response.statusText} - ${errorData}`
            }]
          };
        }

        const result = await response.json();
        return {
          content: [{
            type: 'text' as const,
            text: JSON.stringify({
              success: true,
              data: result,
              message: `Found ${result.totalCount || result.claims?.length || 0} claims matching search criteria`
            }, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text' as const,
            text: `Error searching claims: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }
  );
}
