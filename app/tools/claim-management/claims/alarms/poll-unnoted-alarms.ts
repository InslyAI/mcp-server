import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from 'zod';
import { createClaimManagementClient } from '../../client';

export function registerPollUnnotedAlarmsToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_claims_alarms_poll_unnoted',
    'Poll for unnoted alarms on a claim - alarms that have not been acknowledged or reviewed. Used for monitoring and notification systems.',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      claim: z.string().describe('Claim identifier (claim number or UUID)'),
      priority: z.enum(['low', 'medium', 'high', 'critical']).optional().describe('Filter by minimum priority level'),
      olderThan: z.number().optional().describe('Only return alarms older than this many minutes'),
      includeTypes: z.array(z.string()).optional().describe('Include only specific alarm types (e.g., ["overdue", "high_value"])'),
      excludeTypes: z.array(z.string()).optional().describe('Exclude specific alarm types'),
    },
    async ({ bearerToken, tenantId, claim, priority, olderThan, includeTypes, excludeTypes }) => {
      try {
        const client = createClaimManagementClient(bearerToken, tenantId);
        
        // Build query parameters
        const params = new URLSearchParams();
        if (priority) params.append('priority', priority);
        if (olderThan) params.append('older_than', olderThan.toString());
        if (includeTypes) params.append('include_types', includeTypes.join(','));
        if (excludeTypes) params.append('exclude_types', excludeTypes.join(','));
        
        const queryString = params.toString() ? `?${params.toString()}` : '';
        const result = await client.get(`/api/v1/claim-management/claims/${claim}/alarms/poll-unnoted-alarms${queryString}`);
        
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
            text: `Error polling unnoted alarms: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }
  );
}