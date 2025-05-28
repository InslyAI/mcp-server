import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { createClaimManagementClient } from '../client';

export function registerGetPartnerToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_partners_get',
    'Get detailed information about a specific business partner',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      partner: z.string().describe('Partner identifier to retrieve'),
      includeHistory: z.boolean().optional().describe('Whether to include assignment history'),
      includeMetrics: z.boolean().optional().describe('Whether to include performance metrics'),
      includeCredentials: z.boolean().optional().describe('Whether to include credentials and certifications')
    },
    async ({ bearerToken, tenantId, partner, includeHistory, includeMetrics, includeCredentials }) => {
      try {
        const client = createClaimManagementClient(bearerToken, tenantId);
        
        // Build query parameters
        const params = new URLSearchParams();
        if (includeHistory !== undefined) params.append('include_history', includeHistory.toString());
        if (includeMetrics !== undefined) params.append('include_metrics', includeMetrics.toString());
        if (includeCredentials !== undefined) params.append('include_credentials', includeCredentials.toString());
        
        const queryString = params.toString() ? `?${params.toString()}` : '';
        const result = await client.get(`/api/v1/claim-management/partners/${partner}${queryString}`);
        
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
            text: `Error retrieving partner: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }
  );
}
