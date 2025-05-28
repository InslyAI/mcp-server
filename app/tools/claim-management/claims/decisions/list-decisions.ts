import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { createClaimManagementClient } from '../../client';

export function registerListDecisionsToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_claims_decisions_list',
    'Get list of indemnity decisions for a claim with filtering and pagination options.',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      claim: z.string().describe('Claim identifier (claim number or UUID)'),
      status: z.string().optional().describe('Filter by decision status (e.g., "pending", "approved", "rejected")'),
      decisionType: z.string().optional().describe('Filter by decision type (e.g., "coverage", "liability", "settlement")'),
      fromDate: z.string().optional().describe('Filter decisions from date (ISO 8601 format)'),
      toDate: z.string().optional().describe('Filter decisions to date (ISO 8601 format)'),
      page: z.number().optional().describe('Page number for pagination (default: 1)'),
      limit: z.number().optional().describe('Number of decisions per page (default: 25)'),
      sortBy: z.string().optional().describe('Field to sort by (e.g., "created_at", "decision_date")'),
      sortOrder: z.enum(['asc', 'desc']).optional().describe('Sort order (default: desc)')
    },
    async ({ bearerToken, tenantId, claim, status, decisionType, fromDate, toDate, page, limit, sortBy, sortOrder }) => {
      try {
        const client = createClaimManagementClient(bearerToken, tenantId);
        
        // Build query parameters
        const params = new URLSearchParams();
        if (status) params.append('status', status);
        if (decisionType) params.append('decision_type', decisionType);
        if (fromDate) params.append('from_date', fromDate);
        if (toDate) params.append('to_date', toDate);
        if (page) params.append('page', page.toString());
        if (limit) params.append('limit', limit.toString());
        if (sortBy) params.append('sort_by', sortBy);
        if (sortOrder) params.append('sort_order', sortOrder);
        
        const queryString = params.toString() ? `?${params.toString()}` : '';
        const result = await client.get(`/api/v1/claim-management/claims/${claim}/decisions${queryString}`);
        
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
            text: `Error listing decisions: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }
  );
}
