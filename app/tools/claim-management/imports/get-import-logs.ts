import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export function registerGetImportLogsToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_imports_get_import_logs',
    'Get BDX import logs and history for troubleshooting and audit purposes',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      
      // Log Level Filters
      logLevel: z.array(z.enum(['debug', 'info', 'warning', 'error', 'critical'])).optional().describe('Filter by log level'),
      
      // Time Range Filters
      startDate: z.string().optional().describe('Start date for log entries (YYYY-MM-DD)'),
      endDate: z.string().optional().describe('End date for log entries (YYYY-MM-DD)'),
      lastHours: z.number().optional().describe('Get logs from the last N hours'),
      lastDays: z.number().optional().describe('Get logs from the last N days'),
      
      // Import Job Filters
      jobId: z.array(z.string()).optional().describe('Filter by specific import job IDs'),
      importStatus: z.array(z.enum(['pending', 'running', 'completed', 'failed', 'cancelled'])).optional().describe('Filter by import job status'),
      fileName: z.string().optional().describe('Filter by import file name (partial match)'),
      
      // User and Source Filters
      userId: z.array(z.string()).optional().describe('Filter by user who initiated the import'),
      sourceSystem: z.array(z.string()).optional().describe('Filter by source system'),
      
      // Content Filters
      messageContains: z.string().optional().describe('Filter logs containing specific text'),
      category: z.array(z.string()).optional().describe('Filter by log category (validation, processing, completion, etc.)'),
      
      // Error and Issue Filters
      errorsOnly: z.boolean().optional().describe('Only show error and warning logs'),
      includeStackTraces: z.boolean().optional().describe('Include stack traces for errors'),
      
      // Pagination and Limits
      limit: z.number().optional().describe('Maximum number of log entries to return (default: 100, max: 1000)'),
      offset: z.number().optional().describe('Offset for pagination'),
      
      // Sorting Options
      sortBy: z.enum(['timestamp', 'logLevel', 'jobId', 'message']).optional().describe('Sort field (default: timestamp)'),
      sortOrder: z.enum(['asc', 'desc']).optional().describe('Sort order (default: desc)'),
      
      // Include Options
      includeSystemInfo: z.boolean().optional().describe('Include system information with each log entry'),
      includePerformanceMetrics: z.boolean().optional().describe('Include performance metrics'),
      includeContextData: z.boolean().optional().describe('Include additional context data'),
      
      // Export and Format Options
      format: z.enum(['json', 'text', 'csv']).optional().describe('Output format for logs'),
      includeTimestamps: z.boolean().optional().describe('Include detailed timestamps'),
      
      // Search and Analysis
      searchQuery: z.string().optional().describe('Full-text search across log messages'),
      groupBy: z.enum(['jobId', 'logLevel', 'category', 'hour', 'day', 'none']).optional().describe('Group log entries by specified field'),
      
      // Summary Options
      includeSummary: z.boolean().optional().describe('Include summary statistics'),
      summaryPeriod: z.enum(['hour', 'day', 'week', 'month']).optional().describe('Period for summary aggregation'),
      
      // Real-time Options
      tail: z.boolean().optional().describe('Get most recent logs (tail mode)'),
      followChanges: z.boolean().optional().describe('Include real-time log updates'),
      
      // Correlation and Tracing
      correlationId: z.string().optional().describe('Filter by correlation ID for request tracing'),
      traceId: z.string().optional().describe('Filter by trace ID for distributed tracing')
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
        
        const response = await fetch(`/api/v1/claim-management/imports?${queryParams.toString()}`, {
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
              text: `Error getting import logs: ${response.status} ${response.statusText} - ${errorData}`
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
              message: `Retrieved ${result.logs?.length || 0} import log entries`,
              metadata: {
                totalLogs: result.totalCount,
                errorCount: result.summary?.errorCount || 0,
                warningCount: result.summary?.warningCount || 0,
                timeRange: {
                  from: result.timeRange?.from,
                  to: result.timeRange?.to
                },
                uniqueJobs: result.summary?.uniqueJobs || 0
              }
            }, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text' as const,
            text: `Error getting import logs: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }
  );
}
