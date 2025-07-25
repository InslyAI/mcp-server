/**
 * Get Endorsement Tool
 * Retrieves detailed information about a specific endorsement
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createLedgerClient } from "../../client";

export function registerGetEndorsementTool(server: McpServer) {
  server.tool(
    "ledger_sales_endorsements_get",
    "Retrieve detailed details about a specific policy endorsement",
    {
      bearerToken: z.string().min(1).describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      endorsementId: z.string().min(1).describe("ID of the endorsement to retrieve"),
      includeHistory: z.boolean().optional().describe("Whether to include change history"),
      includeDocuments: z.boolean().optional().describe("Whether to include related documents"),
    },
    async ({ bearerToken, tenantId, endorsementId, includeHistory, includeDocuments }) => {
      try {
        const client = createLedgerClient(bearerToken, tenantId);
        
        const queryParams = new URLSearchParams();
        if (includeHistory) queryParams.append('include_history', 'true');
        if (includeDocuments) queryParams.append('include_documents', 'true');
        
        const endpoint = `/endorsements/${endorsementId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        
        const response = await client.get(endpoint);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                endorsement: {
                  id: response.id,
                  policyId: response.policyId,
                  type: response.type,
                  status: response.status,
                  reason: response.reason,
                  effectiveDate: response.effectiveDate,
                  createdAt: response.createdAt,
                  updatedAt: response.updatedAt,
                  changes: response.changes,
                  requestedBy: response.requestedBy,
                  brokerNotes: response.brokerNotes,
                  premiumAdjustment: response.premiumAdjustment,
                  ...(includeHistory && { history: response.history }),
                  ...(includeDocuments && { documents: response.documents })
                }
              }, null, 2)
            }
          ]
        };
      } catch (error: any) {
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: false,
                error: "Failed to retrieve endorsement",
                details: error.message,
                statusCode: error.status
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}