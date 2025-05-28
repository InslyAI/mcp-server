import { z } from 'zod';
import { createClaimManagementClient } from '../../client';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export function registerClearReserveToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_claims_reserves_clear',
    'Clear a specific financial reserve for a claim',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      claim: z.string().describe('Claim identifier (claim number or UUID)'),
      reserve: z.string().describe('Reserve identifier to clear'),
      reason: z.string().describe('Reason for clearing the reserve'),
      effectiveDate: z.string().optional().describe('Effective date for clearing the reserve (ISO 8601 format)'),
      notes: z.string().optional().describe('Additional notes about clearing the reserve'),
      preserveHistory: z.boolean().optional().describe('Whether to preserve reserve history after clearing')
    },
    async ({ bearerToken, tenantId, claim, reserve, ...params }: any) => {
      try {
        const client = createClaimManagementClient(bearerToken, tenantId);
        const result = await client.post(`/api/v1/claim-management/claims/${claim}/reserves/${reserve}/clear`, params);
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              success: true,
              data: result,
              message: 'Reserve cleared successfully'
            }, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text', 
            text: JSON.stringify({
              success: false,
              error: error.message || 'Failed to clear reserve',
              details: error.response?.data || error
            }, null, 2)
          }]
        };
      }
    }
  );
}
