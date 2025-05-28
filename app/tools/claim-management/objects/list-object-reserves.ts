import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { createClaimManagementClient } from '../client';

export function registerListObjectReservesToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_objects_list_reserves',
    'Get list of reserves set for a specific claim object',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      claim: z.string().describe('Claim identifier (claim number or UUID)'),
      object: z.string().describe('Object identifier to get reserves for'),
      status: z.string().optional().describe('Filter by reserve status'),
      reserveType: z.string().optional().describe('Filter by reserve type'),
      includeHistory: z.boolean().optional().describe('Whether to include reserve history')
    },
    async ({ bearerToken, tenantId, claim, object, status, reserveType, includeHistory }) => {
      try {
        const client = createClaimManagementClient(bearerToken, tenantId);
        
        // Build query parameters
        const params = new URLSearchParams();
        if (status) params.append('status', status);
        if (reserveType) params.append('reserve_type', reserveType);
        if (includeHistory !== undefined) params.append('include_history', includeHistory.toString());
        
        const queryString = params.toString() ? `?${params.toString()}` : '';
        const result = await client.get(`/api/v1/claim-management/claims/${claim}/objects/${object}/reserves${queryString}`);
        
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
            text: `Error listing object reserves: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }
  );
}
