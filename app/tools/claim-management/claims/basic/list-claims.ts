import { z } from 'zod';
import { createClaimManagementClient } from '../../client';

const ListClaimsSchema = z.object({
  bearerToken: z.string().describe('JWT bearer token from identifier_login'),
  tenantId: z.string().describe('Tenant identifier for the organization'),
  page: z.number().optional().describe('Page number for pagination (default: 1)'),
  limit: z.number().optional().describe('Number of claims per page (default: 25)'),
  status: z.string().optional().describe('Filter by claim status (e.g., "open", "closed", "pending")'),
  search: z.string().optional().describe('Search term for claim number, customer name, or description'),
  sortBy: z.string().optional().describe('Field to sort by (e.g., "created_at", "updated_at", "claim_number")'),
  sortOrder: z.enum(['asc', 'desc']).optional().describe('Sort order (default: desc)'),
});

export function registerListClaimsToolClaimManagement(server: any) {
  server.setRequestHandler('tools/list', async () => ({
    tools: [{
      name: 'claim_management_claims_list',
      description: 'List claims with optional filtering, searching, and pagination. Returns a paginated list of claims with basic information.',
      inputSchema: ListClaimsSchema,
    }]
  }));

  server.setRequestHandler('tools/call', async (request: any) => {
    if (request.params.name === 'claim_management_claims_list') {
      try {
        const { bearerToken, tenantId, page, limit, status, search, sortBy, sortOrder } = ListClaimsSchema.parse(request.params.arguments);
        
        const client = createClaimManagementClient(bearerToken, tenantId);
        
        // Build query parameters
        const params = new URLSearchParams();
        if (page) params.append('page', page.toString());
        if (limit) params.append('limit', limit.toString());
        if (status) params.append('status', status);
        if (search) params.append('search', search);
        if (sortBy) params.append('sort_by', sortBy);
        if (sortOrder) params.append('sort_order', sortOrder);
        
        const queryString = params.toString() ? `?${params.toString()}` : '';
        const result = await client.get(`/api/v1/claim-management/claims${queryString}`);
        
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
            text: `Error listing claims: ${error instanceof Error ? error.message : 'Unknown error'}`
          }],
          isError: true
        };
      }
    }
  });
}