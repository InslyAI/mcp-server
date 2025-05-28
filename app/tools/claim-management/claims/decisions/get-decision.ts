import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { createClaimManagementClient } from '../../client';

export function registerGetDecisionToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_claims_decisions_get',
    'Get detailed information about a specific indemnity decision',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      claim: z.string().describe('Claim identifier (claim number or UUID)'),
      decision: z.string().describe('Decision identifier to retrieve'),
      includeHistory: z.boolean().optional().describe('Whether to include decision history and revisions'),
      includeAttachments: z.boolean().optional().describe('Whether to include attachment metadata')
    },
    async ({ bearerToken, tenantId, claim, decision, includeHistory, includeAttachments }) => {
      try {
        const client = createClaimManagementClient(bearerToken, tenantId);
        
        // Build query parameters
        const params = new URLSearchParams();
        if (includeHistory !== undefined) params.append('include_history', includeHistory.toString());
        if (includeAttachments !== undefined) params.append('include_attachments', includeAttachments.toString());
        
        const queryString = params.toString() ? `?${params.toString()}` : '';
        const result = await client.get(`/api/v1/claim-management/claims/${claim}/decisions/${decision}${queryString}`);
        
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
            text: `Error retrieving decision: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }
  );
}
