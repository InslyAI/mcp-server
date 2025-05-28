import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from 'zod';
import { createClaimManagementClient } from '../../client';

export function registerDownloadDocumentToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_claims_documents_download',
    'Download a document from a claim. Returns download URL or direct file access information.',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      claim: z.string().describe('Claim identifier (claim number or UUID)'),
      document: z.string().describe('Document identifier (UUID)'),
      includeMetadata: z.boolean().optional().describe('Whether to include document metadata in response (default: false)'),
    },
    async ({ bearerToken, tenantId, claim, document, includeMetadata }) => {
      try {
        const client = createClaimManagementClient(bearerToken, tenantId);
        
        // Build query parameters
        const params = new URLSearchParams();
        if (includeMetadata) params.append('include_metadata', 'true');
        
        const queryString = params.toString() ? `?${params.toString()}` : '';
        const result = await client.get(`/api/v1/claim-management/claims/${claim}/documents/${document}/download${queryString}`);
        
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
            text: `Error downloading document: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }
  );
}