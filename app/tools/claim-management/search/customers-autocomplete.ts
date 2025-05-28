import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export function registerCustomersAutocompleteToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_search_customers_autocomplete',
    'Autocomplete search for customers to provide quick suggestions during data entry',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      
      // Search Query
      query: z.string().min(1).describe('Search query (customer name, ID, email, phone, etc.)'),
      
      // Search Scope
      searchFields: z.array(z.enum(['name', 'email', 'phone', 'customerId', 'policyNumber', 'address'])).optional().describe('Fields to search in (default: all fields)'),
      
      // Result Limits
      limit: z.number().optional().describe('Maximum number of suggestions to return (default: 10, max: 50)'),
      
      // Matching Options
      matchType: z.enum(['starts-with', 'contains', 'fuzzy']).optional().describe('Type of matching to perform (default: starts-with)'),
      minLength: z.number().optional().describe('Minimum query length to trigger search (default: 2)'),
      caseSensitive: z.boolean().optional().describe('Whether search should be case sensitive (default: false)'),
      
      // Customer Filters
      customerStatus: z.array(z.enum(['active', 'inactive', 'suspended', 'prospect'])).optional().describe('Filter by customer status'),
      customerType: z.array(z.enum(['individual', 'business', 'organization'])).optional().describe('Filter by customer type'),
      
      // Geographic Filters
      region: z.array(z.string()).optional().describe('Filter by geographic region'),
      state: z.array(z.string()).optional().describe('Filter by state/province'),
      country: z.array(z.string()).optional().describe('Filter by country'),
      
      // Policy Filters
      hasActivePolicies: z.boolean().optional().describe('Only customers with active policies'),
      policyType: z.array(z.string()).optional().describe('Filter by policy types held'),
      lineOfBusiness: z.array(z.string()).optional().describe('Filter by lines of business'),
      
      // Claim History Filters
      hasClaimHistory: z.boolean().optional().describe('Only customers with claim history'),
      recentClaimsOnly: z.boolean().optional().describe('Only customers with recent claims (last 2 years)'),
      
      // Risk Profile Filters
      riskLevel: z.array(z.enum(['low', 'medium', 'high', 'critical'])).optional().describe('Filter by risk level'),
      fraudFlags: z.boolean().optional().describe('Include/exclude customers with fraud flags'),
      
      // Relationship Filters
      agentId: z.array(z.string()).optional().describe('Filter by assigned agent/broker'),
      branch: z.array(z.string()).optional().describe('Filter by branch/office'),
      
      // Include Options
      includeInactive: z.boolean().optional().describe('Include inactive customers in results (default: false)'),
      includeContactInfo: z.boolean().optional().describe('Include basic contact information'),
      includePolicyInfo: z.boolean().optional().describe('Include active policy information'),
      includeClaimSummary: z.boolean().optional().describe('Include claim history summary'),
      includeRiskInfo: z.boolean().optional().describe('Include risk profile information'),
      
      // Sorting and Ranking
      sortBy: z.enum(['relevance', 'name', 'lastActivity', 'claimCount', 'policyValue']).optional().describe('Sort field (default: relevance)'),
      boostRecentCustomers: z.boolean().optional().describe('Boost recently active customers in results'),
      boostHighValueCustomers: z.boolean().optional().describe('Boost high-value customers in results'),
      
      // Performance Options
      useCache: z.boolean().optional().describe('Use cached results for performance (default: true)'),
      cacheTimeout: z.number().optional().describe('Cache timeout in seconds (default: 300)'),
      
      // Context and Personalization
      contextType: z.enum(['claim-creation', 'policy-creation', 'general-search', 'reporting']).optional().describe('Context where autocomplete is being used'),
      userId: z.string().optional().describe('Current user ID for personalized suggestions'),
      
      // Data Quality
      excludeIncompleteRecords: z.boolean().optional().describe('Exclude customers with incomplete data'),
      requireValidContact: z.boolean().optional().describe('Require valid contact information'),
      
      // Highlighting and Formatting
      highlightMatches: z.boolean().optional().describe('Highlight matching text in results'),
      formatPhone: z.boolean().optional().describe('Format phone numbers in results'),
      formatAddress: z.boolean().optional().describe('Format addresses in results')
    },
    async ({ bearerToken, tenantId, query, ...options }) => {
      try {
        const requestBody = {
          query,
          ...options
        };
        
        const response = await fetch('/api/v1/claim-management/msearch/customers-autocomplete', {
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
              text: `Error searching customers autocomplete: ${response.status} ${response.statusText} - ${errorData}`
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
              message: `Found ${result.suggestions?.length || 0} customer suggestions for "${query}"`,
              metadata: {
                searchQuery: query,
                suggestionCount: result.suggestions?.length || 0,
                searchTimeMs: result.searchTimeMs,
                fromCache: result.fromCache || false,
                hasMore: result.hasMore || false
              }
            }, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text' as const,
            text: `Error searching customers autocomplete: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }
  );
}
