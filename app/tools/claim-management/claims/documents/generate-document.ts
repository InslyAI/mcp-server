import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from 'zod';
import { createClaimManagementClient } from '../../client';

export function registerGenerateDocumentToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_claims_documents_generate',
    'Generate a standard document for the claim such as settlement letters, denial letters, or claim summaries.',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      claim: z.string().describe('Claim identifier (claim number or UUID)'),
      documentType: z.enum(['settlement_letter', 'denial_letter', 'claim_summary', 'payment_authorization', 'reserve_letter']).describe('Type of document to generate'),
      language: z.string().optional().describe('Language code for document generation (e.g., "en", "es", "fr")'),
      includeImages: z.boolean().optional().describe('Whether to include claim images in generated document (default: false)'),
      recipientInfo: z.object({
        name: z.string().describe('Recipient name'),
        address: z.string().optional().describe('Recipient address'),
        email: z.string().optional().describe('Recipient email'),
      }).optional().describe('Recipient information for personalized documents'),
      customContent: z.object({
        additionalText: z.string().optional().describe('Additional text to include in the document'),
        specialInstructions: z.string().optional().describe('Special instructions or notes'),
      }).optional().describe('Custom content to include in generated document'),
    },
    async ({ bearerToken, tenantId, claim, ...generateData }) => {
      try {
        const client = createClaimManagementClient(bearerToken, tenantId);
        const result = await client.post(`/api/v1/claim-management/claims/${claim}/documents/generate`, generateData);
        
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
            text: `Error generating document: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }
  );
}