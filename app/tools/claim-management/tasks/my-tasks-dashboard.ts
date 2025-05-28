import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { createClaimManagementClient } from '../client';

export function registerMyTasksDashboardToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_tasks_my_dashboard',
    'Get dashboard view of my tasks (assigned to me and created by me)',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      viewType: z.enum(['assigned', 'created']).describe('Type of tasks to view - assigned to me or created by me')
    },
    async ({ bearerToken, tenantId, viewType }) => {
      try {
        const client = createClaimManagementClient(bearerToken, tenantId);
        const endpoint = viewType === 'assigned' 
          ? '/api/v1/claim-management/dashboard/my-tasks/assigned'
          : '/api/v1/claim-management/dashboard/my-tasks/created';
        
        const result = await client.get(endpoint);
        
        return {
          content: [{
            type: 'text' as const,
            text: JSON.stringify({
              success: true,
              data: result,
              viewType,
              message: `My ${viewType} tasks dashboard retrieved successfully`
            }, null, 2)
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: 'text' as const,
            text: `Error retrieving my tasks dashboard: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }
  );
}
