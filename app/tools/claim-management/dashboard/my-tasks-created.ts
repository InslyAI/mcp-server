import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export function registerMyTasksCreatedToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_dashboard_my_tasks_created',
    'Get dashboard view of tasks created by the current user',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      
      // Status Filters
      taskStatus: z.array(z.enum(['pending', 'in-progress', 'on-hold', 'completed', 'cancelled'])).optional().describe('Filter by task status'),
      includeCompleted: z.boolean().optional().describe('Include completed tasks (default: true)'),
      
      // Assignment Status
      assignmentStatus: z.enum(['assigned', 'unassigned', 'both']).optional().describe('Filter by assignment status'),
      assignedTo: z.array(z.string()).optional().describe('Filter by who the task is assigned to'),
      
      // Priority and Urgency
      priority: z.array(z.string()).optional().describe('Filter by priority level'),
      urgent: z.boolean().optional().describe('Only show urgent tasks'),
      
      // Creation Date Filters
      createdDateFrom: z.string().optional().describe('Tasks created from this date (YYYY-MM-DD)'),
      createdDateTo: z.string().optional().describe('Tasks created to this date (YYYY-MM-DD)'),
      
      // Due Date Filters
      dueDateFrom: z.string().optional().describe('Tasks due from this date (YYYY-MM-DD)'),
      dueDateTo: z.string().optional().describe('Tasks due to this date (YYYY-MM-DD)'),
      overdue: z.boolean().optional().describe('Only show overdue tasks'),
      
      // Task Type and Category
      taskType: z.array(z.string()).optional().describe('Filter by task type'),
      category: z.array(z.string()).optional().describe('Filter by task category'),
      
      // Related Claims
      claimNumber: z.string().optional().describe('Filter tasks related to specific claim'),
      claimType: z.array(z.string()).optional().describe('Filter by related claim type'),
      claimStatus: z.array(z.string()).optional().describe('Filter by related claim status'),
      
      // Progress and Completion
      progressMin: z.number().optional().describe('Minimum progress percentage (0-100)'),
      progressMax: z.number().optional().describe('Maximum progress percentage (0-100)'),
      completionStatus: z.enum(['not-started', 'in-progress', 'near-completion', 'completed']).optional().describe('Filter by completion status'),
      
      // Time Tracking
      estimatedHoursMin: z.number().optional().describe('Minimum estimated hours'),
      estimatedHoursMax: z.number().optional().describe('Maximum estimated hours'),
      actualHoursMin: z.number().optional().describe('Minimum actual hours spent'),
      actualHoursMax: z.number().optional().describe('Maximum actual hours spent'),
      
      // Team and Department
      assignedTeam: z.array(z.string()).optional().describe('Filter by assigned team'),
      assignedDepartment: z.array(z.string()).optional().describe('Filter by assigned department'),
      
      // Sorting Options
      sortBy: z.enum(['createdDate', 'dueDate', 'priority', 'status', 'progress', 'assignedTo']).optional().describe('Sort field (default: createdDate)'),
      sortOrder: z.enum(['asc', 'desc']).optional().describe('Sort order (default: desc)'),
      
      // Pagination
      limit: z.number().optional().describe('Number of tasks to return (default: 50, max: 200)'),
      offset: z.number().optional().describe('Offset for pagination'),
      
      // Include Options
      includeTaskDetails: z.boolean().optional().describe('Include detailed task information'),
      includeClaimInfo: z.boolean().optional().describe('Include related claim information'),
      includeAssigneeInfo: z.boolean().optional().describe('Include assignee details'),
      includeProgressHistory: z.boolean().optional().describe('Include progress tracking history'),
      includeComments: z.boolean().optional().describe('Include recent task comments'),
      includeTimeTracking: z.boolean().optional().describe('Include time tracking details'),
      
      // Performance Metrics
      includePerformanceMetrics: z.boolean().optional().describe('Include task performance metrics'),
      compareToBaseline: z.boolean().optional().describe('Compare performance to baseline metrics'),
      
      // Grouping and Summary
      groupBy: z.enum(['status', 'priority', 'assignedTo', 'taskType', 'createdDate', 'none']).optional().describe('Group results by specified field'),
      includeSummary: z.boolean().optional().describe('Include summary statistics'),
      includeTeamMetrics: z.boolean().optional().describe('Include team performance metrics'),
      
      // Time Range Shortcuts
      timeRange: z.enum(['today', 'yesterday', 'this-week', 'last-week', 'this-month', 'last-month']).optional().describe('Predefined time range filter for creation date'),
      
      // Dependencies and Blocking
      includeBlocked: z.boolean().optional().describe('Include tasks that are blocked'),
      includeBlocking: z.boolean().optional().describe('Include tasks that are blocking others'),
      includeDependencies: z.boolean().optional().describe('Include task dependency information'),
      
      // Approval and Review
      requiresApproval: z.boolean().optional().describe('Tasks requiring approval'),
      approvalStatus: z.array(z.string()).optional().describe('Filter by approval status'),
      
      // Quality and Feedback
      includeQualityRatings: z.boolean().optional().describe('Include quality ratings and feedback'),
      minQualityRating: z.number().optional().describe('Minimum quality rating (1-5 scale)')
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
        
        const response = await fetch(`/api/v1/claim-management/dashboard/my-tasks/created?${queryParams.toString()}`, {
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
              text: `Error getting created tasks dashboard: ${response.status} ${response.statusText} - ${errorData}`
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
              message: `Retrieved ${result.tasks?.length || 0} created tasks from dashboard`
            }, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text' as const,
            text: `Error getting created tasks dashboard: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }
  );
}
