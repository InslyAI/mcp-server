import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from 'zod';
import { createClaimManagementClient } from '../../client';

export function registerUpdateCommentToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_claims_comments_update',
    'Update an existing comment on a claim. Only the comment author or users with appropriate permissions can edit comments.',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      claim: z.string().describe('Claim identifier (claim number or UUID)'),
      comment: z.string().describe('Comment identifier (UUID)'),
      content: z.string().optional().describe('Updated comment text content'),
      isInternal: z.boolean().optional().describe('Whether this should be an internal-only comment'),
      priority: z.enum(['low', 'medium', 'high', 'urgent']).optional().describe('Updated priority level of the comment'),
      category: z.string().optional().describe('Updated category or type of comment'),
      tags: z.array(z.string()).optional().describe('Updated tags for categorizing the comment'),
      attachments: z.array(z.string()).optional().describe('Updated array of document IDs attached to this comment'),
    },
    async ({ bearerToken, tenantId, claim, comment, ...updateData }) => {
      try {
        const client = createClaimManagementClient(bearerToken, tenantId);
        const result = await client.put(`/api/v1/claim-management/claims/${claim}/comments/${comment}`, updateData);
        
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
            text: `Error updating comment: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }
  );
}