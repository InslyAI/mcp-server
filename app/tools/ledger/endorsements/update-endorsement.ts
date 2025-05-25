/**
 * Update Endorsement Tool
 * Updates an existing endorsement with new data
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../client";

export function registerUpdateEndorsementTool(server: McpServer) {
  server.tool(
    "ledger_update_endorsement",
    "Update an existing policy endorsement with new data or changes",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      endorsementId: z.string().describe("ID of the endorsement to update"),
      updateData: z.object({
        reason: z.string().optional().describe("Updated reason for the endorsement"),
        effectiveDate: z.string().optional().describe("Updated effective date (ISO date)"),
        description: z.string().optional().describe("Updated description of changes"),
        changes: z.record(z.any()).optional().describe("Updated policy changes object"),
        brokerNotes: z.string().optional().describe("Updated broker notes"),
        status: z.enum(['draft', 'pending_approval', 'approved', 'rejected', 'issued']).optional().describe("Updated endorsement status"),
      }).describe("Data to update in the endorsement"),
    },
    async ({ bearerToken, tenantId, endorsementId, updateData }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const response = await client.put(
          `/endorsements/${endorsementId}`,
          updateData,
          {
            "Accept-Language": "en"
          }
        );

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
                  updatedAt: response.updatedAt,
                  changes: response.changes,
                  brokerNotes: response.brokerNotes
                },
                message: "Endorsement updated successfully"
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
                error: "Failed to update endorsement",
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