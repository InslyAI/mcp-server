import { z } from 'zod';
import { createClaimManagementClient } from '../client';

const ListObjectsSchema = z.object({
  bearerToken: z.string().describe('JWT bearer token from identifier_login'),
  tenantId: z.string().describe('Tenant identifier for the organization'),
  page: z.number().optional().describe('Page number for pagination (default: 1)'),
  limit: z.number().optional().describe('Number of objects per page (default: 25)'),
  objectType: z.string().optional().describe('Filter by object type (e.g., "vehicle", "property", "equipment")'),
  search: z.string().optional().describe('Search term for object identification or description'),
});

export function registerListObjectsToolClaimManagement(server: any) {
  server.setRequestHandler('tools/list', async () => ({
    tools: [{
      name: 'claim_management_objects_list',
      description: 'List all claim objects (vehicles, properties, equipment) across the system for reference and selection.',
      inputSchema: ListObjectsSchema,
    }]
  }));

  server.setRequestHandler('tools/call', async (request: any) => {
    if (request.params.name === 'claim_management_objects_list') {
      try {
        const { bearerToken, tenantId, page, limit, objectType, search } = ListObjectsSchema.parse(request.params.arguments);
        
        const client = createClaimManagementClient(bearerToken, tenantId);
        
        // Build query parameters
        const params = new URLSearchParams();
        if (page) params.append('page', page.toString());
        if (limit) params.append('limit', limit.toString());
        if (objectType) params.append('object_type', objectType);
        if (search) params.append('search', search);
        
        const queryString = params.toString() ? `?${params.toString()}` : '';
        const result = await client.get(`/api/v1/claim-management/objects${queryString}`);
        
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
            text: `Error listing objects: ${error instanceof Error ? error.message : 'Unknown error'}`
          }],
          isError: true
        };
      }
    }
  });
}