import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { createClaimManagementClient } from '../client';

export function registerDeletePersonToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_persons_delete',
    'Remove a person from a claim',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      claim: z.string().describe('Claim identifier (claim number or UUID)'),
      person: z.string().describe('Person identifier to delete'),
      deleteReason: z.string().optional().describe('Reason for removing the person from the claim'),
      archiveData: z.boolean().optional().describe('Whether to archive person data instead of permanent deletion'),
      transferLiability: z.boolean().optional().describe('Whether to transfer liability to other parties')
    },
    async ({ bearerToken, tenantId, claim, person, deleteReason, archiveData, transferLiability }) => {
      try {
        const client = createClaimManagementClient(bearerToken, tenantId);
        
        // Build query parameters if needed
        const params = new URLSearchParams();
        if (deleteReason) params.append('delete_reason', deleteReason);
        if (archiveData !== undefined) params.append('archive_data', archiveData.toString());
        if (transferLiability !== undefined) params.append('transfer_liability', transferLiability.toString());
        
        const queryString = params.toString() ? `?${params.toString()}` : '';
        const result = await client.delete(`/api/v1/claim-management/claims/${claim}/persons/${person}${queryString}`);
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              success: true,
              data: result,
              message: 'Person removed from claim successfully'
            }, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text', 
            text: JSON.stringify({
              success: false,
              error: error.message || 'Failed to remove person from claim',
              details: error.response?.data || error
            }, null, 2)
          }]
        };
      }
    }
  );
}
