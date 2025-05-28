import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from 'zod';
import { createClaimManagementClient } from '../../client';

export function registerDeleteDocumentToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_claims_documents_delete',
    'Delete a document from a claim. This action is permanent and cannot be undone. The document will be removed from storage.',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      claim: z.string().describe('Claim identifier (claim number or UUID)'),
      document: z.string().describe('Document identifier (UUID)'),
      reason: z.string().optional().describe('Reason for deleting the document (for audit trail)'),
    },
    async ({ bearerToken, tenantId, claim, document, reason }) => {
      try {
        const client = createClaimManagementClient(bearerToken, tenantId);
        const deleteData = reason ? { reason } : undefined;
        const result = await client.delete(`/api/v1/claim-management/claims/${claim}/documents/${document}`, deleteData);
        
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
            text: `Error deleting document: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }
  );
}