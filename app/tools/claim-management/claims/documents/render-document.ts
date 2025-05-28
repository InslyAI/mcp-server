import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from 'zod';
import { createClaimManagementClient } from '../../client';

export function registerRenderDocumentToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_claims_documents_render',
    'Render a document template with claim data. Used for generating standard forms, letters, and reports.',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      claim: z.string().describe('Claim identifier (claim number or UUID)'),
      templateId: z.string().describe('Document template identifier to render'),
      format: z.enum(['pdf', 'docx', 'html']).optional().describe('Output format for rendered document (default: pdf)'),
      includeAttachments: z.boolean().optional().describe('Whether to include claim attachments in rendered document (default: false)'),
      customData: z.record(z.any()).optional().describe('Additional data to merge into the template'),
    },
    async ({ bearerToken, tenantId, claim, ...renderData }) => {
      try {
        const client = createClaimManagementClient(bearerToken, tenantId);
        const result = await client.post(`/api/v1/claim-management/claims/${claim}/documents/render`, renderData);
        
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
            text: `Error rendering document: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }
  );
}