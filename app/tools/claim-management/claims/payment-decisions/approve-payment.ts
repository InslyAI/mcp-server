import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { createClaimManagementClient } from '../../client';

export function registerApprovePaymentToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_claims_payment_decisions_approve',
    'Approve a payment decision (workflow approval for payment processing)',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      claim: z.string().describe('Claim identifier (claim number or UUID)'),
      paymentDecision: z.string().describe('Payment decision identifier to approve'),
      approvalNotes: z.string().optional().describe('Notes from the approver'),
      approverComments: z.string().optional().describe('Additional comments about the approval'),
      approvedAmount: z.number().positive().optional().describe('Approved amount (if different from requested)'),
      approvedCurrency: z.string().optional().describe('Approved currency (if different)'),
      approvedDueDate: z.string().optional().describe('Approved due date (ISO 8601 format)'),
      paymentInstructions: z.string().optional().describe('Special payment instructions'),
      conditions: z.array(z.string()).optional().describe('Any conditions attached to the approval'),
      authorityLevel: z.string().optional().describe('Authority level of the approver'),
      processImmediately: z.boolean().optional().describe('Whether to process payment immediately after approval')
    },
    async ({ bearerToken, tenantId, claim, paymentDecision, ...params }: any) => {
      try {
        const client = createClaimManagementClient(bearerToken, tenantId);
        const result = await client.post(`/api/v1/claim-management/claims/${claim}/payment-decisions/${paymentDecision}/approve`, params);
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              success: true,
              data: result,
              message: 'Payment decision approved successfully'
            }, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text', 
            text: JSON.stringify({
              success: false,
              error: error.message || 'Failed to approve payment decision',
              details: error.response?.data || error
            }, null, 2)
          }]
        };
      }
    }
  );
}
