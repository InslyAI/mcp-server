/**
 * List Workflows Tool
 * Gets paginated list of workflows with filtering options
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../client";

export function registerListWorkflowsTool(server: McpServer) {
  server.tool(
    "ledger_list_workflows",
    "Get paginated list of automated business workflows with filtering and execution statistics",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      category: z.enum([
        'underwriting',
        'claims_processing',
        'policy_management',
        'renewals',
        'compliance',
        'document_processing',
        'notifications',
        'approvals',
        'data_validation',
        'integrations',
        'custom'
      ]).optional().describe("Filter by workflow category"),
      status: z.enum(['active', 'inactive', 'draft', 'archived', 'error']).optional().describe("Filter by workflow status"),
      priority: z.enum(['low', 'normal', 'high', 'critical']).optional().describe("Filter by workflow priority"),
      triggerType: z.enum(['event', 'schedule', 'manual', 'api_call', 'condition']).optional().describe("Filter by trigger type"),
      createdBy: z.string().optional().describe("Filter by creator user ID"),
      createdFrom: z.string().optional().describe("Filter by creation date from (ISO date)"),
      createdTo: z.string().optional().describe("Filter by creation date to (ISO date)"),
      lastExecutedFrom: z.string().optional().describe("Filter by last execution date from (ISO date)"),
      lastExecutedTo: z.string().optional().describe("Filter by last execution date to (ISO date)"),
      tags: z.array(z.string()).optional().describe("Filter by tags"),
      search: z.string().optional().describe("Search term for workflow name or description"),
      includeStatistics: z.boolean().optional().describe("Whether to include execution statistics"),
      includeSteps: z.boolean().optional().describe("Whether to include workflow steps summary"),
      includePermissions: z.boolean().optional().describe("Whether to include permission information"),
      page: z.number().optional().describe("Page number for pagination (default: 1)"),
      limit: z.number().optional().describe("Number of results per page (default: 20, max: 100)"),
      sortBy: z.enum(['name', 'createdAt', 'lastExecuted', 'executionCount', 'successRate', 'priority']).optional().describe("Field to sort by"),
      sortOrder: z.enum(['asc', 'desc']).optional().describe("Sort order (default: desc)"),
    },
    async ({ 
      bearerToken, 
      tenantId, 
      category,
      status,
      priority,
      triggerType,
      createdBy,
      createdFrom,
      createdTo,
      lastExecutedFrom,
      lastExecutedTo,
      tags,
      search,
      includeStatistics,
      includeSteps,
      includePermissions,
      page,
      limit,
      sortBy,
      sortOrder 
    }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const queryParams = new URLSearchParams();
        if (category) queryParams.append('category', category);
        if (status) queryParams.append('status', status);
        if (priority) queryParams.append('priority', priority);
        if (triggerType) queryParams.append('trigger_type', triggerType);
        if (createdBy) queryParams.append('created_by', createdBy);
        if (createdFrom) queryParams.append('created_from', createdFrom);
        if (createdTo) queryParams.append('created_to', createdTo);
        if (lastExecutedFrom) queryParams.append('last_executed_from', lastExecutedFrom);
        if (lastExecutedTo) queryParams.append('last_executed_to', lastExecutedTo);
        if (tags) tags.forEach(tag => queryParams.append('tags[]', tag));
        if (search) queryParams.append('search', search);
        if (includeStatistics) queryParams.append('include_statistics', 'true');
        if (includeSteps) queryParams.append('include_steps', 'true');
        if (includePermissions) queryParams.append('include_permissions', 'true');
        if (page) queryParams.append('page', page.toString());
        if (limit) queryParams.append('limit', limit.toString());
        if (sortBy) queryParams.append('sort_by', sortBy);
        if (sortOrder) queryParams.append('sort_order', sortOrder);
        
        const response = await client.get(
          `/workflows?${queryParams.toString()}`
        );

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                workflows: response.data.map((workflow: any) => ({
                  id: workflow.id,
                  name: workflow.name,
                  description: workflow.description,
                  category: workflow.category,
                  status: workflow.status,
                  priority: workflow.priority,
                  version: workflow.version,
                  triggerType: workflow.trigger.type,
                  stepCount: workflow.stepCount,
                  createdAt: workflow.createdAt,
                  updatedAt: workflow.updatedAt,
                  createdBy: workflow.createdBy,
                  createdByName: workflow.createdByName,
                  lastExecuted: workflow.lastExecuted,
                  nextScheduledExecution: workflow.nextScheduledExecution,
                  active: workflow.active,
                  tags: workflow.tags,
                  complexity: workflow.complexity,
                  ...(includeStatistics && {
                    statistics: {
                      totalExecutions: workflow.statistics.totalExecutions,
                      successfulExecutions: workflow.statistics.successfulExecutions,
                      failedExecutions: workflow.statistics.failedExecutions,
                      successRate: workflow.statistics.successRate,
                      averageExecutionTime: workflow.statistics.averageExecutionTime,
                      lastExecutionStatus: workflow.statistics.lastExecutionStatus,
                      executionsThisMonth: workflow.statistics.executionsThisMonth
                    }
                  }),
                  ...(includeSteps && {
                    steps: workflow.steps.map((step: any) => ({
                      id: step.id,
                      name: step.name,
                      type: step.type,
                      required: step.required,
                      estimatedDuration: step.estimatedDuration
                    }))
                  }),
                  ...(includePermissions && {
                    permissions: workflow.permissions,
                    canExecute: workflow.canExecute,
                    canModify: workflow.canModify
                  })
                })),
                pagination: {
                  currentPage: response.pagination.currentPage,
                  totalPages: response.pagination.totalPages,
                  totalItems: response.pagination.totalItems,
                  itemsPerPage: response.pagination.itemsPerPage,
                  hasNext: response.pagination.hasNext,
                  hasPrevious: response.pagination.hasPrevious
                },
                summary: {
                  totalWorkflows: response.summary.totalWorkflows,
                  activeWorkflows: response.summary.activeWorkflows,
                  scheduledWorkflows: response.summary.scheduledWorkflows,
                  totalExecutionsToday: response.summary.totalExecutionsToday,
                  averageSuccessRate: response.summary.averageSuccessRate,
                  mostUsedCategory: response.summary.mostUsedCategory
                },
                filters: {
                  category,
                  status,
                  priority,
                  triggerType,
                  createdBy,
                  createdFrom,
                  createdTo,
                  lastExecutedFrom,
                  lastExecutedTo,
                  tags,
                  search
                }
              }, null, 2)
            }
          ]
        };
      } catch (error: any) {
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: false,
                error: "Failed to retrieve workflows",
                details: error.message,
                statusCode: error.status
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}