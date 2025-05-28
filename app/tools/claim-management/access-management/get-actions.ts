import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from 'zod';
import { createClaimManagementClient } from '../client';

export function registerGetActionsToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_access_management_actions_get',
    'Get list of allowed actions for claim management operations. Returns available permissions and capabilities for the authenticated user.',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
    },
    async ({ bearerToken, tenantId }) => {
      try {
        const client = createClaimManagementClient(bearerToken, tenantId);
        const result = await client.get('/api/v1/claim-management/access-management/actions');
        
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
            text: `Error getting claim management actions: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }
  );
}