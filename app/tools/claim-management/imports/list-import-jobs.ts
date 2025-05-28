import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export function registerListImportJobsToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_imports_list_import_jobs',
    'List all BDX import jobs with filtering and status information',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      
      // Status Filters
      status: z.array(z.enum(['pending', 'running', 'completed', 'failed', 'cancelled', 'paused'])).optional().describe('Filter by job status'),
      
      // Date Filters
      startDateFrom: z.string().optional().describe('Filter jobs started from this date (YYYY-MM-DD)'),
      startDateTo: z.string().optional().describe('Filter jobs started to this date (YYYY-MM-DD)'),
      completionDateFrom: z.string().optional().describe('Filter jobs completed from this date (YYYY-MM-DD)'),
      completionDateTo: z.string().optional().describe('Filter jobs completed to this date (YYYY-MM-DD)'),
      
      // User and Source Filters
      importedBy: z.array(z.string()).optional().describe('Filter by user who initiated the import'),
      sourceSystem: z.array(z.string()).optional().describe('Filter by source system'),
      fileName: z.string().optional().describe('Filter by file name (partial match supported)'),
      
      // Content Filters
      importMode: z.array(z.enum(['validate-only', 'import-valid', 'import-all', 'update-existing'])).optional().describe('Filter by import mode'),
      recordCountMin: z.number().optional().describe('Minimum number of records processed'),
      recordCountMax: z.number().optional().describe('Maximum number of records processed'),
      
      // Error and Success Filters
      hasErrors: z.boolean().optional().describe('Filter jobs that had errors'),
      errorCountMin: z.number().optional().describe('Minimum error count'),
      errorCountMax: z.number().optional().describe('Maximum error count'),
      successRateMin: z.number().optional().describe('Minimum success rate percentage (0-100)'),
      
      // Duration Filters
      durationMinutes: z.number().optional().describe('Filter by processing duration in minutes'),
      durationMinutesMin: z.number().optional().describe('Minimum processing duration'),
      durationMinutesMax: z.number().optional().describe('Maximum processing duration'),
      
      // Pagination and Sorting
      page: z.number().optional().describe('Page number for pagination (default: 1)'),
      limit: z.number().optional().describe('Number of results per page (default: 50, max: 500)'),
      sortBy: z.enum(['startTime', 'completionTime', 'fileName', 'status', 'recordCount', 'errorCount', 'duration']).optional().describe('Sort field'),
      sortOrder: z.enum(['asc', 'desc']).optional().describe('Sort order (default: desc)'),
      
      // Include Options
      includeProgress: z.boolean().optional().describe('Include progress information for running jobs'),
      includeMetrics: z.boolean().optional().describe('Include performance metrics'),
      includeErrorSummary: z.boolean().optional().describe('Include error summary information'),
      includeFileInfo: z.boolean().optional().describe('Include file information and metadata'),
      
      // Time Range Shortcuts
      timeRange: z.enum(['today', 'yesterday', 'this-week', 'last-week', 'this-month', 'last-month', 'this-year']).optional().describe('Predefined time range filter'),
      
      // Advanced Filters
      tags: z.array(z.string()).optional().describe('Filter by custom tags'),
      businessUnit: z.array(z.string()).optional().describe('Filter by business unit'),
      
      // Export Options
      exportFormat: z.enum(['json', 'csv', 'excel']).optional().describe('Export results in specified format'),
      includeDetails: z.boolean().optional().describe('Include detailed information in export')
    },
    async ({ bearerToken, tenantId, ...filters }) => {
      try {
        const queryParams = new URLSearchParams();
        
        // Add all filter parameters to query string
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
              value.forEach(item => queryParams.append(key, item.toString()));
            } else {
              queryParams.append(key, value.toString());
            }
          }
        });
        
        const response = await fetch(`/api/v1/claim-management/imports/jobs?${queryParams.toString()}`, {
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
              text: `Error listing import jobs: ${response.status} ${response.statusText} - ${errorData}`
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
              message: `Found ${result.totalCount || result.jobs?.length || 0} import jobs`,
              metadata: {
                totalJobs: result.totalCount,
                currentPage: result.currentPage,
                totalPages: result.totalPages,
                hasMore: result.hasMore,
                activeJobs: result.summary?.activeJobs || 0,
                completedJobs: result.summary?.completedJobs || 0,
                failedJobs: result.summary?.failedJobs || 0
              }
            }, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text' as const,
            text: `Error listing import jobs: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }
  );
}
