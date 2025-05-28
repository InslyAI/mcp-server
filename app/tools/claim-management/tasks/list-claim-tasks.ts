import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { createClaimManagementClient } from '../client';

export function registerListClaimTasksToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_tasks_list_for_claim',
    'Get list of tasks for a specific claim',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      claim: z.string().describe('Claim identifier (claim number or UUID)'),
      status: z.string().optional().describe('Filter by task status'),
      priority: z.string().optional().describe('Filter by task priority'),
      assignedTo: z.string().optional().describe('Filter by assigned user'),
      taskType: z.string().optional().describe('Filter by task type'),
      includeCompleted: z.boolean().optional().describe('Whether to include completed tasks'),
      sortBy: z.string().optional().describe('Field to sort by'),
      sortOrder: z.enum(['asc', 'desc']).optional().describe('Sort order')
    },
    async ({ bearerToken, tenantId, claim, status, priority, assignedTo, taskType, includeCompleted, sortBy, sortOrder }) => {
      try {
        const client = createClaimManagementClient(bearerToken, tenantId);
        
        // Build query parameters
        const params = new URLSearchParams();
        if (status) params.append('status', status);
        if (priority) params.append('priority', priority);
        if (assignedTo) params.append('assigned_to', assignedTo);
        if (taskType) params.append('task_type', taskType);
        if (includeCompleted !== undefined) params.append('include_completed', includeCompleted.toString());
        if (sortBy) params.append('sort_by', sortBy);
        if (sortOrder) params.append('sort_order', sortOrder);
        
        const queryString = params.toString() ? `?${params.toString()}` : '';
        const result = await client.get(`/api/v1/claim-management/claims/${claim}/tasks${queryString}`);
        
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
            text: `Error listing claim tasks: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }
  );
}
