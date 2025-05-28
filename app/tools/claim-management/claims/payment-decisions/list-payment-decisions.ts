import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { createClaimManagementClient } from '../../client';

export function registerListPaymentDecisionsToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_claims_payment_decisions_list',
    'Get list of payment decisions for a claim with filtering and pagination options.',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      claim: z.string().describe('Claim identifier (claim number or UUID)'),
      status: z.string().optional().describe('Filter by payment decision status (e.g., "pending", "approved", "paid", "rejected")'),
      paymentType: z.string().optional().describe('Filter by payment type (e.g., "settlement", "partial", "advance", "expense")'),
      fromDate: z.string().optional().describe('Filter decisions from date (ISO 8601 format)'),
      toDate: z.string().optional().describe('Filter decisions to date (ISO 8601 format)'),
      minAmount: z.number().optional().describe('Filter by minimum payment amount'),
      maxAmount: z.number().optional().describe('Filter by maximum payment amount'),
      currency: z.string().optional().describe('Filter by currency (e.g., EUR, USD)'),
      page: z.number().optional().describe('Page number for pagination (default: 1)'),
      limit: z.number().optional().describe('Number of decisions per page (default: 25)'),
      sortBy: z.string().optional().describe('Field to sort by (e.g., "amount", "decision_date", "due_date")'),
      sortOrder: z.enum(['asc', 'desc']).optional().describe('Sort order (default: desc)')
    },
    async ({ bearerToken, tenantId, claim, status, paymentType, fromDate, toDate, minAmount, maxAmount, currency, page, limit, sortBy, sortOrder }) => {
      try {
        const client = createClaimManagementClient(bearerToken, tenantId);
        
        // Build query parameters
        const params = new URLSearchParams();
        if (status) params.append('status', status);
        if (paymentType) params.append('payment_type', paymentType);
        if (fromDate) params.append('from_date', fromDate);
        if (toDate) params.append('to_date', toDate);
        if (minAmount !== undefined) params.append('min_amount', minAmount.toString());
        if (maxAmount !== undefined) params.append('max_amount', maxAmount.toString());
        if (currency) params.append('currency', currency);
        if (page) params.append('page', page.toString());
        if (limit) params.append('limit', limit.toString());
        if (sortBy) params.append('sort_by', sortBy);
        if (sortOrder) params.append('sort_order', sortOrder);
        
        const queryString = params.toString() ? `?${params.toString()}` : '';
        const result = await client.get(`/api/v1/claim-management/claims/${claim}/payment-decisions${queryString}`);
        
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
            text: `Error listing payment decisions: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }
  );
}
