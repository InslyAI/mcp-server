import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { createClaimManagementClient } from '../client';

export function registerCreatePersonToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_persons_create',
    'Add a new person to a claim (claimant, driver, witness, third party, etc.)',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      claim: z.string().describe('Claim identifier (claim number or UUID)'),
      personType: z.string().describe('Type of person (e.g., "claimant", "driver", "witness", "third_party", "injured_party")'),
      role: z.string().describe('Role in the claim (e.g., "primary_claimant", "at_fault_driver", "eyewitness")'),
      personalInfo: z.object({
        firstName: z.string().describe('First name'),
        lastName: z.string().describe('Last name'),
        fullName: z.string().optional().describe('Full name (if different from first + last)'),
        dateOfBirth: z.string().optional().describe('Date of birth (ISO 8601)'),
        gender: z.string().optional().describe('Gender'),
        nationality: z.string().optional().describe('Nationality'),
        nationalId: z.string().optional().describe('National ID or passport number'),
        occupation: z.string().optional().describe('Occupation')
      }).describe('Personal information'),
      contactInfo: z.object({
        primaryPhone: z.string().optional().describe('Primary phone number'),
        secondaryPhone: z.string().optional().describe('Secondary phone number'),
        email: z.string().optional().describe('Email address'),
        preferredContact: z.enum(['phone', 'email', 'mail']).optional().describe('Preferred contact method')
      }).optional().describe('Contact information'),
      address: z.object({
        street: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        postalCode: z.string().optional(),
        country: z.string().optional(),
        addressType: z.enum(['home', 'work', 'temporary']).optional()
      }).optional().describe('Address information'),
      drivingInfo: z.object({
        licenseNumber: z.string().optional(),
        licenseClass: z.string().optional(),
        licenseExpiry: z.string().optional(),
        licenseCountry: z.string().optional(),
        drivingExperience: z.number().optional().describe('Years of driving experience')
      }).optional().describe('Driving license information (for drivers)'),
      injuryInfo: z.object({
        injured: z.boolean().optional().describe('Whether person was injured'),
        injuryDescription: z.string().optional().describe('Description of injuries'),
        medicalTreatment: z.boolean().optional().describe('Whether medical treatment was received'),
        hospitalName: z.string().optional().describe('Hospital or clinic name'),
        treatmentCost: z.number().optional().describe('Medical treatment cost')
      }).optional().describe('Injury information (if applicable)'),
      relationToClaim: z.string().optional().describe('Relationship to the claim or claimant'),
      liability: z.object({
        atFault: z.boolean().optional().describe('Whether person is at fault'),
        faultPercentage: z.number().optional().describe('Percentage of fault (0-100)'),
        liabilityNotes: z.string().optional().describe('Notes about liability assessment')
      }).optional().describe('Liability information'),
      insurance: z.object({
        hasInsurance: z.boolean().optional().describe('Whether person has insurance'),
        insuranceCompany: z.string().optional().describe('Insurance company name'),
        policyNumber: z.string().optional().describe('Insurance policy number'),
        coverage: z.string().optional().describe('Coverage details')
      }).optional().describe('Insurance information'),
      attachments: z.array(z.string()).optional().describe('Document references (ID copies, statements, etc.)'),
      notes: z.string().optional().describe('Additional notes about the person'),
      customFields: z.record(z.any()).optional().describe('Additional custom fields')
    },
    async ({ bearerToken, tenantId, claim, ...personData }: any) => {
      try {
        const client = createClaimManagementClient(bearerToken, tenantId);
        const result = await client.post(`/api/v1/claim-management/claims/${claim}/persons`, personData);
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              success: true,
              data: result,
              message: 'Person added to claim successfully'
            }, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text', 
            text: JSON.stringify({
              success: false,
              error: error.message || 'Failed to add person to claim',
              details: error.response?.data || error
            }, null, 2)
          }]
        };
      }
    }
  );
}
