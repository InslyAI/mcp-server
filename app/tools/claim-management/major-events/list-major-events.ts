import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { createClaimManagementClient } from '../client';

export function registerListMajorEventsToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_major_events_list',
    'Get list of major events (catastrophes, natural disasters, large-scale incidents)',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      eventType: z.string().optional().describe('Filter by event type (e.g., "natural_disaster", "accident", "catastrophe")'),
      status: z.string().optional().describe('Filter by event status (e.g., "active", "closed", "monitoring")'),
      location: z.string().optional().describe('Filter by location/region'),
      fromDate: z.string().optional().describe('Filter events from date (ISO 8601)'),
      toDate: z.string().optional().describe('Filter events to date (ISO 8601)'),
      severityLevel: z.string().optional().describe('Filter by severity level'),
      page: z.number().optional().describe('Page number for pagination'),
      limit: z.number().optional().describe('Number of events per page'),
      sortBy: z.string().optional().describe('Field to sort by'),
      sortOrder: z.enum(['asc', 'desc']).optional().describe('Sort order')
    },
    async ({ bearerToken, tenantId, eventType, status, location, fromDate, toDate, severityLevel, page, limit, sortBy, sortOrder }) => {
      try {
        const client = createClaimManagementClient(bearerToken, tenantId);
        
        // Build query parameters
        const params = new URLSearchParams();
        if (eventType) params.append('event_type', eventType);
        if (status) params.append('status', status);
        if (location) params.append('location', location);
        if (fromDate) params.append('from_date', fromDate);
        if (toDate) params.append('to_date', toDate);
        if (severityLevel) params.append('severity_level', severityLevel);
        if (page) params.append('page', page.toString());
        if (limit) params.append('limit', limit.toString());
        if (sortBy) params.append('sort_by', sortBy);
        if (sortOrder) params.append('sort_order', sortOrder);
        
        const queryString = params.toString() ? `?${params.toString()}` : '';
        const result = await client.get(`/api/v1/claim-management/major-events${queryString}`);
        
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
            text: `Error listing major events: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }
  );
}
