import { z } from 'zod';
import { createClaimManagementClient } from '../../client';

const GetClaimSchema = z.object({
  bearerToken: z.string().describe('JWT bearer token from identifier_login'),
  tenantId: z.string().describe('Tenant identifier for the organization'),
  claim: z.string().describe('Claim identifier (claim number or UUID)'),
});

export function registerGetClaimToolClaimManagement(server: any) {
  server.setRequestHandler('tools/list', async () => ({
    tools: [{
      name: 'claim_management_claims_get',
      description: 'Get detailed information about a specific claim, including all related data such as status, amounts, parties involved, and history.',
      inputSchema: GetClaimSchema,
    }]
  }));

  server.setRequestHandler('tools/call', async (request) => {
    if (request.params.name === 'claim_management_claims_get') {
      try {
        const { bearerToken, tenantId, claim } = GetClaimSchema.parse(request.params.arguments);
        
        const client = createClaimManagementClient(bearerToken, tenantId);
        const result = await client.get(`/api/v1/claim-management/claims/${claim}`);
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(result, null, 2)
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: 'text',
            text: `Error getting claim: ${error instanceof Error ? error.message : 'Unknown error'}`
          }],
          isError: true
        };
      }
    }
  });
}