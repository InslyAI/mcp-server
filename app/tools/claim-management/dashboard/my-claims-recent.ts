import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export function registerMyClaimsRecentToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_dashboard_my_claims_recent',
    'Get dashboard view of recently accessed/modified claims for the current user',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      
      // Time Range Options
      daysBack: z.number().optional().describe('Number of days to look back for recent activity (default: 7)'),
      activityType: z.array(z.enum(['viewed', 'modified', 'commented', 'assigned', 'status-changed'])).optional().describe('Types of activity to consider as "recent"'),
      
      // Pagination
      limit: z.number().optional().describe('Number of recent claims to return (default: 20, max: 100)'),
      offset: z.number().optional().describe('Offset for pagination'),
      
      // Sorting
      sortBy: z.enum(['lastAccessed', 'lastModified', 'claimNumber', 'dateOfLoss']).optional().describe('Sort field (default: lastAccessed)'),
      sortOrder: z.enum(['asc', 'desc']).optional().describe('Sort order (default: desc)'),
      
      // Include Options
      includeClaimDetails: z.boolean().optional().describe('Include detailed claim information'),
      includeActivitySummary: z.boolean().optional().describe('Include recent activity summary'),
      includeAssignmentInfo: z.boolean().optional().describe('Include assignment and ownership details'),
      
      // Filters
      claimStatus: z.array(z.string()).optional().describe('Filter by claim status'),
      claimType: z.array(z.string()).optional().describe('Filter by claim type'),
      priority: z.array(z.string()).optional().describe('Filter by priority level')
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
        
        const response = await fetch(`/api/v1/claim-management/dashboard/my-claims/recent?${queryParams.toString()}`, {
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
              text: `Error getting recent claims dashboard: ${response.status} ${response.statusText} - ${errorData}`
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
              message: `Retrieved ${result.claims?.length || 0} recent claims from dashboard`
            }, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text' as const,
            text: `Error getting recent claims dashboard: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }
  );
}
