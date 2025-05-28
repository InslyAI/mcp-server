import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { createClaimManagementClient } from '../client';

export function registerDeleteMajorEventToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_major_events_delete',
    'Delete a major event (only if no active claims are linked)',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      majorEvent: z.string().describe('Major event identifier to delete'),
      deleteReason: z.string().describe('Reason for deleting the major event'),
      archiveLinkedData: z.boolean().optional().describe('Whether to archive linked claims and data'),
      forceDelete: z.boolean().optional().describe('Force delete even with linked claims (use with caution)'),
      transferClaims: z.string().optional().describe('Alternative major event ID to transfer claims to')
    },
    async ({ bearerToken, tenantId, majorEvent, deleteReason, archiveLinkedData, forceDelete, transferClaims }) => {
      try {
        const client = createClaimManagementClient(bearerToken, tenantId);
        
        // Build query parameters
        const params = new URLSearchParams();
        params.append('delete_reason', deleteReason);
        if (archiveLinkedData !== undefined) params.append('archive_linked_data', archiveLinkedData.toString());
        if (forceDelete !== undefined) params.append('force_delete', forceDelete.toString());
        if (transferClaims) params.append('transfer_claims', transferClaims);
        
        const queryString = params.toString() ? `?${params.toString()}` : '';
        const result = await client.delete(`/api/v1/claim-management/major-events/${majorEvent}${queryString}`);
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              success: true,
              data: result,
              message: 'Major event deleted successfully'
            }, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text', 
            text: JSON.stringify({
              success: false,
              error: error.message || 'Failed to delete major event',
              details: error.response?.data || error
            }, null, 2)
          }]
        };
      }
    }
  );
}
