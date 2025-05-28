import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export function registerValidateBdxToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_imports_validate_bdx',
    'Validate BDX (Bordereau Data Exchange) file format and content before import',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      
      // File Information
      fileContent: z.string().optional().describe('Base64 encoded file content for validation'),
      fileUrl: z.string().optional().describe('URL to the BDX file to validate'),
      fileName: z.string().describe('Name of the BDX file'),
      fileSize: z.number().optional().describe('Size of the file in bytes'),
      
      // BDX Format Options
      bdxVersion: z.string().optional().describe('Expected BDX version (1.0, 2.0, etc.)'),
      bdxType: z.enum(['claims', 'policies', 'premiums', 'exposures', 'mixed']).optional().describe('Type of BDX data expected'),
      
      // Validation Rules
      strictValidation: z.boolean().optional().describe('Apply strict validation rules (default: true)'),
      allowPartialData: z.boolean().optional().describe('Allow records with partial/missing data'),
      validateDates: z.boolean().optional().describe('Validate date formats and ranges'),
      validateAmounts: z.boolean().optional().describe('Validate monetary amounts and currencies'),
      validateCodes: z.boolean().optional().describe('Validate industry/company specific codes'),
      
      // Schema Validation
      customSchema: z.string().optional().describe('Custom validation schema (JSON Schema format)'),
      schemaVersion: z.string().optional().describe('Schema version to validate against'),
      
      // Data Quality Checks
      checkDuplicates: z.boolean().optional().describe('Check for duplicate records'),
      checkConsistency: z.boolean().optional().describe('Check data consistency across fields'),
      checkReferentialIntegrity: z.boolean().optional().describe('Check referential integrity'),
      
      // Business Rule Validation
      validateBusinessRules: z.boolean().optional().describe('Apply business rule validation'),
      customBusinessRules: z.array(z.string()).optional().describe('Custom business rules to apply'),
      
      // Error Handling
      maxErrors: z.number().optional().describe('Maximum number of errors to report (default: 100)'),
      stopOnFirstError: z.boolean().optional().describe('Stop validation on first error'),
      includeWarnings: z.boolean().optional().describe('Include warnings in validation report'),
      
      // Output Options
      detailedReport: z.boolean().optional().describe('Generate detailed validation report'),
      includeLineNumbers: z.boolean().optional().describe('Include line numbers in error reports'),
      exportFormat: z.enum(['json', 'xml', 'csv', 'excel']).optional().describe('Format for validation report'),
      
      // Processing Options
      sampleSize: z.number().optional().describe('Number of records to validate (for large files)'),
      randomSample: z.boolean().optional().describe('Use random sampling for large files'),
      
      // Metadata Validation
      validateMetadata: z.boolean().optional().describe('Validate file metadata and headers'),
      requiredFields: z.array(z.string()).optional().describe('List of required fields for validation'),
      
      // Encoding and Format
      expectedEncoding: z.string().optional().describe('Expected file encoding (UTF-8, ISO-8859-1, etc.)'),
      delimiter: z.string().optional().describe('Field delimiter for delimited files'),
      
      // Audit Trail
      validationReason: z.string().optional().describe('Reason for validation (for audit trail)'),
      requestedBy: z.string().optional().describe('User requesting validation')
    },
    async ({ bearerToken, tenantId, fileName, ...validationOptions }) => {
      try {
        const requestBody = {
          fileName,
          ...validationOptions
        };
        
        const response = await fetch('/api/v1/claim-management/imports/validate-bdx', {
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
              text: `Error validating BDX file: ${response.status} ${response.statusText} - ${errorData}`
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
              message: `BDX validation completed for ${fileName}`,
              metadata: {
                fileName,
                validationStatus: result.isValid ? 'VALID' : 'INVALID',
                errorCount: result.errors?.length || 0,
                warningCount: result.warnings?.length || 0,
                recordCount: result.recordCount,
                validRecords: result.validRecords,
                processingTime: result.processingTime
              }
            }, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text' as const,
            text: `Error validating BDX file: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }
  );
}
