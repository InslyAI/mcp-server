import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from 'zod';
import { createClaimManagementClient } from '../../client';

export function registerListAlarmsToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_claims_alarms_list',
    'Get list of alarms and alerts associated with a claim, including overdue tasks, high-value alerts, and escalation notices.',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      claim: z.string().describe('Claim identifier (claim number or UUID)'),
      status: z.string().optional().describe('Filter by alarm status (e.g., "active", "acknowledged", "resolved")'),
      priority: z.enum(['low', 'medium', 'high', 'critical']).optional().describe('Filter by alarm priority level'),
      alarmType: z.string().optional().describe('Filter by alarm type (e.g., "overdue", "high_value", "escalation", "deadline")'),
      includeResolved: z.boolean().optional().describe('Whether to include resolved alarms (default: false)'),
    },
    async ({ bearerToken, tenantId, claim, status, priority, alarmType, includeResolved }) => {
      try {
        const client = createClaimManagementClient(bearerToken, tenantId);
        
        // Build query parameters
        const params = new URLSearchParams();
        if (status) params.append('status', status);
        if (priority) params.append('priority', priority);
        if (alarmType) params.append('alarm_type', alarmType);
        if (includeResolved !== undefined) params.append('include_resolved', includeResolved.toString());
        
        const queryString = params.toString() ? `?${params.toString()}` : '';
        const result = await client.get(`/api/v1/claim-management/claims/${claim}/alarms${queryString}`);
        
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
            text: `Error listing claim alarms: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }
  );
}