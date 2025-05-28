import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { createClaimManagementClient } from '../client';

export function registerListObjectsToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_objects_list',
    'Get list of objects associated with a claim (vehicles, properties, items, etc.)',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      claim: z.string().describe('Claim identifier (claim number or UUID)'),
      objectType: z.string().optional().describe('Filter by object type (e.g., "vehicle", "property", "item")'),
      status: z.string().optional().describe('Filter by object status'),
      includeReserves: z.boolean().optional().describe('Whether to include reserve information for objects')
    },
    async ({ bearerToken, tenantId, claim, objectType, status, includeReserves }) => {
      try {
        const client = createClaimManagementClient(bearerToken, tenantId);
        
        // Build query parameters
        const params = new URLSearchParams();
        if (objectType) params.append('object_type', objectType);
        if (status) params.append('status', status);
        if (includeReserves !== undefined) params.append('include_reserves', includeReserves.toString());
        
        const queryString = params.toString() ? `?${params.toString()}` : '';
        const result = await client.get(`/api/v1/claim-management/claims/${claim}/objects${queryString}`);
        
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
            text: `Error listing claim objects: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }
  );
}
