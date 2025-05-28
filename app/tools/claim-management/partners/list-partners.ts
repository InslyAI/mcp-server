import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { createClaimManagementClient } from '../client';

export function registerListPartnersToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_partners_list',
    'Get list of business partners (adjusters, lawyers, repair shops, medical providers, etc.)',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      partnerType: z.string().optional().describe('Filter by partner type (e.g., "adjuster", "lawyer", "repair_shop", "medical_provider", "expert")'),
      location: z.string().optional().describe('Filter by location/region'),
      specialization: z.string().optional().describe('Filter by specialization or expertise area'),
      status: z.string().optional().describe('Filter by partner status (e.g., "active", "inactive", "suspended")'),
      search: z.string().optional().describe('Search term for partner name, company, or contact'),
      page: z.number().optional().describe('Page number for pagination (default: 1)'),
      limit: z.number().optional().describe('Number of partners per page (default: 25)'),
      sortBy: z.string().optional().describe('Field to sort by (e.g., "name", "rating", "created_at")'),
      sortOrder: z.enum(['asc', 'desc']).optional().describe('Sort order (default: desc)')
    },
    async ({ bearerToken, tenantId, partnerType, location, specialization, status, search, page, limit, sortBy, sortOrder }) => {
      try {
        const client = createClaimManagementClient(bearerToken, tenantId);
        
        // Build query parameters
        const params = new URLSearchParams();
        if (partnerType) params.append('partner_type', partnerType);
        if (location) params.append('location', location);
        if (specialization) params.append('specialization', specialization);
        if (status) params.append('status', status);
        if (search) params.append('search', search);
        if (page) params.append('page', page.toString());
        if (limit) params.append('limit', limit.toString());
        if (sortBy) params.append('sort_by', sortBy);
        if (sortOrder) params.append('sort_order', sortOrder);
        
        const queryString = params.toString() ? `?${params.toString()}` : '';
        const result = await client.get(`/api/v1/claim-management/partners${queryString}`);
        
        return {
          content: [{
            type: 'text' as const,
            text: JSON.stringify(result, null, 2)
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: 'text' as const,
            text: `Error listing partners: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }
  );
}
