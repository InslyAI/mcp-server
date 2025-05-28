import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { createClaimManagementClient } from '../../client';

export function registerRejectDecisionToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_claims_decisions_reject',
    'Reject an indemnity decision (workflow rejection)',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      claim: z.string().describe('Claim identifier (claim number or UUID)'),
      decision: z.string().describe('Decision identifier to reject'),
      rejectionReason: z.string().describe('Reason for rejecting the decision'),
      rejectionNotes: z.string().optional().describe('Detailed notes about the rejection'),
      requestedChanges: z.array(z.string()).optional().describe('Specific changes requested for resubmission'),
      returnToUser: z.string().optional().describe('User/role to return the decision to'),
      escalationRequired: z.boolean().optional().describe('Whether escalation is required'),
      escalationLevel: z.string().optional().describe('Level to escalate to if required')
    },
    async ({ bearerToken, tenantId, claim, decision, ...params }: any) => {
      try {
        const client = createClaimManagementClient(bearerToken, tenantId);
        const result = await client.post(`/api/v1/claim-management/claims/${claim}/decisions/${decision}/reject`, params);
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              success: true,
              data: result,
              message: 'Indemnity decision rejected successfully'
            }, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text', 
            text: JSON.stringify({
              success: false,
              error: error.message || 'Failed to reject decision',
              details: error.response?.data || error
            }, null, 2)
          }]
        };
      }
    }
  );
}
