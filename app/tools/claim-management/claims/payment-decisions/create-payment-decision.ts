import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { createClaimManagementClient } from '../../client';

export function registerCreatePaymentDecisionToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_claims_payment_decisions_create',
    'Create a new payment decision for a claim',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      claim: z.string().describe('Claim identifier (claim number or UUID)'),
      paymentType: z.string().describe('Type of payment (e.g., "settlement", "partial", "advance", "expense_reimbursement")'),
      amount: z.number().positive().describe('Payment amount (positive number)'),
      currency: z.string().describe('Currency code (e.g., EUR, USD)'),
      paymentReason: z.string().describe('Reason for the payment decision'),
      paymentDescription: z.string().optional().describe('Detailed description of the payment'),
      dueDate: z.string().optional().describe('Payment due date (ISO 8601 format)'),
      paymentMethod: z.string().optional().describe('Preferred payment method'),
      recipientDetails: z.object({
        name: z.string().optional(),
        address: z.string().optional(),
        bankDetails: z.string().optional(),
        taxId: z.string().optional()
      }).optional().describe('Payment recipient details'),
      taxDetails: z.object({
        taxAmount: z.number().optional(),
        taxRate: z.number().optional(),
        taxType: z.string().optional()
      }).optional().describe('Tax calculation details'),
      approvalRequired: z.boolean().optional().describe('Whether approval workflow is required'),
      attachments: z.array(z.string()).optional().describe('Supporting document references'),
      notes: z.string().optional().describe('Additional notes about the payment decision')
    },
    async ({ bearerToken, tenantId, claim, ...params }: any) => {
      try {
        const client = createClaimManagementClient(bearerToken, tenantId);
        const result = await client.post(`/api/v1/claim-management/claims/${claim}/payment-decisions`, params);
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              success: true,
              data: result,
              message: 'Payment decision created successfully'
            }, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text', 
            text: JSON.stringify({
              success: false,
              error: error.message || 'Failed to create payment decision',
              details: error.response?.data || error
            }, null, 2)
          }]
        };
      }
    }
  );
}
