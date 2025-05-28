import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from 'zod';
import { createClaimManagementClient } from '../../client';

export function registerGetClaimToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_claims_get',
    'Get detailed information about a specific claim, including all related data such as status, amounts, parties involved, and history.',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      claim: z.string().describe('Claim identifier (claim number or UUID)'),
    },
    async ({ bearerToken, tenantId, claim }) => {
      try {
        const client = createClaimManagementClient(bearerToken, tenantId);
        const result = await client.get(`/api/v1/claim-management/claims/${claim}`);
        
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
            text: `Error getting claim: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }
  );
}