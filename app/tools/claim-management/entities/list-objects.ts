import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from 'zod';
import { createClaimManagementClient } from '../client';

export function registerListObjectsToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_entities_objects_list',
    'List all claim objects (vehicles, properties, equipment) across the system for reference and selection.',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      page: z.number().optional().describe('Page number for pagination (default: 1)'),
      limit: z.number().optional().describe('Number of objects per page (default: 25)'),
      objectType: z.string().optional().describe('Filter by object type (e.g., "vehicle", "property", "equipment")'),
      search: z.string().optional().describe('Search term for object identification or description'),
    },
    async ({ bearerToken, tenantId, page, limit, objectType, search }) => {
      try {
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
            type: 'text' as const,
            text: JSON.stringify(result, null, 2)
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: 'text' as const,
            text: `Error listing objects: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }
  );
}