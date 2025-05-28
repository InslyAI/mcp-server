import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { createClaimManagementClient } from '../client';

export function registerCreateTaskToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_tasks_create',
    'Create a new task for a claim',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      claim: z.string().describe('Claim identifier (claim number or UUID)'),
      title: z.string().describe('Task title/summary'),
      description: z.string().describe('Detailed task description'),
      taskType: z.string().describe('Type of task (e.g., "investigation", "approval", "review", "contact_claimant")'),
      priority: z.enum(['low', 'medium', 'high', 'urgent']).describe('Task priority level'),
      assignedTo: z.string().optional().describe('User ID to assign the task to'),
      dueDate: z.string().optional().describe('Task due date (ISO 8601 format)'),
      estimatedHours: z.number().optional().describe('Estimated hours to complete the task'),
      category: z.string().optional().describe('Task category for organization'),
      tags: z.array(z.string()).optional().describe('Tags for task categorization'),
      dependencies: z.array(z.string()).optional().describe('List of task IDs this task depends on'),
      attachments: z.array(z.string()).optional().describe('Document references related to the task'),
      checklist: z.array(z.object({
        item: z.string(),
        completed: z.boolean().optional().default(false)
      })).optional().describe('Checklist items for the task'),
      metadata: z.record(z.any()).optional().describe('Additional task metadata'),
      notifyAssignee: z.boolean().optional().describe('Whether to send notification to assignee'),
      autoReminders: z.boolean().optional().describe('Whether to enable automatic reminders')
    },
    async ({ bearerToken, tenantId, claim, ...taskData }: any) => {
      try {
        const client = createClaimManagementClient(bearerToken, tenantId);
        const result = await client.post(`/api/v1/claim-management/claims/${claim}/tasks`, taskData);
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              success: true,
              data: result,
              message: 'Task created successfully'
            }, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text', 
            text: JSON.stringify({
              success: false,
              error: error.message || 'Failed to create task',
              details: error.response?.data || error
            }, null, 2)
          }]
        };
      }
    }
  );
}
