import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { createClaimManagementClient } from '../client';

export function registerListOpenMajorEventsToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_major_events_list_open',
    'Get list of currently open major events (active disasters/incidents)',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      severityLevel: z.string().optional().describe('Filter by minimum severity level'),
      eventType: z.string().optional().describe('Filter by event type'),
      location: z.string().optional().describe('Filter by location/region'),
      includeStatistics: z.boolean().optional().describe('Whether to include claim statistics for each event')
    },
    async ({ bearerToken, tenantId, severityLevel, eventType, location, includeStatistics }) => {
      try {
        const client = createClaimManagementClient(bearerToken, tenantId);
        
        // Build query parameters
        const params = new URLSearchParams();
        if (severityLevel) params.append('severity_level', severityLevel);
        if (eventType) params.append('event_type', eventType);
        if (location) params.append('location', location);
        if (includeStatistics !== undefined) params.append('include_statistics', includeStatistics.toString());
        
        const queryString = params.toString() ? `?${params.toString()}` : '';
        const result = await client.get(`/api/v1/claim-management/open-major-events${queryString}`);
        
        return {
          content: [{
            type: 'text' as const,
            text: JSON.stringify({
              success: true,
              data: result,
              message: 'Open major events retrieved successfully'
            }, null, 2)
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: 'text' as const,
            text: `Error retrieving open major events: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }
  );
}
