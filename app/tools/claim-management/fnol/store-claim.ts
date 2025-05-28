import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { createClaimManagementClient } from '../client';

export function registerStoreClaimToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_fnol_store_claim',
    'Store/create a new claim (typically used by FNOL process)',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      claimNumber: z.string().optional().describe('Claim number (auto-generated if not provided)'),
      productType: z.string().describe('Insurance product type'),
      policyNumber: z.string().optional().describe('Related policy number'),
      claimantName: z.string().describe('Name of the claimant'),
      claimantEmail: z.string().optional().describe('Email of the claimant'),
      claimantPhone: z.string().optional().describe('Phone number of the claimant'),
      incidentDate: z.string().describe('Date of incident (ISO 8601 format)'),
      incidentLocation: z.string().describe('Location where incident occurred'),
      incidentDescription: z.string().describe('Description of the incident'),
      estimatedAmount: z.number().optional().describe('Estimated claim amount'),
      priority: z.enum(['low', 'medium', 'high', 'urgent']).optional().describe('Claim priority level'),
      assignedTo: z.string().optional().describe('User ID of assigned adjuster'),
      status: z.string().optional().describe('Initial claim status'),
      vehicleData: z.object({
        registration: z.string().optional(),
        make: z.string().optional(),
        model: z.string().optional(),
        year: z.number().optional(),
        vin: z.string().optional()
      }).optional().describe('Vehicle information (for motor claims)'),
      thirdPartyData: z.object({
        involved: z.boolean().optional(),
        name: z.string().optional(),
        contactInfo: z.string().optional(),
        insuranceCompany: z.string().optional()
      }).optional().describe('Third party information'),
      emergencyServices: z.boolean().optional().describe('Whether emergency services were called'),
      attachments: z.array(z.string()).optional().describe('List of document/attachment references'),
      customFields: z.record(z.any()).optional().describe('Additional custom fields specific to the product')
    },
    async ({ bearerToken, tenantId, ...claimData }: any) => {
      try {
        const client = createClaimManagementClient(bearerToken, tenantId);
        const result = await client.post('/api/v1/claim-management/fnol', claimData);
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              success: true,
              data: result,
              message: 'Claim stored successfully'
            }, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text', 
            text: JSON.stringify({
              success: false,
              error: error.message || 'Failed to store claim',
              details: error.response?.data || error
            }, null, 2)
          }]
        };
      }
    }
  );
}
