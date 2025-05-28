import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

const PartnerUpdateSchema = z.object({
  partnerName: z.string().optional().describe('Updated name of the partner organization'),
  partnerType: z.string().optional().describe('Updated partner type (adjuster, lawyer, repair-shop, medical-provider, investigator, expert)'),
  businessRegistrationNumber: z.string().optional().describe('Updated business registration/license number'),
  taxId: z.string().optional().describe('Updated tax identification number'),
  website: z.string().optional().describe('Updated partner website URL'),
  description: z.string().optional().describe('Updated description of services provided'),
  
  // Contact Information
  primaryContactName: z.string().optional().describe('Updated primary contact person name'),
  primaryContactTitle: z.string().optional().describe('Updated primary contact job title'),
  primaryContactEmail: z.string().optional().describe('Updated primary contact email address'),
  primaryContactPhone: z.string().optional().describe('Updated primary contact phone number'),
  
  // Address Information
  streetAddress: z.string().optional().describe('Updated street address'),
  city: z.string().optional().describe('Updated city'),
  state: z.string().optional().describe('Updated state/province'),
  postalCode: z.string().optional().describe('Updated postal/ZIP code'),
  country: z.string().optional().describe('Updated country'),
  
  // Service Areas
  serviceAreas: z.array(z.string()).optional().describe('Updated geographic areas where partner provides services'),
  specializations: z.array(z.string()).optional().describe('Updated areas of specialization or expertise'),
  
  // Business Terms
  hourlyRate: z.number().optional().describe('Updated standard hourly rate for services'),
  currency: z.string().optional().describe('Updated currency for rates and payments (EUR, USD, GBP, etc.)'),
  paymentTerms: z.string().optional().describe('Updated payment terms (net-30, net-60, immediate, etc.)'),
  preferredPaymentMethod: z.string().optional().describe('Updated preferred payment method'),
  
  // Credentials and Certifications
  licenses: z.array(z.object({
    licenseNumber: z.string(),
    issuingAuthority: z.string(),
    expirationDate: z.string().optional(),
    licenseType: z.string().optional()
  })).optional().describe('Updated professional licenses'),
  certifications: z.array(z.string()).optional().describe('Updated professional certifications'),
  
  // Performance Metrics
  averageResponseTime: z.number().optional().describe('Updated average response time in hours'),
  qualityRating: z.number().optional().describe('Updated quality rating (1-5 scale)'),
  
  // Status and Availability
  isActive: z.boolean().optional().describe('Updated active status of the partner'),
  maxConcurrentCases: z.number().optional().describe('Updated maximum number of concurrent cases'),
  availability: z.string().optional().describe('Updated general availability (full-time, part-time, emergency-only, etc.)'),
  
  notes: z.string().optional().describe('Updated internal notes about the partner')
});

export function registerUpdatePartnerToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_partners_update',
    'Update an existing business partner (adjuster, lawyer, repair shop, medical provider, etc.)',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      partnerId: z.string().describe('Unique identifier of the partner to update'),
      partnerData: PartnerUpdateSchema.describe('Updated partner information')
    },
    async ({ bearerToken, tenantId, partnerId, partnerData }) => {
      try {
        const response = await fetch(`/api/v1/claim-management/partners/${partnerId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${bearerToken}`,
            'Content-Type': 'application/json',
            'X-Tenant-ID': tenantId
          },
          body: JSON.stringify(partnerData)
        });

        if (!response.ok) {
          const errorData = await response.text();
          return {
            content: [{
              type: 'text' as const,
              text: `Error updating partner: ${response.status} ${response.statusText} - ${errorData}`
            }]
          };
        }

        const result = await response.json();
        return {
          content: [{
            type: 'text' as const,
            text: JSON.stringify({
              success: true,
              data: result,
              message: `Partner ${partnerId} updated successfully`
            }, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text' as const,
            text: `Error updating partner: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }
  );
}
