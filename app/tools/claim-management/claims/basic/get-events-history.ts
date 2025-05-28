import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from 'zod';
import { createClaimManagementClient } from '../../client';

export function registerGetEventsHistoryToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_claims_events_history_get',
    'Get the complete event history for a claim, showing all actions, status changes, and activities over time.',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      claim: z.string().describe('Claim identifier (claim number or UUID)'),
      page: z.number().optional().describe('Page number for pagination (default: 1)'),
      limit: z.number().optional().describe('Number of events per page (default: 25)'),
      eventType: z.string().optional().describe('Filter by event type (e.g., "status_change", "payment", "document_added")'),
      dateFrom: z.string().optional().describe('Start date for event filtering (ISO 8601 format)'),
      dateTo: z.string().optional().describe('End date for event filtering (ISO 8601 format)'),
    },
    async ({ bearerToken, tenantId, claim, page, limit, eventType, dateFrom, dateTo }) => {
      try {
        const client = createClaimManagementClient(bearerToken, tenantId);
        
        // Build query parameters
        const params = new URLSearchParams();
        if (page) params.append('page', page.toString());
        if (limit) params.append('limit', limit.toString());
        if (eventType) params.append('event_type', eventType);
        if (dateFrom) params.append('date_from', dateFrom);
        if (dateTo) params.append('date_to', dateTo);
        
        const queryString = params.toString() ? `?${params.toString()}` : '';
        const result = await client.get(`/api/v1/claim-management/claims/${claim}/events-history${queryString}`);
        
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
            text: `Error getting claim events history: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }
  );
}