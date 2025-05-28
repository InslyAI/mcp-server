import { z } from 'zod';
import { createClaimManagementClient } from '../client';

const ListPersonsSchema = z.object({
  bearerToken: z.string().describe('JWT bearer token from identifier_login'),
  tenantId: z.string().describe('Tenant identifier for the organization'),
  page: z.number().optional().describe('Page number for pagination (default: 1)'),
  limit: z.number().optional().describe('Number of persons per page (default: 25)'),
  personType: z.string().optional().describe('Filter by person type (e.g., "claimant", "witness", "adjuster", "expert")'),
  search: z.string().optional().describe('Search term for person name, email, or identification'),
});

export function registerListPersonsToolClaimManagement(server: any) {
  server.setRequestHandler('tools/list', async () => ({
    tools: [{
      name: 'claim_management_persons_list',
      description: 'List all persons involved in claims (claimants, witnesses, adjusters, experts) across the system for reference.',
      inputSchema: ListPersonsSchema,
    }]
  }));

  server.setRequestHandler('tools/call', async (request: any) => {
    if (request.params.name === 'claim_management_persons_list') {
      try {
        const { bearerToken, tenantId, page, limit, personType, search } = ListPersonsSchema.parse(request.params.arguments);
        
        const client = createClaimManagementClient(bearerToken, tenantId);
        
        // Build query parameters
        const params = new URLSearchParams();
        if (page) params.append('page', page.toString());
        if (limit) params.append('limit', limit.toString());
        if (personType) params.append('person_type', personType);
        if (search) params.append('search', search);
        
        const queryString = params.toString() ? `?${params.toString()}` : '';
        const result = await client.get(`/api/v1/claim-management/persons${queryString}`);
        
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
            text: `Error listing persons: ${error instanceof Error ? error.message : 'Unknown error'}`
          }],
          isError: true
        };
      }
    }
  });
}