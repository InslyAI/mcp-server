import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { createClaimManagementClient } from '../client';

export function registerUpdateTaskToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_tasks_update',
    'Update an existing task',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      claim: z.string().describe('Claim identifier (claim number or UUID)'),
      task: z.string().describe('Task identifier to update'),
      title: z.string().optional().describe('Updated task title/summary'),
      description: z.string().optional().describe('Updated task description'),
      taskType: z.string().optional().describe('Updated task type'),
      priority: z.enum(['low', 'medium', 'high', 'urgent']).optional().describe('Updated task priority'),
      status: z.enum(['pending', 'in_progress', 'completed', 'cancelled', 'on_hold']).optional().describe('Updated task status'),
      assignedTo: z.string().optional().describe('Updated user ID assignment'),
      dueDate: z.string().optional().describe('Updated due date (ISO 8601 format)'),
      completedDate: z.string().optional().describe('Task completion date (ISO 8601 format)'),
      estimatedHours: z.number().optional().describe('Updated estimated hours'),
      actualHours: z.number().optional().describe('Actual hours spent on task'),
      progressPercentage: z.number().min(0).max(100).optional().describe('Task completion percentage'),
      category: z.string().optional().describe('Updated task category'),
      tags: z.array(z.string()).optional().describe('Updated tags'),
      dependencies: z.array(z.string()).optional().describe('Updated task dependencies'),
      attachments: z.array(z.string()).optional().describe('Updated document references'),
      checklist: z.array(z.object({
        item: z.string(),
        completed: z.boolean().optional()
      })).optional().describe('Updated checklist items'),
      notes: z.string().optional().describe('Progress notes or comments'),
      metadata: z.record(z.any()).optional().describe('Updated task metadata'),
      updateReason: z.string().optional().describe('Reason for the update')
    },
    async ({ bearerToken, tenantId, claim, task, ...updateData }: any) => {
      try {
        const client = createClaimManagementClient(bearerToken, tenantId);
        const result = await client.put(`/api/v1/claim-management/claims/${claim}/tasks/${task}`, updateData);
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              success: true,
              data: result,
              message: 'Task updated successfully'
            }, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text', 
            text: JSON.stringify({
              success: false,
              error: error.message || 'Failed to update task',
              details: error.response?.data || error
            }, null, 2)
          }]
        };
      }
    }
  );
}
