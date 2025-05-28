import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { createClaimManagementClient } from '../../client';

export function registerApproveDecisionToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_claims_decisions_approve',
    'Approve an indemnity decision (workflow approval)',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      claim: z.string().describe('Claim identifier (claim number or UUID)'),
      decision: z.string().describe('Decision identifier to approve'),
      approvalNotes: z.string().optional().describe('Notes from the approver'),
      approverComments: z.string().optional().describe('Additional comments about the approval'),
      effectiveDate: z.string().optional().describe('Effective date of approval (ISO 8601 format)'),
      conditions: z.array(z.string()).optional().describe('Any conditions attached to the approval'),
      authorityLevel: z.string().optional().describe('Authority level of the approver')
    },
    async ({ bearerToken, tenantId, claim, decision, ...params }: any) => {
      try {
        const client = createClaimManagementClient(bearerToken, tenantId);
        const result = await client.post(`/api/v1/claim-management/claims/${claim}/decisions/${decision}/approve`, params);
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              success: true,
              data: result,
              message: 'Indemnity decision approved successfully'
            }, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text', 
            text: JSON.stringify({
              success: false,
              error: error.message || 'Failed to approve decision',
              details: error.response?.data || error
            }, null, 2)
          }]
        };
      }
    }
  );
}
