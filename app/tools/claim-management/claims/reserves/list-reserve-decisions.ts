import { z } from 'zod';
import { createClaimManagementClient } from '../../client';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export function registerListReserveDecisionsToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_claims_reserves_decisions_list',
    'Get list of decisions made on a specific reserve',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      claim: z.string().describe('Claim identifier (claim number or UUID)'),
      reserve: z.string().describe('Reserve identifier to get decisions for'),
      limit: z.number().optional().describe('Maximum number of decisions to return'),
      offset: z.number().optional().describe('Number of decisions to skip for pagination'),
      sortBy: z.string().optional().describe('Field to sort by (e.g., date, type, decision)'),
      sortOrder: z.enum(['asc', 'desc']).optional().describe('Sort order'),
      decisionType: z.string().optional().describe('Filter by decision type'),
      fromDate: z.string().optional().describe('Filter decisions from date (ISO 8601)'),
      toDate: z.string().optional().describe('Filter decisions to date (ISO 8601)')
    },
    async ({ bearerToken, tenantId, claim, reserve, ...params }: any) => {
      try {
        const client = createClaimManagementClient(bearerToken, tenantId);
        
        // Build query parameters
        const queryParams = new URLSearchParams();
        if (params.limit !== undefined) queryParams.append('limit', params.limit.toString());
        if (params.offset !== undefined) queryParams.append('offset', params.offset.toString());
        if (params.sortBy) queryParams.append('sort_by', params.sortBy);
        if (params.sortOrder) queryParams.append('sort_order', params.sortOrder);
        if (params.decisionType) queryParams.append('decision_type', params.decisionType);
        if (params.fromDate) queryParams.append('from_date', params.fromDate);
        if (params.toDate) queryParams.append('to_date', params.toDate);
        
        const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
        const result = await client.get(`/api/v1/claim-management/claims/${claim}/reserves/${reserve}/decisions${queryString}`);
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              success: true,
              data: result,
              message: 'Reserve decisions retrieved successfully'
            }, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text', 
            text: JSON.stringify({
              success: false,
              error: error.message || 'Failed to get reserve decisions',
              details: error.response?.data || error
            }, null, 2)
          }]
        };
      }
    }
  );
}
