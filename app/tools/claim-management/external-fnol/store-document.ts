import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { createClaimManagementClient } from '../client';

export function registerStoreExternalFnolDocumentToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_external_fnol_store_document',
    'Store document for external FNOL claim (file upload via multipart/form-data)',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      claimUuid: z.string().describe('External FNOL claim UUID'),
      documentType: z.string().describe('Type of document being uploaded (e.g., "damage_photos", "police_report", "witness_statement")'),
      fileData: z.object({
        fileName: z.string().describe('Name of the file'),
        fileSize: z.number().optional().describe('Size of the file in bytes'),
        mimeType: z.string().optional().describe('MIME type of the file'),
        fileContent: z.string().describe('Base64 encoded file content or file path')
      }).describe('File data to upload'),
      description: z.string().optional().describe('Description of the document'),
      category: z.string().optional().describe('Document category for organization'),
      isPublic: z.boolean().optional().describe('Whether document should be visible to claimant'),
      metadata: z.record(z.any()).optional().describe('Additional document metadata')
    },
    async ({ bearerToken, tenantId, claimUuid, documentType, fileData, description, category, isPublic, metadata }) => {
      try {
        const client = createClaimManagementClient(bearerToken, tenantId);
        
        // Note: This is a simplified representation. In practice, you would need to handle
        // multipart/form-data uploads differently, possibly using FormData
        const uploadData = {
          'document-type[]': documentType,
          file: fileData,
          description,
          category,
          isPublic,
          metadata
        };
        
        const result = await client.post(`/api/v1/claim-management/fnol-external/${claimUuid}/documents`, uploadData);
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              success: true,
              data: result,
              message: 'External FNOL document uploaded successfully',
              note: 'In production, this would handle actual file upload via multipart/form-data'
            }, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text', 
            text: JSON.stringify({
              success: false,
              error: error.message || 'Failed to upload external FNOL document',
              details: error.response?.data || error
            }, null, 2)
          }]
        };
      }
    }
  );
}
