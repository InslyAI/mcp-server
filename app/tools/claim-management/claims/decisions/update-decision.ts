import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { createClaimManagementClient } from '../../client';

export function registerUpdateDecisionToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_claims_decisions_update',
    'Update an existing indemnity decision for a claim',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      claim: z.string().describe('Claim identifier (claim number or UUID)'),
      decision: z.string().describe('Decision identifier to update'),
      decisionType: z.string().optional().describe('Updated type of decision'),
      decisionText: z.string().optional().describe('Updated decision text'),
      decisionReason: z.string().optional().describe('Updated reason for the decision'),
      amount: z.number().optional().describe('Updated financial amount'),
      currency: z.string().optional().describe('Updated currency code'),
      effectiveDate: z.string().optional().describe('Updated effective date (ISO 8601 format)'),
      status: z.string().optional().describe('Updated decision status'),
      reviewerNotes: z.string().optional().describe('Updated reviewer notes'),
      updateReason: z.string().optional().describe('Reason for this update'),
      attachments: z.array(z.string()).optional().describe('Updated list of attachment references')
    },
    async ({ bearerToken, tenantId, claim, decision, ...params }: any) => {
      try {
        const client = createClaimManagementClient(bearerToken, tenantId);
        const result = await client.put(`/api/v1/claim-management/claims/${claim}/decisions/${decision}`, params);
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              success: true,
              data: result,
              message: 'Indemnity decision updated successfully'
            }, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text', 
            text: JSON.stringify({
              success: false,
              error: error.message || 'Failed to update decision',
              details: error.response?.data || error
            }, null, 2)
          }]
        };
      }
    }
  );
}
