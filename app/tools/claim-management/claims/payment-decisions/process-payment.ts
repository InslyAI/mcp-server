import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { createClaimManagementClient } from '../../client';

export function registerProcessPaymentToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_claims_payment_decisions_process',
    'Process an approved payment decision (initiate actual payment)',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      claim: z.string().describe('Claim identifier (claim number or UUID)'),
      paymentDecision: z.string().describe('Payment decision identifier to process'),
      paymentMethod: z.string().optional().describe('Payment method to use (e.g., "bank_transfer", "check", "digital_wallet")'),
      paymentReference: z.string().optional().describe('External payment reference or transaction ID'),
      processingDate: z.string().optional().describe('Date to process payment (ISO 8601 format, defaults to today)'),
      paymentInstructions: z.string().optional().describe('Special processing instructions'),
      verificationChecks: z.object({
        recipientVerified: z.boolean().optional(),
        amountVerified: z.boolean().optional(),
        authorityVerified: z.boolean().optional(),
        documentationComplete: z.boolean().optional()
      }).optional().describe('Pre-processing verification checks'),
      notificationSettings: z.object({
        notifyRecipient: z.boolean().optional(),
        notifyClaimant: z.boolean().optional(),
        notifyAdjuster: z.boolean().optional()
      }).optional().describe('Notification preferences for payment processing'),
      notes: z.string().optional().describe('Processing notes and comments')
    },
    async ({ bearerToken, tenantId, claim, paymentDecision, ...params }: any) => {
      try {
        const client = createClaimManagementClient(bearerToken, tenantId);
        const result = await client.post(`/api/v1/claim-management/claims/${claim}/payment-decisions/${paymentDecision}/process`, params);
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              success: true,
              data: result,
              message: 'Payment processing initiated successfully'
            }, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text', 
            text: JSON.stringify({
              success: false,
              error: error.message || 'Failed to process payment',
              details: error.response?.data || error
            }, null, 2)
          }]
        };
      }
    }
  );
}
