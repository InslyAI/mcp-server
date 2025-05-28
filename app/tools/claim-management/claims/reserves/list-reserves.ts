import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from 'zod';
import { createClaimManagementClient } from '../../client';

export function registerListReservesToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_claims_reserves_list',
    'Get list of financial reserves set for a claim, including amounts, status, and authorization details.',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      claim: z.string().describe('Claim identifier (claim number or UUID)'),
      status: z.string().optional().describe('Filter by reserve status (e.g., "pending", "authorized", "cleared")'),
      reserveType: z.string().optional().describe('Filter by reserve type (e.g., "indemnity", "expenses", "legal")'),
      includeCleared: z.boolean().optional().describe('Whether to include cleared reserves (default: false)'),
      page: z.number().optional().describe('Page number for pagination (default: 1)'),
      limit: z.number().optional().describe('Number of reserves per page (default: 25)'),
    },
    async ({ bearerToken, tenantId, claim, status, reserveType, includeCleared, page, limit }) => {
      try {
        const client = createClaimManagementClient(bearerToken, tenantId);
        
        // Build query parameters
        const params = new URLSearchParams();
        if (status) params.append('status', status);
        if (reserveType) params.append('reserve_type', reserveType);
        if (includeCleared !== undefined) params.append('include_cleared', includeCleared.toString());
        if (page) params.append('page', page.toString());
        if (limit) params.append('limit', limit.toString());
        
        const queryString = params.toString() ? `?${params.toString()}` : '';
        const result = await client.get(`/api/v1/claim-management/claims/${claim}/reserves${queryString}`);
        
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
            text: `Error listing claim reserves: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }
  );
}