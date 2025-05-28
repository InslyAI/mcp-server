import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from 'zod';
import { createClaimManagementClient } from '../../client';

export function registerUpdateAlarmToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_claims_alarms_update',
    'Update an alarm status, acknowledge it, or add notes. Used to manage alarm lifecycle and track resolution.',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      claim: z.string().describe('Claim identifier (claim number or UUID)'),
      alarm: z.string().describe('Alarm identifier (UUID)'),
      status: z.enum(['active', 'acknowledged', 'resolved', 'dismissed']).optional().describe('Updated alarm status'),
      acknowledgedBy: z.string().optional().describe('User ID who acknowledged the alarm'),
      acknowledgedAt: z.string().optional().describe('Date/time when alarm was acknowledged (ISO 8601 format)'),
      notes: z.string().optional().describe('Notes about the alarm resolution or acknowledgment'),
      resolvedBy: z.string().optional().describe('User ID who resolved the alarm'),
      resolvedAt: z.string().optional().describe('Date/time when alarm was resolved (ISO 8601 format)'),
      resolutionNotes: z.string().optional().describe('Notes about how the alarm was resolved'),
    },
    async ({ bearerToken, tenantId, claim, alarm, ...updateData }) => {
      try {
        const client = createClaimManagementClient(bearerToken, tenantId);
        const result = await client.put(`/api/v1/claim-management/claims/${claim}/alarms/${alarm}`, updateData);
        
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
            text: `Error updating alarm: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }
  );
}