import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export function registerImportBdxToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_imports_import_bdx',
    'Import BDX (Bordereau Data Exchange) file into the claim management system',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      
      // File Information
      fileContent: z.string().optional().describe('Base64 encoded file content to import'),
      fileUrl: z.string().optional().describe('URL to the BDX file to import'),
      fileName: z.string().describe('Name of the BDX file'),
      
      // Import Configuration
      importMode: z.enum(['validate-only', 'import-valid', 'import-all', 'update-existing']).describe('Import processing mode'),
      batchSize: z.number().optional().describe('Number of records to process in each batch (default: 1000)'),
      
      // Data Mapping
      fieldMapping: z.record(z.string()).optional().describe('Custom field mapping (source field -> target field)'),
      defaultValues: z.record(z.any()).optional().describe('Default values for missing fields'),
      
      // Processing Options
      skipValidation: z.boolean().optional().describe('Skip validation and import all records'),
      allowPartialImport: z.boolean().optional().describe('Allow import of valid records even if some fail'),
      updateExisting: z.boolean().optional().describe('Update existing records if they already exist'),
      duplicateHandling: z.enum(['skip', 'update', 'create-new', 'error']).optional().describe('How to handle duplicate records'),
      
      // Business Rules
      applyBusinessRules: z.boolean().optional().describe('Apply business rules during import'),
      autoAssignAdjusters: z.boolean().optional().describe('Automatically assign adjusters based on rules'),
      autoCalculateReserves: z.boolean().optional().describe('Automatically calculate reserves'),
      
      // Workflow Integration
      triggerWorkflows: z.boolean().optional().describe('Trigger workflows for imported claims'),
      notifyStakeholders: z.boolean().optional().describe('Send notifications to stakeholders'),
      
      // Data Quality
      cleanData: z.boolean().optional().describe('Apply data cleaning rules during import'),
      standardizeAddresses: z.boolean().optional().describe('Standardize address formats'),
      validatePhoneNumbers: z.boolean().optional().describe('Validate and format phone numbers'),
      
      // Error Handling
      continueOnError: z.boolean().optional().describe('Continue processing if errors occur'),
      maxErrors: z.number().optional().describe('Maximum number of errors before stopping'),
      createErrorLog: z.boolean().optional().describe('Create detailed error log'),
      
      // Audit and Tracking
      importReason: z.string().optional().describe('Reason for the import (for audit trail)'),
      importedBy: z.string().optional().describe('User performing the import'),
      sourceSystem: z.string().optional().describe('Source system providing the data'),
      
      // Post-Import Actions
      generateReport: z.boolean().optional().describe('Generate import summary report'),
      sendNotification: z.boolean().optional().describe('Send completion notification'),
      archiveFile: z.boolean().optional().describe('Archive the imported file'),
      
      // Scheduling
      scheduleImport: z.boolean().optional().describe('Schedule import for later execution'),
      scheduledTime: z.string().optional().describe('Scheduled execution time (ISO 8601 format)'),
      
      // Advanced Options
      transformations: z.array(z.object({
        field: z.string(),
        transformation: z.string(),
        parameters: z.record(z.any()).optional()
      })).optional().describe('Data transformations to apply during import'),
      
      customProcessing: z.string().optional().describe('Custom processing script or rules')
    },
    async ({ bearerToken, tenantId, fileName, importMode, ...importOptions }) => {
      try {
        const requestBody = {
          fileName,
          importMode,
          ...importOptions
        };
        
        const response = await fetch('/api/v1/claim-management/imports/import-bdx', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${bearerToken}`,
            'Content-Type': 'application/json',
            'X-Tenant-ID': tenantId
          },
          body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
          const errorData = await response.text();
          return {
            content: [{
              type: 'text' as const,
              text: `Error importing BDX file: ${response.status} ${response.statusText} - ${errorData}`
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
              message: `BDX import ${result.jobId ? 'started' : 'completed'} for ${fileName}`,
              metadata: {
                fileName,
                importMode,
                jobId: result.jobId,
                status: result.status,
                recordsProcessed: result.recordsProcessed,
                recordsImported: result.recordsImported,
                recordsSkipped: result.recordsSkipped,
                recordsErrored: result.recordsErrored,
                processingTime: result.processingTime,
                isAsync: !!result.jobId
              }
            }, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text' as const,
            text: `Error importing BDX file: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }
  );
}
