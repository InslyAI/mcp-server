import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from 'zod';
import { createClaimManagementClient } from '../../client';

export function registerDeleteCommentToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_claims_comments_delete',
    'Delete a comment from a claim. This action may be restricted depending on permissions and company policy.',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      claim: z.string().describe('Claim identifier (claim number or UUID)'),
      comment: z.string().describe('Comment identifier (UUID)'),
      reason: z.string().optional().describe('Reason for deleting the comment (for audit trail)'),
    },
    async ({ bearerToken, tenantId, claim, comment, reason }) => {
      try {
        const client = createClaimManagementClient(bearerToken, tenantId);
        const deleteData = reason ? { reason } : undefined;
        const result = await client.delete(`/api/v1/claim-management/claims/${claim}/comments/${comment}`, deleteData);
        
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
            text: `Error deleting comment: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }
  );
}