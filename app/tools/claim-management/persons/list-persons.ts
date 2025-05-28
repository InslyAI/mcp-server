import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { createClaimManagementClient } from '../client';

export function registerListPersonsToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_persons_list',
    'Get list of persons associated with a claim (claimants, drivers, witnesses, etc.)',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      claim: z.string().describe('Claim identifier (claim number or UUID)'),
      personType: z.string().optional().describe('Filter by person type (e.g., "claimant", "driver", "witness", "third_party")'),
      role: z.string().optional().describe('Filter by person role in the claim'),
      includeContactInfo: z.boolean().optional().describe('Whether to include detailed contact information')
    },
    async ({ bearerToken, tenantId, claim, personType, role, includeContactInfo }) => {
      try {
        const client = createClaimManagementClient(bearerToken, tenantId);
        
        // Build query parameters
        const params = new URLSearchParams();
        if (personType) params.append('person_type', personType);
        if (role) params.append('role', role);
        if (includeContactInfo !== undefined) params.append('include_contact_info', includeContactInfo.toString());
        
        const queryString = params.toString() ? `?${params.toString()}` : '';
        const result = await client.get(`/api/v1/claim-management/claims/${claim}/persons${queryString}`);
        
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
            text: `Error listing claim persons: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }
  );
}
