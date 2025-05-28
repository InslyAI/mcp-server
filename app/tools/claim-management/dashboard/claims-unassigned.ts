import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export function registerClaimsUnassignedToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_dashboard_claims_unassigned',
    'Get dashboard view of unassigned claims that need attention',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      
      // Priority and Urgency Filters
      priority: z.array(z.string()).optional().describe('Filter by priority level (high, medium, low, critical)'),
      urgency: z.array(z.string()).optional().describe('Filter by urgency level'),
      
      // Time-based Filters
      unassignedForDays: z.number().optional().describe('Claims unassigned for at least this many days'),
      reportedSince: z.string().optional().describe('Claims reported since this date (YYYY-MM-DD)'),
      dateOfLossSince: z.string().optional().describe('Claims with date of loss since this date (YYYY-MM-DD)'),
      
      // Claim Type and Status Filters
      claimType: z.array(z.string()).optional().describe('Filter by claim type'),
      claimStatus: z.array(z.string()).optional().describe('Filter by claim status'),
      lineOfBusiness: z.array(z.string()).optional().describe('Filter by line of business'),
      
      // Geographic Filters
      region: z.array(z.string()).optional().describe('Filter by geographic region'),
      state: z.array(z.string()).optional().describe('Filter by state/province'),
      handlingOffice: z.array(z.string()).optional().describe('Filter by handling office'),
      
      // Financial Filters
      totalIncurredMin: z.number().optional().describe('Minimum total incurred amount'),
      totalIncurredMax: z.number().optional().describe('Maximum total incurred amount'),
      reserveAmountMin: z.number().optional().describe('Minimum reserve amount'),
      
      // Assignment Readiness
      readyForAssignment: z.boolean().optional().describe('Only claims ready for assignment (all required info complete)'),
      missingInformation: z.boolean().optional().describe('Include claims missing required information'),
      
      // Complexity and Special Handling
      complexity: z.array(z.string()).optional().describe('Filter by complexity level'),
      requiresSpecialist: z.boolean().optional().describe('Claims requiring specialist assignment'),
      fraudIndicators: z.boolean().optional().describe('Claims with fraud indicators'),
      litigationPotential: z.boolean().optional().describe('Claims with litigation potential'),
      
      // Sorting Options
      sortBy: z.enum(['reportedDate', 'dateOfLoss', 'totalIncurred', 'priority', 'unassignedDuration']).optional().describe('Sort field (default: reportedDate)'),
      sortOrder: z.enum(['asc', 'desc']).optional().describe('Sort order (default: desc)'),
      
      // Pagination
      limit: z.number().optional().describe('Number of claims to return (default: 50, max: 200)'),
      offset: z.number().optional().describe('Offset for pagination'),
      
      // Include Options
      includeClaimDetails: z.boolean().optional().describe('Include detailed claim information'),
      includeAssignmentHistory: z.boolean().optional().describe('Include previous assignment attempts'),
      includeAvailableAdjusters: z.boolean().optional().describe('Include list of available adjusters for assignment'),
      includeRecommendations: z.boolean().optional().describe('Include AI-powered assignment recommendations'),
      
      // Grouping Options
      groupBy: z.enum(['priority', 'claimType', 'region', 'complexity', 'none']).optional().describe('Group results by specified field'),
      
      // Assignment Pool Filters
      requiredSkills: z.array(z.string()).optional().describe('Skills required for assignment'),
      excludeOnVacation: z.boolean().optional().describe('Exclude adjusters currently on vacation'),
      maxWorkload: z.number().optional().describe('Maximum current workload for potential assignees')
    },
    async ({ bearerToken, tenantId, ...params }) => {
      try {
        const queryParams = new URLSearchParams();
        
        // Add query parameters
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
              value.forEach(item => queryParams.append(key, item.toString()));
            } else {
              queryParams.append(key, value.toString());
            }
          }
        });
        
        const response = await fetch(`/api/v1/claim-management/dashboard/claims/unassigned?${queryParams.toString()}`, {
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
              text: `Error getting unassigned claims dashboard: ${response.status} ${response.statusText} - ${errorData}`
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
              message: `Retrieved ${result.claims?.length || 0} unassigned claims from dashboard`
            }, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text' as const,
            text: `Error getting unassigned claims dashboard: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }
  );
}
