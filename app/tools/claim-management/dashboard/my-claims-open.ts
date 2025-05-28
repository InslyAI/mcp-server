import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from 'zod';
import { createClaimManagementClient } from '../client';

export function registerMyClaimsOpenToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_dashboard_my_claims_open',
    'Get dashboard view of open claims assigned to the current user. Provides quick overview of active claims requiring attention.',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      page: z.number().optional().describe('Page number for pagination (default: 1)'),
      limit: z.number().optional().describe('Number of claims per page (default: 25)'),
      sortBy: z.string().optional().describe('Field to sort by (e.g., "created_at", "priority", "estimated_amount")'),
      sortOrder: z.enum(['asc', 'desc']).optional().describe('Sort order (default: desc)'),
    },
    async ({ bearerToken, tenantId, page, limit, sortBy, sortOrder }) => {
      try {
        const client = createClaimManagementClient(bearerToken, tenantId);
        
        // Build query parameters
        const params = new URLSearchParams();
        if (page) params.append('page', page.toString());
        if (limit) params.append('limit', limit.toString());
        if (sortBy) params.append('sort_by', sortBy);
        if (sortOrder) params.append('sort_order', sortOrder);
        
        const queryString = params.toString() ? `?${params.toString()}` : '';
        const result = await client.get(`/api/v1/claim-management/dashboard/my-claims/open${queryString}`);
        
        return {
          content: [{
            type: 'text' as const,
            text: JSON.stringify(result, null, 2)
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: 'text' as const,
            text: `Error getting open claims dashboard: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }
  );
}