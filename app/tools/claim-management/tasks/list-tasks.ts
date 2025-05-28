import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { createClaimManagementClient } from '../client';

export function registerListTasksToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_tasks_list',
    'Get list of tasks with filtering and pagination options',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      assignedTo: z.string().optional().describe('Filter by user assigned to task'),
      createdBy: z.string().optional().describe('Filter by user who created the task'),
      status: z.string().optional().describe('Filter by task status (e.g., "pending", "in_progress", "completed", "cancelled")'),
      priority: z.string().optional().describe('Filter by task priority (e.g., "low", "medium", "high", "urgent")'),
      dueDate: z.string().optional().describe('Filter by due date (ISO 8601 format)'),
      fromDate: z.string().optional().describe('Filter tasks created from date (ISO 8601)'),
      toDate: z.string().optional().describe('Filter tasks created to date (ISO 8601)'),
      taskType: z.string().optional().describe('Filter by task type (e.g., "investigation", "approval", "review")'),
      claimId: z.string().optional().describe('Filter by associated claim ID'),
      page: z.number().optional().describe('Page number for pagination (default: 1)'),
      limit: z.number().optional().describe('Number of tasks per page (default: 25)'),
      sortBy: z.string().optional().describe('Field to sort by (e.g., "created_at", "due_date", "priority")'),
      sortOrder: z.enum(['asc', 'desc']).optional().describe('Sort order (default: desc)')
    },
    async ({ bearerToken, tenantId, assignedTo, createdBy, status, priority, dueDate, fromDate, toDate, taskType, claimId, page, limit, sortBy, sortOrder }) => {
      try {
        const client = createClaimManagementClient(bearerToken, tenantId);
        
        // Build query parameters
        const params = new URLSearchParams();
        if (assignedTo) params.append('assigned_to', assignedTo);
        if (createdBy) params.append('created_by', createdBy);
        if (status) params.append('status', status);
        if (priority) params.append('priority', priority);
        if (dueDate) params.append('due_date', dueDate);
        if (fromDate) params.append('from_date', fromDate);
        if (toDate) params.append('to_date', toDate);
        if (taskType) params.append('task_type', taskType);
        if (claimId) params.append('claim_id', claimId);
        if (page) params.append('page', page.toString());
        if (limit) params.append('limit', limit.toString());
        if (sortBy) params.append('sort_by', sortBy);
        if (sortOrder) params.append('sort_order', sortOrder);
        
        const queryString = params.toString() ? `?${params.toString()}` : '';
        const result = await client.get(`/api/v1/claim-management/tasks${queryString}`);
        
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
            text: `Error listing tasks: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }
  );
}
