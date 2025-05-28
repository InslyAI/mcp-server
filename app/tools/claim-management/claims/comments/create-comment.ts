import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from 'zod';
import { createClaimManagementClient } from '../../client';

export function registerCreateCommentToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_claims_comments_create',
    'Add a new comment or note to a claim. Comments can be internal-only or visible to customers depending on settings.',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      claim: z.string().describe('Claim identifier (claim number or UUID)'),
      content: z.string().describe('The comment text content'),
      isInternal: z.boolean().optional().describe('Whether this is an internal-only comment (default: true)'),
      priority: z.enum(['low', 'medium', 'high', 'urgent']).optional().describe('Priority level of the comment'),
      category: z.string().optional().describe('Category or type of comment (e.g., "adjustment", "investigation", "customer_contact")'),
      tags: z.array(z.string()).optional().describe('Tags for categorizing the comment'),
      attachments: z.array(z.string()).optional().describe('Array of document IDs to attach to this comment'),
      mentionedUsers: z.array(z.string()).optional().describe('Array of user IDs to notify about this comment'),
    },
    async ({ bearerToken, tenantId, claim, ...commentData }) => {
      try {
        const client = createClaimManagementClient(bearerToken, tenantId);
        const result = await client.post(`/api/v1/claim-management/claims/${claim}/comments`, commentData);
        
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
            text: `Error creating comment: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }
  );
}