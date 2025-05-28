import { z } from 'zod';
import { createClaimManagementClient } from '../../client';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export function registerAuthorizeReserveToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_claims_reserves_authorize',
    'Authorize a financial reserve for a claim (approval workflow)',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      claim: z.string().describe('Claim identifier (claim number or UUID)'),
      reserve: z.string().describe('Reserve identifier to authorize'),
      authorizationNotes: z.string().optional().describe('Notes about the authorization decision'),
      approverComments: z.string().optional().describe('Comments from the approver'),
      authorizationLevel: z.string().optional().describe('Authorization level or threshold'),
      effectiveDate: z.string().optional().describe('Effective date of authorization (ISO 8601 format)')
    },
    async ({ bearerToken, tenantId, claim, reserve, ...params }: any) => {
      try {
        const client = createClaimManagementClient(bearerToken, tenantId);
        const result = await client.post(`/api/v1/claim-management/claims/${claim}/reserves/${reserve}/authorize`, params);
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              success: true,
              data: result,
              message: 'Reserve authorized successfully'
            }, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text', 
            text: JSON.stringify({
              success: false,
              error: error.message || 'Failed to authorize reserve',
              details: error.response?.data || error
            }, null, 2)
          }]
        };
      }
    }
  );
}
