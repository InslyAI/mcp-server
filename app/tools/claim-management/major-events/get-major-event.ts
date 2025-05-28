import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { createClaimManagementClient } from '../client';

export function registerGetMajorEventToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_major_events_get',
    'Get detailed information about a specific major event',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      majorEvent: z.string().describe('Major event identifier'),
      includeStatistics: z.boolean().optional().describe('Whether to include claim statistics'),
      includeResponseTeam: z.boolean().optional().describe('Whether to include response team details'),
      includeTimeline: z.boolean().optional().describe('Whether to include event timeline')
    },
    async ({ bearerToken, tenantId, majorEvent, includeStatistics, includeResponseTeam, includeTimeline }) => {
      try {
        const client = createClaimManagementClient(bearerToken, tenantId);
        
        // Build query parameters
        const params = new URLSearchParams();
        if (includeStatistics !== undefined) params.append('include_statistics', includeStatistics.toString());
        if (includeResponseTeam !== undefined) params.append('include_response_team', includeResponseTeam.toString());
        if (includeTimeline !== undefined) params.append('include_timeline', includeTimeline.toString());
        
        const queryString = params.toString() ? `?${params.toString()}` : '';
        const result = await client.get(`/api/v1/claim-management/major-events/${majorEvent}${queryString}`);
        
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
            text: `Error retrieving major event: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }
  );
}
