import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from 'zod';
import { createClaimManagementClient } from '../../client';

export function registerUploadDocumentToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_claims_documents_upload',
    'Upload a new document to a claim. Supports various document types including photos, invoices, reports, and estimates.',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      claim: z.string().describe('Claim identifier (claim number or UUID)'),
      documentType: z.string().describe('Type of document (e.g., "photo", "invoice", "report", "estimate", "correspondence")'),
      fileName: z.string().describe('Name of the file being uploaded'),
      description: z.string().optional().describe('Description or notes about the document'),
      fileSize: z.number().optional().describe('Size of the file in bytes'),
      mimeType: z.string().optional().describe('MIME type of the file (e.g., "image/jpeg", "application/pdf")'),
      tags: z.array(z.string()).optional().describe('Tags for categorizing the document'),
      isPublic: z.boolean().optional().describe('Whether the document is visible to customers (default: false)'),
      metadata: z.object({
        capturedDate: z.string().optional().describe('Date when the document was captured (ISO 8601 format)'),
        location: z.string().optional().describe('Location where document was captured/created'),
        author: z.string().optional().describe('Person who created/captured the document'),
      }).optional().describe('Additional metadata about the document'),
    },
    async ({ bearerToken, tenantId, claim, ...documentData }) => {
      try {
        const client = createClaimManagementClient(bearerToken, tenantId);
        const result = await client.post(`/api/v1/claim-management/claims/${claim}/documents`, documentData);
        
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
            text: `Error uploading document: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }
  );
}