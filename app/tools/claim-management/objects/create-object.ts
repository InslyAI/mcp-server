import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { createClaimManagementClient } from '../client';

export function registerCreateObjectToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_objects_create',
    'Create/add a new object to a claim (vehicle, property, item, etc.)',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      claim: z.string().describe('Claim identifier (claim number or UUID)'),
      objectType: z.string().describe('Type of object (e.g., "vehicle", "property", "personal_item", "equipment")'),
      objectName: z.string().describe('Name/description of the object'),
      objectIdentifier: z.string().optional().describe('Unique identifier (VIN, serial number, address, etc.)'),
      vehicleData: z.object({
        make: z.string().optional(),
        model: z.string().optional(),
        year: z.number().optional(),
        vin: z.string().optional(),
        registration: z.string().optional(),
        color: z.string().optional(),
        engineNumber: z.string().optional(),
        mileage: z.number().optional()
      }).optional().describe('Vehicle-specific information'),
      propertyData: z.object({
        address: z.string().optional(),
        propertyType: z.string().optional(),
        constructionType: z.string().optional(),
        buildYear: z.number().optional(),
        size: z.number().optional(),
        rooms: z.number().optional(),
        value: z.number().optional()
      }).optional().describe('Property-specific information'),
      itemData: z.object({
        brand: z.string().optional(),
        model: z.string().optional(),
        serialNumber: z.string().optional(),
        purchaseDate: z.string().optional(),
        purchasePrice: z.number().optional(),
        currentValue: z.number().optional(),
        condition: z.string().optional()
      }).optional().describe('Personal item/equipment information'),
      damageDescription: z.string().optional().describe('Description of damage to the object'),
      estimatedRepairCost: z.number().optional().describe('Estimated cost to repair the object'),
      totalLoss: z.boolean().optional().describe('Whether object is considered total loss'),
      salvageValue: z.number().optional().describe('Estimated salvage value if total loss'),
      location: z.string().optional().describe('Current location of the object'),
      ownerName: z.string().optional().describe('Name of the object owner'),
      ownerRelation: z.string().optional().describe('Relationship to claimant (owner, family, third_party)'),
      insuranceDetails: z.object({
        insured: z.boolean().optional(),
        insuranceCompany: z.string().optional(),
        policyNumber: z.string().optional(),
        coverage: z.string().optional()
      }).optional().describe('Insurance coverage details for the object'),
      attachments: z.array(z.string()).optional().describe('Document references (photos, receipts, etc.)'),
      customFields: z.record(z.any()).optional().describe('Additional custom fields')
    },
    async ({ bearerToken, tenantId, claim, ...objectData }: any) => {
      try {
        const client = createClaimManagementClient(bearerToken, tenantId);
        const result = await client.post(`/api/v1/claim-management/claims/${claim}/objects`, objectData);
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              success: true,
              data: result,
              message: 'Claim object created successfully'
            }, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text', 
            text: JSON.stringify({
              success: false,
              error: error.message || 'Failed to create claim object',
              details: error.response?.data || error
            }, null, 2)
          }]
        };
      }
    }
  );
}
