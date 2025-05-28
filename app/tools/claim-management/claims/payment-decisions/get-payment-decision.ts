import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { createClaimManagementClient } from '../../client';

export function registerGetPaymentDecisionToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_claims_payment_decisions_get',
    'Get detailed information about a specific payment decision',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      claim: z.string().describe('Claim identifier (claim number or UUID)'),
      paymentDecision: z.string().describe('Payment decision identifier to retrieve'),
      includeApprovalHistory: z.boolean().optional().describe('Whether to include approval workflow history'),
      includePaymentDetails: z.boolean().optional().describe('Whether to include detailed payment information'),
      includeAttachments: z.boolean().optional().describe('Whether to include attachment metadata')
    },
    async ({ bearerToken, tenantId, claim, paymentDecision, includeApprovalHistory, includePaymentDetails, includeAttachments }) => {
      try {
        const client = createClaimManagementClient(bearerToken, tenantId);
        
        // Build query parameters
        const params = new URLSearchParams();
        if (includeApprovalHistory !== undefined) params.append('include_approval_history', includeApprovalHistory.toString());
        if (includePaymentDetails !== undefined) params.append('include_payment_details', includePaymentDetails.toString());
        if (includeAttachments !== undefined) params.append('include_attachments', includeAttachments.toString());
        
        const queryString = params.toString() ? `?${params.toString()}` : '';
        const result = await client.get(`/api/v1/claim-management/claims/${claim}/payment-decisions/${paymentDecision}${queryString}`);
        
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
            text: `Error retrieving payment decision: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }
  );
}
