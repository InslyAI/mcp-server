import { z } from 'zod';
import { createClaimManagementClient } from '../../client';

const CreateClaimSchema = z.object({
  bearerToken: z.string().describe('JWT bearer token from identifier_login'),
  tenantId: z.string().describe('Tenant identifier for the organization'),
  policyNumber: z.string().describe('Policy number associated with the claim'),
  incidentDate: z.string().describe('Date when the incident occurred (ISO 8601 format)'),
  reportedDate: z.string().optional().describe('Date when the claim was reported (ISO 8601 format, defaults to current date)'),
  description: z.string().describe('Description of the incident and claim'),
  claimType: z.string().describe('Type of claim (e.g., "motor", "property", "liability")'),
  estimatedAmount: z.number().optional().describe('Estimated claim amount'),
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional().describe('Claim priority level'),
  customerContact: z.object({
    name: z.string().describe('Contact person name'),
    phone: z.string().optional().describe('Contact phone number'),
    email: z.string().optional().describe('Contact email address'),
  }).optional().describe('Customer contact information'),
  location: z.object({
    address: z.string().optional().describe('Incident location address'),
    latitude: z.number().optional().describe('Incident location latitude'),
    longitude: z.number().optional().describe('Incident location longitude'),
  }).optional().describe('Incident location details'),
});

export function registerCreateClaimToolClaimManagement(server: any) {
  server.setRequestHandler('tools/list', async () => ({
    tools: [{
      name: 'claim_management_claims_create',
      description: 'Create a new claim record. This initiates the claim lifecycle and generates a unique claim number for tracking.',
      inputSchema: CreateClaimSchema,
    }]
  }));

  server.setRequestHandler('tools/call', async (request: any) => {
    if (request.params.name === 'claim_management_claims_create') {
      try {
        const { bearerToken, tenantId, ...claimData } = CreateClaimSchema.parse(request.params.arguments);
        
        const client = createClaimManagementClient(bearerToken, tenantId);
        const result = await client.post('/api/v1/claim-management/claims', claimData);
        
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
            text: `Error creating claim: ${error instanceof Error ? error.message : 'Unknown error'}`
          }],
          isError: true
        };
      }
    }
  });
}