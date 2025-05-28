import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export function registerMyTasksAssignedToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_dashboard_my_tasks_assigned',
    'Get dashboard view of tasks assigned to the current user',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      
      // Status Filters
      taskStatus: z.array(z.enum(['pending', 'in-progress', 'on-hold', 'completed', 'cancelled'])).optional().describe('Filter by task status'),
      includeCompleted: z.boolean().optional().describe('Include completed tasks (default: false)'),
      
      // Priority and Urgency
      priority: z.array(z.string()).optional().describe('Filter by priority level (high, medium, low, critical)'),
      urgent: z.boolean().optional().describe('Only show urgent tasks'),
      
      // Due Date Filters
      dueDateFrom: z.string().optional().describe('Tasks due from this date (YYYY-MM-DD)'),
      dueDateTo: z.string().optional().describe('Tasks due to this date (YYYY-MM-DD)'),
      overdue: z.boolean().optional().describe('Only show overdue tasks'),
      dueToday: z.boolean().optional().describe('Only show tasks due today'),
      dueThisWeek: z.boolean().optional().describe('Only show tasks due this week'),
      
      // Task Type and Category
      taskType: z.array(z.string()).optional().describe('Filter by task type'),
      category: z.array(z.string()).optional().describe('Filter by task category'),
      
      // Related Claims
      claimNumber: z.string().optional().describe('Filter tasks related to specific claim'),
      claimType: z.array(z.string()).optional().describe('Filter by related claim type'),
      claimStatus: z.array(z.string()).optional().describe('Filter by related claim status'),
      
      // Assignment Details
      assignedBy: z.array(z.string()).optional().describe('Filter by who assigned the task'),
      assignmentDate: z.string().optional().describe('Tasks assigned on or after this date (YYYY-MM-DD)'),
      
      // Progress and Completion
      progressMin: z.number().optional().describe('Minimum progress percentage (0-100)'),
      progressMax: z.number().optional().describe('Maximum progress percentage (0-100)'),
      estimatedHours: z.number().optional().describe('Filter by estimated hours'),
      
      // Time Tracking
      timeSpentMin: z.number().optional().describe('Minimum time spent in hours'),
      timeSpentMax: z.number().optional().describe('Maximum time spent in hours'),
      
      // Sorting Options
      sortBy: z.enum(['dueDate', 'priority', 'assignmentDate', 'taskType', 'progress', 'timeSpent']).optional().describe('Sort field (default: dueDate)'),
      sortOrder: z.enum(['asc', 'desc']).optional().describe('Sort order (default: asc)'),
      
      // Pagination
      limit: z.number().optional().describe('Number of tasks to return (default: 50, max: 200)'),
      offset: z.number().optional().describe('Offset for pagination'),
      
      // Include Options
      includeTaskDetails: z.boolean().optional().describe('Include detailed task information'),
      includeClaimInfo: z.boolean().optional().describe('Include related claim information'),
      includeTimeTracking: z.boolean().optional().describe('Include time tracking details'),
      includeComments: z.boolean().optional().describe('Include recent task comments'),
      includeAttachments: z.boolean().optional().describe('Include task attachments'),
      
      // Grouping and Summary
      groupBy: z.enum(['priority', 'status', 'taskType', 'dueDate', 'claim', 'none']).optional().describe('Group results by specified field'),
      includeSummary: z.boolean().optional().describe('Include summary statistics'),
      
      // Time Range Shortcuts
      timeRange: z.enum(['today', 'tomorrow', 'this-week', 'next-week', 'this-month', 'overdue']).optional().describe('Predefined time range filter'),
      
      // Dependencies
      includeBlocked: z.boolean().optional().describe('Include tasks blocked by dependencies'),
      includeDependencies: z.boolean().optional().describe('Include task dependency information'),
      
      // Workload Analysis
      includeWorkloadMetrics: z.boolean().optional().describe('Include workload analysis metrics'),
      estimatedCompletionTime: z.boolean().optional().describe('Include estimated completion time analysis')
    },
    async ({ bearerToken, tenantId, ...params }) => {
      try {
        const queryParams = new URLSearchParams();
        
        // Add query parameters
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
              value.forEach(item => queryParams.append(key, item.toString()));
            } else {
              queryParams.append(key, value.toString());
            }
          }
        });
        
        const response = await fetch(`/api/v1/claim-management/dashboard/my-tasks/assigned?${queryParams.toString()}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${bearerToken}`,
            'Content-Type': 'application/json',
            'X-Tenant-ID': tenantId
          }
        });

        if (!response.ok) {
          const errorData = await response.text();
          return {
            content: [{
              type: 'text' as const,
              text: `Error getting assigned tasks dashboard: ${response.status} ${response.statusText} - ${errorData}`
            }]
          };
        }

        const result = await response.json();
        return {
          content: [{
            type: 'text' as const,
            text: JSON.stringify({
              success: true,
              data: result,
              message: `Retrieved ${result.tasks?.length || 0} assigned tasks from dashboard`
            }, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text' as const,
            text: `Error getting assigned tasks dashboard: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }
  );
}
