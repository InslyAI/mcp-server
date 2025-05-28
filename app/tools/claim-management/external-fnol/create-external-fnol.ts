import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { createClaimManagementClient } from '../client';

export function registerCreateExternalFnolToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_external_fnol_create',
    'Create external FNOL (First Notice of Loss) from external systems/partners',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      externalId: z.string().optional().describe('External system identifier'),
      partnerCode: z.string().optional().describe('Partner/external system code'),
      productType: z.string().describe('Insurance product type'),
      policyNumber: z.string().optional().describe('Related policy number'),
      claimantData: z.object({
        name: z.string().describe('Claimant name'),
        email: z.string().optional().describe('Claimant email'),
        phone: z.string().optional().describe('Claimant phone'),
        address: z.string().optional().describe('Claimant address'),
        nationalId: z.string().optional().describe('National ID/passport')
      }).describe('Claimant information'),
      incidentData: z.object({
        date: z.string().describe('Incident date (ISO 8601 format)'),
        location: z.string().describe('Incident location'),
        description: z.string().describe('Incident description'),
        circumstances: z.string().optional().describe('Detailed circumstances'),
        estimatedAmount: z.number().optional().describe('Estimated damage amount')
      }).describe('Incident information'),
      vehicleData: z.object({
        registration: z.string().optional(),
        make: z.string().optional(),
        model: z.string().optional(),
        year: z.number().optional(),
        vin: z.string().optional(),
        driverName: z.string().optional(),
        driverLicense: z.string().optional()
      }).optional().describe('Vehicle information (for motor claims)'),
      propertyData: z.object({
        address: z.string().optional(),
        propertyType: z.string().optional(),
        damageType: z.string().optional(),
        affectedArea: z.string().optional()
      }).optional().describe('Property information (for property claims)'),
      thirdPartyData: z.object({
        involved: z.boolean().describe('Whether third party is involved'),
        name: z.string().optional(),
        contactInfo: z.string().optional(),
        insuranceCompany: z.string().optional(),
        vehicleRegistration: z.string().optional()
      }).optional().describe('Third party information'),
      emergencyServices: z.boolean().optional().describe('Whether emergency services were called'),
      policeReport: z.boolean().optional().describe('Whether police report was filed'),
      witnesses: z.array(z.object({
        name: z.string(),
        contact: z.string().optional()
      })).optional().describe('Witness information'),
      externalMetadata: z.record(z.any()).optional().describe('Additional metadata from external system')
    },
    async ({ bearerToken, tenantId, ...fnolData }: any) => {
      try {
        const client = createClaimManagementClient(bearerToken, tenantId);
        const result = await client.post('/api/v1/claim-management/fnol-external', fnolData);
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              success: true,
              data: result,
              message: 'External FNOL created successfully'
            }, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text', 
            text: JSON.stringify({
              success: false,
              error: error.message || 'Failed to create external FNOL',
              details: error.response?.data || error
            }, null, 2)
          }]
        };
      }
    }
  );
}
