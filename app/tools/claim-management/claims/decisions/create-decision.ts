import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { createClaimManagementClient } from '../../client';

export function registerCreateDecisionToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_claims_decisions_create',
    'Create a new indemnity decision for a claim',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      claim: z.string().describe('Claim identifier (claim number or UUID)'),
      decisionType: z.string().describe('Type of decision (e.g., "coverage", "liability", "settlement", "denial")'),
      decision: z.string().describe('The actual decision made'),
      decisionReason: z.string().describe('Detailed reason for the decision'),
      amount: z.number().optional().describe('Financial amount associated with the decision'),
      currency: z.string().optional().describe('Currency code (e.g., EUR, USD)'),
      effectiveDate: z.string().optional().describe('Effective date of the decision (ISO 8601 format)'),
      decisionBy: z.string().optional().describe('Person/system making the decision'),
      reviewerNotes: z.string().optional().describe('Additional notes from the reviewer'),
      attachments: z.array(z.string()).optional().describe('List of supporting document references'),
      precedentCases: z.array(z.string()).optional().describe('References to similar cases or precedents'),
      legalReferences: z.array(z.string()).optional().describe('Legal references or policy clauses')
    },
    async ({ bearerToken, tenantId, claim, ...params }: any) => {
      try {
        const client = createClaimManagementClient(bearerToken, tenantId);
        const result = await client.post(`/api/v1/claim-management/claims/${claim}/decisions`, params);
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              success: true,
              data: result,
              message: 'Indemnity decision created successfully'
            }, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text', 
            text: JSON.stringify({
              success: false,
              error: error.message || 'Failed to create decision',
              details: error.response?.data || error
            }, null, 2)
          }]
        };
      }
    }
  );
}
