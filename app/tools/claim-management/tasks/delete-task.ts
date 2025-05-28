import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { createClaimManagementClient } from '../client';

export function registerDeleteTaskToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_tasks_delete',
    'Delete a task from a claim',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      claim: z.string().describe('Claim identifier (claim number or UUID)'),
      task: z.string().describe('Task identifier to delete'),
      deleteReason: z.string().optional().describe('Reason for deleting the task'),
      transferDependencies: z.boolean().optional().describe('Whether to transfer dependencies to other tasks'),
      notifyStakeholders: z.boolean().optional().describe('Whether to notify affected users')
    },
    async ({ bearerToken, tenantId, claim, task, deleteReason, transferDependencies, notifyStakeholders }) => {
      try {
        const client = createClaimManagementClient(bearerToken, tenantId);
        
        // Build query parameters if needed
        const params = new URLSearchParams();
        if (deleteReason) params.append('delete_reason', deleteReason);
        if (transferDependencies !== undefined) params.append('transfer_dependencies', transferDependencies.toString());
        if (notifyStakeholders !== undefined) params.append('notify_stakeholders', notifyStakeholders.toString());
        
        const queryString = params.toString() ? `?${params.toString()}` : '';
        const result = await client.delete(`/api/v1/claim-management/claims/${claim}/tasks/${task}${queryString}`);
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              success: true,
              data: result,
              message: 'Task deleted successfully'
            }, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text', 
            text: JSON.stringify({
              success: false,
              error: error.message || 'Failed to delete task',
              details: error.response?.data || error
            }, null, 2)
          }]
        };
      }
    }
  );
}
