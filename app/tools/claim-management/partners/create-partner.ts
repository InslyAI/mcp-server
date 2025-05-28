import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { createClaimManagementClient } from '../client';

export function registerCreatePartnerToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_partners_create',
    'Create a new business partner (adjuster, lawyer, repair shop, medical provider, etc.)',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      partnerType: z.string().describe('Type of partner (e.g., "adjuster", "lawyer", "repair_shop", "medical_provider", "expert", "vendor")'),
      companyInfo: z.object({
        companyName: z.string().describe('Company/business name'),
        legalName: z.string().optional().describe('Legal business name if different'),
        registrationNumber: z.string().optional().describe('Business registration number'),
        taxId: z.string().optional().describe('Tax identification number'),
        industry: z.string().optional().describe('Industry classification')
      }).describe('Company information'),
      contactInfo: z.object({
        primaryContact: z.string().describe('Primary contact person name'),
        email: z.string().describe('Primary email address'),
        phone: z.string().describe('Primary phone number'),
        alternativePhone: z.string().optional().describe('Alternative phone number'),
        website: z.string().optional().describe('Company website'),
        preferredContactMethod: z.enum(['email', 'phone', 'portal']).optional().describe('Preferred contact method')
      }).describe('Contact information'),
      address: z.object({
        street: z.string().describe('Street address'),
        city: z.string().describe('City'),
        state: z.string().optional().describe('State/province'),
        postalCode: z.string().describe('Postal/ZIP code'),
        country: z.string().describe('Country'),
        serviceAreas: z.array(z.string()).optional().describe('Geographic service areas')
      }).describe('Business address and service areas'),
      specializations: z.array(z.string()).describe('Areas of specialization or expertise'),
      credentials: z.object({
        licenses: z.array(z.object({
          licenseType: z.string(),
          licenseNumber: z.string(),
          issuingAuthority: z.string().optional(),
          expiryDate: z.string().optional().describe('ISO 8601 date')
        })).optional().describe('Professional licenses'),
        certifications: z.array(z.string()).optional().describe('Professional certifications'),
        insurance: z.object({
          hasLiabilityInsurance: z.boolean().optional(),
          coverageAmount: z.number().optional(),
          insuranceProvider: z.string().optional(),
          expiryDate: z.string().optional()
        }).optional().describe('Insurance coverage information')
      }).optional().describe('Professional credentials and insurance'),
      businessTerms: z.object({
        hourlyRate: z.number().optional().describe('Standard hourly rate'),
        standardFees: z.record(z.number()).optional().describe('Standard fees for common services'),
        paymentTerms: z.string().optional().describe('Payment terms and conditions'),
        contractType: z.string().optional().describe('Type of contract arrangement')
      }).optional().describe('Business terms and pricing'),
      qualityMetrics: z.object({
        rating: z.number().min(1).max(5).optional().describe('Quality rating (1-5)'),
        responseTime: z.string().optional().describe('Average response time'),
        completionTime: z.string().optional().describe('Average job completion time')
      }).optional().describe('Quality and performance metrics'),
      status: z.enum(['active', 'inactive', 'pending_approval', 'suspended']).optional().describe('Partner status'),
      notes: z.string().optional().describe('Additional notes about the partner'),
      tags: z.array(z.string()).optional().describe('Tags for categorization'),
      metadata: z.record(z.any()).optional().describe('Additional metadata')
    },
    async ({ bearerToken, tenantId, ...partnerData }: any) => {
      try {
        const client = createClaimManagementClient(bearerToken, tenantId);
        const result = await client.post('/api/v1/claim-management/partners', partnerData);
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              success: true,
              data: result,
              message: 'Partner created successfully'
            }, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text', 
            text: JSON.stringify({
              success: false,
              error: error.message || 'Failed to create partner',
              details: error.response?.data || error
            }, null, 2)
          }]
        };
      }
    }
  );
}
