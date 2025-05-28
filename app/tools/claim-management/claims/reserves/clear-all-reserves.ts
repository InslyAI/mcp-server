import { z } from 'zod';
import { createClaimManagementClient } from '../../client';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export function registerClearAllReservesToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_claims_reserves_clear_all',
    'Clear all financial reserves for a claim (bulk operation)',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      claim: z.string().describe('Claim identifier (claim number or UUID)'),
      reason: z.string().describe('Reason for clearing all reserves'),
      effectiveDate: z.string().optional().describe('Effective date for clearing reserves (ISO 8601 format)'),
      notes: z.string().optional().describe('Additional notes about clearing all reserves'),
      confirmation: z.boolean().optional().describe('Confirmation flag for bulk operation safety'),
      preserveHistory: z.boolean().optional().describe('Whether to preserve reserve history after clearing')
    },
    async ({ bearerToken, tenantId, claim, ...params }: any) => {
      try {
        const client = createClaimManagementClient(bearerToken, tenantId);
        const result = await client.post(`/api/v1/claim-management/claims/${claim}/reserves/clear`, params);
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              success: true,
              data: result,
              message: 'All reserves cleared successfully'
            }, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text', 
            text: JSON.stringify({
              success: false,
              error: error.message || 'Failed to clear all reserves',
              details: error.response?.data || error
            }, null, 2)
          }]
        };
      }
    }
  );
}
