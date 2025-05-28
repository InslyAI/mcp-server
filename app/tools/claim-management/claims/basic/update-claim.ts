import { z } from 'zod';
import { createClaimManagementClient } from '../../client';

const UpdateClaimSchema = z.object({
  bearerToken: z.string().describe('JWT bearer token from identifier_login'),
  tenantId: z.string().describe('Tenant identifier for the organization'),
  claim: z.string().describe('Claim identifier (claim number or UUID)'),
  status: z.string().optional().describe('Updated claim status (e.g., "open", "in_progress", "closed", "rejected")'),
  description: z.string().optional().describe('Updated description of the incident and claim'),
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional().describe('Updated claim priority level'),
  estimatedAmount: z.number().optional().describe('Updated estimated claim amount'),
  assignedTo: z.string().optional().describe('User ID or name of the assigned adjuster'),
  customerContact: z.object({
    name: z.string().optional().describe('Updated contact person name'),
    phone: z.string().optional().describe('Updated contact phone number'),
    email: z.string().optional().describe('Updated contact email address'),
  }).optional().describe('Updated customer contact information'),
  notes: z.string().optional().describe('Additional notes or updates to the claim'),
  tags: z.array(z.string()).optional().describe('Tags for categorizing the claim'),
});

export function registerUpdateClaimToolClaimManagement(server: any) {
  server.setRequestHandler('tools/list', async () => ({
    tools: [{
      name: 'claim_management_claims_update',
      description: 'Update an existing claim with new information, status changes, assignments, or additional details.',
      inputSchema: UpdateClaimSchema,
    }]
  }));

  server.setRequestHandler('tools/call', async (request) => {
    if (request.params.name === 'claim_management_claims_update') {
      try {
        const { bearerToken, tenantId, claim, ...updateData } = UpdateClaimSchema.parse(request.params.arguments);
        
        const client = createClaimManagementClient(bearerToken, tenantId);
        const result = await client.put(`/api/v1/claim-management/claims/${claim}`, updateData);
        
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
            text: `Error updating claim: ${error instanceof Error ? error.message : 'Unknown error'}`
          }],
          isError: true
        };
      }
    }
  });
}