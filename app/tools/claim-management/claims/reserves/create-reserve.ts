import { z } from 'zod';
import { createClaimManagementClient } from '../../client';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export function registerCreateReserveToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_claims_reserves_create',
    'Create a new financial reserve for a claim',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      claim: z.string().describe('Claim identifier (claim number or UUID)'),
      reason: z.string().describe('Reason for creating the reserve'),
      type: z.string().describe('Type of reserve (e.g., indemnity, expenses)'),
      coverage: z.string().optional().describe('Coverage type for the reserve'),
      amount: z.number().positive().describe('Reserve amount (positive number)'),
      currency: z.string().optional().describe('Currency code (e.g., EUR, USD)'),
      notes: z.string().optional().describe('Additional notes about the reserve'),
      effectiveDate: z.string().optional().describe('Effective date of the reserve (ISO 8601 format)'),
      category: z.string().optional().describe('Reserve category classification'),
      subcategory: z.string().optional().describe('Reserve subcategory classification')
    },
    async ({ bearerToken, tenantId, claim, ...params }: any) => {
      try {
        const client = createClaimManagementClient(bearerToken, tenantId);
        const result = await client.post(`/api/v1/claim-management/claims/${claim}/reserves`, params);
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              success: true,
              data: result,
              message: 'Reserve created successfully'
            }, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text', 
            text: JSON.stringify({
              success: false,
              error: error.message || 'Failed to create reserve',
              details: error.response?.data || error
            }, null, 2)
          }]
        };
      }
    }
  );
}
