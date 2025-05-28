import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from 'zod';
import { createClaimManagementClient } from '../../client';

export function registerListCommentsToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_claims_comments_list',
    'Get list of comments and notes associated with a claim, including author information and timestamps.',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      claim: z.string().describe('Claim identifier (claim number or UUID)'),
      includeInternal: z.boolean().optional().describe('Whether to include internal-only comments (default: true)'),
      authorId: z.string().optional().describe('Filter comments by specific author ID'),
      dateFrom: z.string().optional().describe('Start date for filtering comments (ISO 8601 format)'),
      dateTo: z.string().optional().describe('End date for filtering comments (ISO 8601 format)'),
      page: z.number().optional().describe('Page number for pagination (default: 1)'),
      limit: z.number().optional().describe('Number of comments per page (default: 25)'),
    },
    async ({ bearerToken, tenantId, claim, includeInternal, authorId, dateFrom, dateTo, page, limit }) => {
      try {
        const client = createClaimManagementClient(bearerToken, tenantId);
        
        // Build query parameters
        const params = new URLSearchParams();
        if (includeInternal !== undefined) params.append('include_internal', includeInternal.toString());
        if (authorId) params.append('author_id', authorId);
        if (dateFrom) params.append('date_from', dateFrom);
        if (dateTo) params.append('date_to', dateTo);
        if (page) params.append('page', page.toString());
        if (limit) params.append('limit', limit.toString());
        
        const queryString = params.toString() ? `?${params.toString()}` : '';
        const result = await client.get(`/api/v1/claim-management/claims/${claim}/comments${queryString}`);
        
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
            text: `Error listing claim comments: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }
  );
}