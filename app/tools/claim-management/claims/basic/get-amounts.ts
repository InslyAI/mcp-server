import { z } from 'zod';
import { createClaimManagementClient } from '../../client';

const GetAmountsSchema = z.object({
  bearerToken: z.string().describe('JWT bearer token from identifier_login'),
  tenantId: z.string().describe('Tenant identifier for the organization'),
  claim: z.string().describe('Claim identifier (claim number or UUID)'),
});

export function registerGetAmountsToolClaimManagement(server: any) {
  server.setRequestHandler('tools/list', async () => ({
    tools: [{
      name: 'claim_management_claims_amounts_get',
      description: 'Get financial amounts associated with a claim, including reserves, payments, recoveries, and outstanding amounts.',
      inputSchema: GetAmountsSchema,
    }]
  }));

  server.setRequestHandler('tools/call', async (request) => {
    if (request.params.name === 'claim_management_claims_amounts_get') {
      try {
        const { bearerToken, tenantId, claim } = GetAmountsSchema.parse(request.params.arguments);
        
        const client = createClaimManagementClient(bearerToken, tenantId);
        const result = await client.get(`/api/v1/claim-management/claims/${claim}/amounts`);
        
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
            text: `Error getting claim amounts: ${error instanceof Error ? error.message : 'Unknown error'}`
          }],
          isError: true
        };
      }
    }
  });
}