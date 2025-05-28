import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from 'zod';
import { createClaimManagementClient } from '../../client';

export function registerDownloadThumbnailToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_claims_documents_download_thumbnail',
    'Download a thumbnail version of a document. Useful for previews and quick document identification.',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      claim: z.string().describe('Claim identifier (claim number or UUID)'),
      document: z.string().describe('Document identifier (UUID)'),
      size: z.enum(['small', 'medium', 'large']).describe('Thumbnail size (small: 150px, medium: 300px, large: 600px)'),
    },
    async ({ bearerToken, tenantId, claim, document, size }) => {
      try {
        const client = createClaimManagementClient(bearerToken, tenantId);
        const result = await client.get(`/api/v1/claim-management/claims/${claim}/documents/${document}/download/${size}`);
        
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
            text: `Error downloading document thumbnail: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }
  );
}