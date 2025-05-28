import { z } from 'zod';
import { createClaimManagementClient } from '../../client';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export function registerCreateReserveDecisionToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_claims_reserves_decisions_create',
    'Create a new decision record for a specific reserve',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      claim: z.string().describe('Claim identifier (claim number or UUID)'),
      reserve: z.string().describe('Reserve identifier to create decision for'),
      decisionType: z.string().describe('Type of decision (e.g., approval, adjustment, review)'),
      decision: z.string().describe('The actual decision made'),
      decisionReason: z.string().describe('Reason for the decision'),
      decisionDate: z.string().optional().describe('Date of decision (ISO 8601 format, defaults to current)'),
      decisionBy: z.string().optional().describe('Person/system making the decision'),
      notes: z.string().optional().describe('Additional notes about the decision'),
      impact: z.string().optional().describe('Impact of the decision on the reserve'),
      followUpRequired: z.boolean().optional().describe('Whether follow-up action is required'),
      followUpDate: z.string().optional().describe('Date for follow-up action (ISO 8601 format)'),
      attachments: z.array(z.string()).optional().describe('List of attachment references')
    },
    async ({ bearerToken, tenantId, claim, reserve, ...params }: any) => {
      try {
        const client = createClaimManagementClient(bearerToken, tenantId);
        const result = await client.post(`/api/v1/claim-management/claims/${claim}/reserves/${reserve}/decisions`, params);
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              success: true,
              data: result,
              message: 'Reserve decision created successfully'
            }, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text', 
            text: JSON.stringify({
              success: false,
              error: error.message || 'Failed to create reserve decision',
              details: error.response?.data || error
            }, null, 2)
          }]
        };
      }
    }
  );
}
