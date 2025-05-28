import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from 'zod';
import { createClaimManagementClient } from '../../client';

export function registerUpdateDocumentToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_claims_documents_update',
    'Update document metadata, status, or other properties. Cannot modify the actual file content - use upload for new versions.',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      claim: z.string().describe('Claim identifier (claim number or UUID)'),
      document: z.string().describe('Document identifier (UUID)'),
      description: z.string().optional().describe('Updated description or notes about the document'),
      status: z.string().optional().describe('Updated document status (e.g., "pending", "approved", "rejected")'),
      tags: z.array(z.string()).optional().describe('Updated tags for categorizing the document'),
      isPublic: z.boolean().optional().describe('Whether the document should be visible to customers'),
      metadata: z.object({
        capturedDate: z.string().optional().describe('Updated date when the document was captured (ISO 8601 format)'),
        location: z.string().optional().describe('Updated location where document was captured/created'),
        author: z.string().optional().describe('Updated person who created/captured the document'),
      }).optional().describe('Updated metadata about the document'),
    },
    async ({ bearerToken, tenantId, claim, document, ...updateData }) => {
      try {
        const client = createClaimManagementClient(bearerToken, tenantId);
        const result = await client.put(`/api/v1/claim-management/claims/${claim}/documents/${document}`, updateData);
        
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
            text: `Error updating document: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }
  );
}