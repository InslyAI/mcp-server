import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { createClaimManagementClient } from '../client';

export function registerUpdateObjectToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_objects_update',
    'Update an existing object in a claim',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      claim: z.string().describe('Claim identifier (claim number or UUID)'),
      object: z.string().describe('Object identifier to update'),
      objectName: z.string().optional().describe('Updated object name/description'),
      objectIdentifier: z.string().optional().describe('Updated unique identifier'),
      vehicleData: z.object({
        make: z.string().optional(),
        model: z.string().optional(),
        year: z.number().optional(),
        vin: z.string().optional(),
        registration: z.string().optional(),
        color: z.string().optional(),
        engineNumber: z.string().optional(),
        mileage: z.number().optional()
      }).optional().describe('Updated vehicle information'),
      propertyData: z.object({
        address: z.string().optional(),
        propertyType: z.string().optional(),
        constructionType: z.string().optional(),
        buildYear: z.number().optional(),
        size: z.number().optional(),
        rooms: z.number().optional(),
        value: z.number().optional()
      }).optional().describe('Updated property information'),
      itemData: z.object({
        brand: z.string().optional(),
        model: z.string().optional(),
        serialNumber: z.string().optional(),
        purchaseDate: z.string().optional(),
        purchasePrice: z.number().optional(),
        currentValue: z.number().optional(),
        condition: z.string().optional()
      }).optional().describe('Updated item information'),
      damageDescription: z.string().optional().describe('Updated damage description'),
      estimatedRepairCost: z.number().optional().describe('Updated repair cost estimate'),
      totalLoss: z.boolean().optional().describe('Updated total loss status'),
      salvageValue: z.number().optional().describe('Updated salvage value'),
      location: z.string().optional().describe('Updated object location'),
      status: z.string().optional().describe('Updated object status'),
      ownerName: z.string().optional().describe('Updated owner name'),
      ownerRelation: z.string().optional().describe('Updated owner relationship'),
      insuranceDetails: z.object({
        insured: z.boolean().optional(),
        insuranceCompany: z.string().optional(),
        policyNumber: z.string().optional(),
        coverage: z.string().optional()
      }).optional().describe('Updated insurance details'),
      attachments: z.array(z.string()).optional().describe('Updated document references'),
      updateReason: z.string().optional().describe('Reason for the update'),
      customFields: z.record(z.any()).optional().describe('Updated custom fields')
    },
    async ({ bearerToken, tenantId, claim, object, ...updateData }: any) => {
      try {
        const client = createClaimManagementClient(bearerToken, tenantId);
        const result = await client.put(`/api/v1/claim-management/claims/${claim}/objects/${object}`, updateData);
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              success: true,
              data: result,
              message: 'Claim object updated successfully'
            }, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text', 
            text: JSON.stringify({
              success: false,
              error: error.message || 'Failed to update claim object',
              details: error.response?.data || error
            }, null, 2)
          }]
        };
      }
    }
  );
}
