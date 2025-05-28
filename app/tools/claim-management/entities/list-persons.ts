import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from 'zod';
import { createClaimManagementClient } from '../client';

export function registerListPersonsToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_persons_list',
    'List all persons involved in claims (claimants, witnesses, adjusters, experts) across the system for reference.',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      page: z.number().optional().describe('Page number for pagination (default: 1)'),
      limit: z.number().optional().describe('Number of persons per page (default: 25)'),
      personType: z.string().optional().describe('Filter by person type (e.g., "claimant", "witness", "adjuster", "expert")'),
      search: z.string().optional().describe('Search term for person name, email, or identification'),
    },
    async ({ bearerToken, tenantId, page, limit, personType, search }) => {
      try {
        const client = createClaimManagementClient(bearerToken, tenantId);
        
        // Build query parameters
        const params = new URLSearchParams();
        if (page) params.append('page', page.toString());
        if (limit) params.append('limit', limit.toString());
        if (personType) params.append('person_type', personType);
        if (search) params.append('search', search);
        
        const queryString = params.toString() ? `?${params.toString()}` : '';
        const result = await client.get(`/api/v1/claim-management/persons${queryString}`);
        
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
            text: `Error listing persons: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }
  );
}