import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export function registerLookupDataToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_search_lookup_data',
    'Lookup and validate data from external sources (VIN, license plates, addresses, phone numbers, etc.)',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      
      lookupType: z.enum([
        'vin', 'license-plate', 'phone', 'address', 'postal-code', 'ssn', 'ein',
        'policy-number', 'claim-number', 'driver-license', 'medical-provider',
        'repair-shop', 'attorney', 'adjuster', 'expert-witness'
      ]).describe('Type of data to lookup'),
      
      value: z.string().describe('Value to lookup (VIN number, license plate, phone number, etc.)'),
      
      // Geographic Context
      state: z.string().optional().describe('State/province for location-specific lookups'),
      country: z.string().optional().describe('Country for international lookups (default: US)'),
      
      // Validation Options
      validateFormat: z.boolean().optional().describe('Validate format before lookup (default: true)'),
      includeHistory: z.boolean().optional().describe('Include historical data if available'),
      includeRelated: z.boolean().optional().describe('Include related/linked records'),
      
      // VIN-specific options
      includeRecalls: z.boolean().optional().describe('Include recall information for VIN lookups'),
      includeTheftHistory: z.boolean().optional().describe('Include theft history for VIN lookups'),
      includeAccidentHistory: z.boolean().optional().describe('Include accident history for VIN lookups'),
      
      // License Plate options
      includeRegistration: z.boolean().optional().describe('Include registration details for license plate lookups'),
      includeVehicleHistory: z.boolean().optional().describe('Include vehicle history for license plate lookups'),
      
      // Phone number options
      includeCarrierInfo: z.boolean().optional().describe('Include carrier information for phone lookups'),
      includeLineType: z.boolean().optional().describe('Include line type (mobile, landline, etc.)'),
      
      // Address options
      includeProperty: z.boolean().optional().describe('Include property details for address lookups'),
      includeOccupancy: z.boolean().optional().describe('Include occupancy information'),
      includeRiskFactors: z.boolean().optional().describe('Include risk factors (flood zone, crime stats, etc.)'),
      
      // Professional License options
      includeDisciplinary: z.boolean().optional().describe('Include disciplinary actions for license lookups'),
      includeExpiration: z.boolean().optional().describe('Include expiration and renewal information'),
      
      // Search Options
      exactMatch: z.boolean().optional().describe('Require exact match (default: false for fuzzy matching)'),
      maxResults: z.number().optional().describe('Maximum number of results to return (default: 10)'),
      includeScore: z.boolean().optional().describe('Include match confidence score'),
      
      // Cache Options
      useCache: z.boolean().optional().describe('Use cached results if available (default: true)'),
      cacheTimeout: z.number().optional().describe('Cache timeout in minutes (default: 60)'),
      
      // Data Sources
      preferredSources: z.array(z.string()).optional().describe('Preferred data sources to query first'),
      excludeSources: z.array(z.string()).optional().describe('Data sources to exclude from lookup'),
      
      // Output Format
      includeRawData: z.boolean().optional().describe('Include raw data from external sources'),
      standardizeOutput: z.boolean().optional().describe('Standardize output format (default: true)'),
      
      // Audit and Compliance
      auditReason: z.string().optional().describe('Reason for the lookup (for audit trail)'),
      permissiblePurpose: z.string().optional().describe('Permissible purpose under applicable regulations')
    },
    async ({ bearerToken, tenantId, lookupType, value, ...options }) => {
      try {
        const requestBody = {
          lookupType,
          value,
          ...options
        };
        
        const response = await fetch('/api/v1/claim-management/search/lookup', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${bearerToken}`,
            'Content-Type': 'application/json',
            'X-Tenant-ID': tenantId
          },
          body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
          const errorData = await response.text();
          return {
            content: [{
              type: 'text' as const,
              text: `Error looking up data: ${response.status} ${response.statusText} - ${errorData}`
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
              message: `Lookup completed for ${lookupType}: ${value}`,
              metadata: {
                lookupType,
                searchValue: value,
                resultsCount: result.results?.length || 0,
                dataSource: result.dataSource,
                confidence: result.confidence,
                cached: result.fromCache || false
              }
            }, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text' as const,
            text: `Error looking up data: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }
  );
}
