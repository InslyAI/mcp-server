import { z } from 'zod';
import { createClaimManagementClient } from '../../client';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export function registerGetReserveAmountsToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_claims_reserves_get_amounts',
    'Get detailed amounts and calculations for a specific reserve',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      claim: z.string().describe('Claim identifier (claim number or UUID)'),
      reserve: z.string().describe('Reserve identifier to get amounts for'),
      includeHistory: z.boolean().optional().describe('Whether to include historical amount changes'),
      currency: z.string().optional().describe('Currency for amount conversion (if supported)'),
      asOfDate: z.string().optional().describe('Get amounts as of specific date (ISO 8601 format)')
    },
    async ({ bearerToken, tenantId, claim, reserve, ...params }: any) => {
      try {
        const client = createClaimManagementClient(bearerToken, tenantId);
        
        // Build query parameters
        const queryParams = new URLSearchParams();
        if (params.includeHistory !== undefined) queryParams.append('include_history', params.includeHistory.toString());
        if (params.currency) queryParams.append('currency', params.currency);
        if (params.asOfDate) queryParams.append('as_of_date', params.asOfDate);
        
        const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
        const result = await client.get(`/api/v1/claim-management/claims/${claim}/reserves/${reserve}/amounts${queryString}`);
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              success: true,
              data: result,
              message: 'Reserve amounts retrieved successfully'
            }, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text', 
            text: JSON.stringify({
              success: false,
              error: error.message || 'Failed to get reserve amounts',
              details: error.response?.data || error
            }, null, 2)
          }]
        };
      }
    }
  );
}
