import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { createClaimManagementClient } from '../client';

export function registerGetFnolToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_fnol_get',
    'Get FNOL (First Notice of Loss) data for a specific claim',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      claim: z.string().describe('Claim identifier (claim number or UUID)')
    },
    async ({ bearerToken, tenantId, claim }) => {
      try {
        const client = createClaimManagementClient(bearerToken, tenantId);
        const result = await client.get(`/api/v1/claim-management/claims/${claim}/fnol`);
        
        return {
          content: [{
            type: 'text' as const,
            text: JSON.stringify({
              success: true,
              data: result,
              message: 'FNOL data retrieved successfully'
            }, null, 2)
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: 'text' as const,
            text: `Error retrieving FNOL data: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }
  );
}
