import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export function registerDeletePartnerToolClaimManagement(server: McpServer) {
  server.tool(
    'claim_management_partners_delete',
    'Delete a business partner (adjuster, lawyer, repair shop, medical provider, etc.)',
    {
      bearerToken: z.string().min(1).describe('JWT bearer token from identifier_login'),
      tenantId: z.string().describe('Tenant identifier for the organization'),
      partnerId: z.string().describe('Unique identifier of the partner to delete'),
      reason: z.string().optional().describe('Reason for deleting the partner (for audit trail)'),
      transferCasesTo: z.string().optional().describe('Partner ID to transfer active cases to (if any)')
    },
    async ({ bearerToken, tenantId, partnerId, reason, transferCasesTo }) => {
      try {
        const queryParams = new URLSearchParams();
        if (reason) queryParams.append('reason', reason);
        if (transferCasesTo) queryParams.append('transferCasesTo', transferCasesTo);
        
        const url = `/api/v1/claim-management/partners/${partnerId}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
        
        const response = await fetch(url, {
          method: 'DELETE',
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
              text: `Error deleting partner: ${response.status} ${response.statusText} - ${errorData}`
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
              message: `Partner ${partnerId} deleted successfully${transferCasesTo ? `, active cases transferred to ${transferCasesTo}` : ''}`
            }, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text' as const,
            text: `Error deleting partner: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }
  );
}
