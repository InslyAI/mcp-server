import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { createClaimManagementClient } from '../client';

export function registerUpdatePersonToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_persons_update',
    'Update information for a person in a claim',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      claim: z.string().describe('Claim identifier (claim number or UUID)'),
      person: z.string().describe('Person identifier to update'),
      personalInfo: z.object({
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        fullName: z.string().optional(),
        dateOfBirth: z.string().optional(),
        gender: z.string().optional(),
        nationality: z.string().optional(),
        nationalId: z.string().optional(),
        occupation: z.string().optional()
      }).optional().describe('Updated personal information'),
      contactInfo: z.object({
        primaryPhone: z.string().optional(),
        secondaryPhone: z.string().optional(),
        email: z.string().optional(),
        preferredContact: z.enum(['phone', 'email', 'mail']).optional()
      }).optional().describe('Updated contact information'),
      address: z.object({
        street: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        postalCode: z.string().optional(),
        country: z.string().optional(),
        addressType: z.enum(['home', 'work', 'temporary']).optional()
      }).optional().describe('Updated address information'),
      drivingInfo: z.object({
        licenseNumber: z.string().optional(),
        licenseClass: z.string().optional(),
        licenseExpiry: z.string().optional(),
        licenseCountry: z.string().optional(),
        drivingExperience: z.number().optional()
      }).optional().describe('Updated driving information'),
      injuryInfo: z.object({
        injured: z.boolean().optional(),
        injuryDescription: z.string().optional(),
        medicalTreatment: z.boolean().optional(),
        hospitalName: z.string().optional(),
        treatmentCost: z.number().optional()
      }).optional().describe('Updated injury information'),
      liability: z.object({
        atFault: z.boolean().optional(),
        faultPercentage: z.number().optional(),
        liabilityNotes: z.string().optional()
      }).optional().describe('Updated liability information'),
      insurance: z.object({
        hasInsurance: z.boolean().optional(),
        insuranceCompany: z.string().optional(),
        policyNumber: z.string().optional(),
        coverage: z.string().optional()
      }).optional().describe('Updated insurance information'),
      relationToClaim: z.string().optional().describe('Updated relationship to claim'),
      role: z.string().optional().describe('Updated role in the claim'),
      attachments: z.array(z.string()).optional().describe('Updated document references'),
      notes: z.string().optional().describe('Updated notes'),
      updateReason: z.string().optional().describe('Reason for the update'),
      customFields: z.record(z.any()).optional().describe('Updated custom fields')
    },
    async ({ bearerToken, tenantId, claim, person, ...updateData }: any) => {
      try {
        const client = createClaimManagementClient(bearerToken, tenantId);
        const result = await client.put(`/api/v1/claim-management/claims/${claim}/persons/${person}`, updateData);
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              success: true,
              data: result,
              message: 'Person information updated successfully'
            }, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text', 
            text: JSON.stringify({
              success: false,
              error: error.message || 'Failed to update person information',
              details: error.response?.data || error
            }, null, 2)
          }]
        };
      }
    }
  );
}
