import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from 'zod';
import { createClaimManagementClient } from '../../client';

export function registerListDocumentsToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_claims_documents_list',
    'Get list of documents associated with a claim, including metadata, types, and status information.',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      claim: z.string().describe('Claim identifier (claim number or UUID)'),
      documentType: z.string().optional().describe('Filter by document type (e.g., "photo", "invoice", "report", "estimate")'),
      status: z.string().optional().describe('Filter by document status (e.g., "pending", "approved", "rejected")'),
      page: z.number().optional().describe('Page number for pagination (default: 1)'),
      limit: z.number().optional().describe('Number of documents per page (default: 25)'),
    },
    async ({ bearerToken, tenantId, claim, documentType, status, page, limit }) => {
      try {
        const client = createClaimManagementClient(bearerToken, tenantId);
        
        // Build query parameters
        const params = new URLSearchParams();
        if (documentType) params.append('document_type', documentType);
        if (status) params.append('status', status);
        if (page) params.append('page', page.toString());
        if (limit) params.append('limit', limit.toString());
        
        const queryString = params.toString() ? `?${params.toString()}` : '';
        const result = await client.get(`/api/v1/claim-management/claims/${claim}/documents${queryString}`);
        
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
            text: `Error listing claim documents: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }
  );
}