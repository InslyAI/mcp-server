import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from 'zod';
import { createClaimManagementClient } from '../client';

export function registerMyClaimsAlarmedToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_dashboard_my_claims_alarmed',
    'Get dashboard view of claims assigned to the current user that have active alarms or require urgent attention.',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      page: z.number().optional().describe('Page number for pagination (default: 1)'),
      limit: z.number().optional().describe('Number of claims per page (default: 25)'),
      alarmType: z.string().optional().describe('Filter by alarm type (e.g., "overdue", "high_value", "escalation")'),
      priority: z.enum(['low', 'medium', 'high', 'critical']).optional().describe('Filter by alarm priority'),
    },
    async ({ bearerToken, tenantId, page, limit, alarmType, priority }) => {
      try {
        const client = createClaimManagementClient(bearerToken, tenantId);
        
        // Build query parameters
        const params = new URLSearchParams();
        if (page) params.append('page', page.toString());
        if (limit) params.append('limit', limit.toString());
        if (alarmType) params.append('alarm_type', alarmType);
        if (priority) params.append('priority', priority);
        
        const queryString = params.toString() ? `?${params.toString()}` : '';
        const result = await client.get(`/api/v1/claim-management/dashboard/my-claims/alarmed${queryString}`);
        
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
            text: `Error getting alarmed claims dashboard: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }
  );
}