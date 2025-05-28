import { z } from 'zod';
import { createClaimManagementClient } from '../../client';

const GetEventsHistorySchema = z.object({
  bearerToken: z.string().describe('JWT bearer token from identifier_login'),
  tenantId: z.string().describe('Tenant identifier for the organization'),
  claim: z.string().describe('Claim identifier (claim number or UUID)'),
  page: z.number().optional().describe('Page number for pagination (default: 1)'),
  limit: z.number().optional().describe('Number of events per page (default: 25)'),
  eventType: z.string().optional().describe('Filter by event type (e.g., "status_change", "payment", "document_added")'),
  dateFrom: z.string().optional().describe('Start date for event filtering (ISO 8601 format)'),
  dateTo: z.string().optional().describe('End date for event filtering (ISO 8601 format)'),
});

export function registerGetEventsHistoryToolClaimManagement(server: any) {
  server.setRequestHandler('tools/list', async () => ({
    tools: [{
      name: 'claim_management_claims_events_history_get',
      description: 'Get the complete event history for a claim, showing all actions, status changes, and activities over time.',
      inputSchema: GetEventsHistorySchema,
    }]
  }));

  server.setRequestHandler('tools/call', async (request: any) => {
    if (request.params.name === 'claim_management_claims_events_history_get') {
      try {
        const { bearerToken, tenantId, claim, page, limit, eventType, dateFrom, dateTo } = GetEventsHistorySchema.parse(request.params.arguments);
        
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
            type: 'text',
            text: JSON.stringify(result, null, 2)
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: 'text',
            text: `Error getting claim events history: ${error instanceof Error ? error.message : 'Unknown error'}`
          }],
          isError: true
        };
      }
    }
  });
}