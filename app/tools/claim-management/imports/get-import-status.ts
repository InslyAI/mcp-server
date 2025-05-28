import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export function registerGetImportStatusToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_imports_get_import_status',
    'Get the status and progress of a BDX import job',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      
      jobId: z.string().describe('Import job identifier'),
      
      // Status Details
      includeDetails: z.boolean().optional().describe('Include detailed processing information'),
      includeErrors: z.boolean().optional().describe('Include error details and messages'),
      includeProgress: z.boolean().optional().describe('Include step-by-step progress information'),
      includeMetrics: z.boolean().optional().describe('Include performance metrics'),
      
      // Error Information
      errorLimit: z.number().optional().describe('Maximum number of errors to return (default: 100)'),
      errorOffset: z.number().optional().describe('Offset for error pagination'),
      
      // Progress Tracking
      includeRecordCount: z.boolean().optional().describe('Include processed record counts'),
      includeTimeEstimates: z.boolean().optional().describe('Include estimated completion time'),
      
      // Log Information
      includeLogEntries: z.boolean().optional().describe('Include recent log entries'),
      logLimit: z.number().optional().describe('Maximum number of log entries to return'),
      
      // Performance Data
      includePerformanceData: z.boolean().optional().describe('Include performance metrics and timing'),
      
      // Real-time Updates
      waitForCompletion: z.boolean().optional().describe('Wait for job completion (for synchronous monitoring)'),
      timeoutSeconds: z.number().optional().describe('Timeout for waiting (default: 300 seconds)')
    },
    async ({ bearerToken, tenantId, jobId, ...options }) => {
      try {
        const queryParams = new URLSearchParams();
        
        // Add query parameters
        Object.entries(options).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, value.toString());
          }
        });
        
        const response = await fetch(`/api/v1/claim-management/imports/status/${jobId}?${queryParams.toString()}`, {
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
              text: `Error getting import status: ${response.status} ${response.statusText} - ${errorData}`
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
              message: `Import job ${jobId} status: ${result.status}`,
              metadata: {
                jobId,
                status: result.status,
                progress: result.progressPercentage,
                recordsProcessed: result.recordsProcessed,
                recordsTotal: result.recordsTotal,
                errorCount: result.errorCount,
                startTime: result.startTime,
                endTime: result.endTime,
                estimatedCompletion: result.estimatedCompletion,
                isComplete: ['completed', 'failed', 'cancelled'].includes(result.status)
              }
            }, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text' as const,
            text: `Error getting import status: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }
  );
}
