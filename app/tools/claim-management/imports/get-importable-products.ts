import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export function registerGetImportableProductsToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_imports_get_importable_products',
    'Get list of available products/data types that can be imported via BDX',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      
      // Product Type Filters
      productType: z.array(z.enum(['claims', 'policies', 'customers', 'premiums', 'exposures', 'losses'])).optional().describe('Filter by product/data type'),
      
      // Availability Filters
      availableOnly: z.boolean().optional().describe('Only show products available for import (default: true)'),
      enabledOnly: z.boolean().optional().describe('Only show products enabled for this tenant'),
      
      // Version and Format Filters
      bdxVersion: z.array(z.string()).optional().describe('Filter by supported BDX versions'),
      dataFormat: z.array(z.enum(['xml', 'json', 'csv', 'excel', 'delimited'])).optional().describe('Filter by supported data formats'),
      
      // Feature and Capability Filters
      supportsValidation: z.boolean().optional().describe('Products that support validation features'),
      supportsTransformation: z.boolean().optional().describe('Products that support data transformation'),
      supportsIncremental: z.boolean().optional().describe('Products that support incremental imports'),
      supportsBulk: z.boolean().optional().describe('Products that support bulk imports'),
      
      // Access and Permission Filters
      includeRestricted: z.boolean().optional().describe('Include products with access restrictions'),
      userRole: z.string().optional().describe('Filter by user role permissions'),
      
      // Configuration Options
      includeConfiguration: z.boolean().optional().describe('Include configuration options for each product'),
      includeValidationRules: z.boolean().optional().describe('Include validation rules and schemas'),
      includeFieldMappings: z.boolean().optional().describe('Include available field mapping options'),
      includeTransformations: z.boolean().optional().describe('Include available data transformations'),
      
      // Documentation and Help
      includeDocumentation: z.boolean().optional().describe('Include documentation links and guides'),
      includeExamples: z.boolean().optional().describe('Include sample files and examples'),
      includeSchemas: z.boolean().optional().describe('Include data schemas and specifications'),
      
      // Compatibility Information
      includeCompatibility: z.boolean().optional().describe('Include compatibility information'),
      includeRequirements: z.boolean().optional().describe('Include system requirements'),
      includeLimitations: z.boolean().optional().describe('Include known limitations'),
      
      // Usage Statistics
      includeUsageStats: z.boolean().optional().describe('Include usage statistics and metrics'),
      includeSuccessRates: z.boolean().optional().describe('Include historical success rates'),
      
      // Sorting Options
      sortBy: z.enum(['name', 'type', 'lastUsed', 'successRate', 'popularity']).optional().describe('Sort field (default: name)'),
      sortOrder: z.enum(['asc', 'desc']).optional().describe('Sort order (default: asc)'),
      
      // Output Options
      detailLevel: z.enum(['minimal', 'standard', 'detailed']).optional().describe('Level of detail in response'),
      groupByType: z.boolean().optional().describe('Group products by type/category'),
      
      // Filtering and Search
      searchQuery: z.string().optional().describe('Search products by name or description'),
      tags: z.array(z.string()).optional().describe('Filter by product tags or categories'),
      
      // Versioning and Updates
      includeVersionHistory: z.boolean().optional().describe('Include version history information'),
      checkForUpdates: z.boolean().optional().describe('Check for available updates'),
      
      // Integration Information
      includeIntegrationInfo: z.boolean().optional().describe('Include integration and API information'),
      includeWebhooks: z.boolean().optional().describe('Include webhook configuration options'),
      
      // Security and Compliance
      includeSecurityInfo: z.boolean().optional().describe('Include security and encryption information'),
      includeComplianceInfo: z.boolean().optional().describe('Include compliance and regulatory information')
    },
    async ({ bearerToken, tenantId, ...params }) => {
      try {
        const queryParams = new URLSearchParams();
        
        // Add query parameters
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
              value.forEach(item => queryParams.append(key, item.toString()));
            } else {
              queryParams.append(key, value.toString());
            }
          }
        });
        
        const response = await fetch(`/api/v1/claim-management/imports/products?${queryParams.toString()}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${bearerToken}`,
            'Content-Type': 'application/json',
            'X-Tenant-ID': tenantId
          }
        });

        if (!response.ok) {
          const errorData = await response.text();
          return {
            content: [{
              type: 'text' as const,
              text: `Error getting importable products: ${response.status} ${response.statusText} - ${errorData}`
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
              message: `Retrieved ${result.products?.length || 0} available import products`,
              metadata: {
                totalProducts: result.products?.length || 0,
                availableProducts: result.summary?.availableProducts || 0,
                enabledProducts: result.summary?.enabledProducts || 0,
                productTypes: result.summary?.productTypes || [],
                supportedFormats: result.summary?.supportedFormats || []
              }
            }, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text' as const,
            text: `Error getting importable products: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }
  );
}
