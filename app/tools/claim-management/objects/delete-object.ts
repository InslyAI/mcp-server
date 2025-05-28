import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { createClaimManagementClient } from '../client';

export function registerDeleteObjectToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_objects_delete',
    'Delete an object from a claim',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      claim: z.string().describe('Claim identifier (claim number or UUID)'),
      object: z.string().describe('Object identifier to delete'),
      deleteReason: z.string().optional().describe('Reason for deleting the object'),
      transferReserves: z.boolean().optional().describe('Whether to transfer reserves to other objects'),
      archiveDocuments: z.boolean().optional().describe('Whether to archive associated documents')
    },
    async ({ bearerToken, tenantId, claim, object, deleteReason, transferReserves, archiveDocuments }) => {
      try {
        const client = createClaimManagementClient(bearerToken, tenantId);
        
        // Build query parameters if needed
        const params = new URLSearchParams();
        if (deleteReason) params.append('delete_reason', deleteReason);
        if (transferReserves !== undefined) params.append('transfer_reserves', transferReserves.toString());
        if (archiveDocuments !== undefined) params.append('archive_documents', archiveDocuments.toString());
        
        const queryString = params.toString() ? `?${params.toString()}` : '';
        const result = await client.delete(`/api/v1/claim-management/claims/${claim}/objects/${object}${queryString}`);
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              success: true,
              data: result,
              message: 'Claim object deleted successfully'
            }, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text', 
            text: JSON.stringify({
              success: false,
              error: error.message || 'Failed to delete claim object',
              details: error.response?.data || error
            }, null, 2)
          }]
        };
      }
    }
  );
}
