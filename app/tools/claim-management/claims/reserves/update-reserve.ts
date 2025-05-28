import { z } from 'zod';
import { createClaimManagementClient } from '../../client';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export function registerUpdateReserveToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_claims_reserves_update',
    'Update an existing financial reserve for a claim',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      claim: z.string().describe('Claim identifier (claim number or UUID)'),
      reserve: z.string().describe('Reserve identifier to update'),
      reason: z.string().optional().describe('Updated reason for the reserve'),
      type: z.string().optional().describe('Updated type of reserve (e.g., indemnity, expenses)'),
      coverage: z.string().optional().describe('Updated coverage type for the reserve'),
      amount: z.number().positive().optional().describe('Updated reserve amount (positive number)'),
      currency: z.string().optional().describe('Updated currency code (e.g., EUR, USD)'),
      notes: z.string().optional().describe('Updated notes about the reserve'),
      effectiveDate: z.string().optional().describe('Updated effective date of the reserve (ISO 8601 format)'),
      category: z.string().optional().describe('Updated reserve category classification'),
      subcategory: z.string().optional().describe('Updated reserve subcategory classification'),
      status: z.string().optional().describe('Updated reserve status')
    },
    async ({ bearerToken, tenantId, claim, reserve, ...params }: any) => {
      try {
        const client = createClaimManagementClient(bearerToken, tenantId);
        const result = await client.put(`/api/v1/claim-management/claims/${claim}/reserves/${reserve}`, params);
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              success: true,
              data: result,
              message: 'Reserve updated successfully'
            }, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text', 
            text: JSON.stringify({
              success: false,
              error: error.message || 'Failed to update reserve',
              details: error.response?.data || error
            }, null, 2)
          }]
        };
      }
    }
  );
}
