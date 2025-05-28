import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { createClaimManagementClient } from '../client';

export function registerStoreClaimToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_fnol_store_claim',
    'Create FNOL (First Notice of Loss) claim using the working FNOL API structure',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      data: z.record(z.any()).describe('FNOL data with dotted field names (e.g., "claim.data.policyNo", "objects.0.data.name", "persons.0.data.name")')
    },
    async ({ bearerToken, tenantId, ...claimData }: any) => {
      try {
        const client = createClaimManagementClient(bearerToken, tenantId);
        const result = await client.post('/api/v1/claim-management/fnol', claimData);
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              success: true,
              data: result,
              message: 'Claim stored successfully'
            }, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text', 
            text: JSON.stringify({
              success: false,
              error: error.message || 'Failed to store claim',
              details: error.response?.data || error
            }, null, 2)
          }]
        };
      }
    }
  );
}
