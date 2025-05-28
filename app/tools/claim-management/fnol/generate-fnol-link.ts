import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { createClaimManagementClient } from '../client';

export function registerGenerateFnolLinkToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_fnol_generate_link',
    'Generate FNOL (First Notice of Loss) link for UI form submission',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      product: z.string().describe('Insurance product type (e.g., "mtpl", "casco", "property")'),
      payload: z.object({
        claimantName: z.string().optional().describe('Name of the claimant'),
        claimantEmail: z.string().optional().describe('Email of the claimant'),
        claimantPhone: z.string().optional().describe('Phone number of the claimant'),
        incidentDate: z.string().optional().describe('Date of incident (ISO 8601 format)'),
        incidentLocation: z.string().optional().describe('Location where incident occurred'),
        incidentDescription: z.string().optional().describe('Description of the incident'),
        policyNumber: z.string().optional().describe('Related policy number'),
        estimatedAmount: z.number().optional().describe('Estimated claim amount'),
        vehicleRegistration: z.string().optional().describe('Vehicle registration number (for motor claims)'),
        thirdPartyInvolved: z.boolean().optional().describe('Whether third party is involved'),
        emergencyServices: z.boolean().optional().describe('Whether emergency services were called'),
        additionalData: z.record(z.any()).optional().describe('Additional product-specific data')
      }).describe('FNOL payload data for pre-populating the form')
    },
    async ({ bearerToken, tenantId, product, payload }) => {
      try {
        const client = createClaimManagementClient(bearerToken, tenantId);
        const result = await client.post('/api/v1/claim-management/fnol-link', {
          product,
          payload
        });
        
        return {
          content: [{
            type: 'text' as const,
            text: JSON.stringify({
              success: true,
              data: result,
              message: 'FNOL link generated successfully'
            }, null, 2)
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: 'text' as const,
            text: `Error generating FNOL link: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }
  );
}
