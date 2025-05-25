/**
 * Create Endorsement Tool
 * Creates a new policy endorsement for policy modifications
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../client";

export function registerCreateEndorsementTool(server: McpServer) {
  server.tool(
    "ledger_create_endorsement",
    "Create a new policy endorsement for modifying an existing policy",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      policyId: z.string().describe("ID of the policy to endorse"),
      endorsementData: z.object({
        type: z.string().describe("Type of endorsement (e.g., 'coverage_change', 'term_extension', 'premium_adjustment')"),
        reason: z.string().describe("Reason for the endorsement"),
        effectiveDate: z.string().describe("Effective date for the endorsement (ISO date)"),
        description: z.string().optional().describe("Additional description of changes"),
        changes: z.record(z.any()).describe("Object containing the specific policy changes"),
        requestedBy: z.string().optional().describe("Who requested this endorsement"),
        brokerNotes: z.string().optional().describe("Notes from the broker"),
      }).describe("Endorsement configuration data"),
    },
    async ({ bearerToken, tenantId, policyId, endorsementData }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const response = await client.post(
          `/policies/${policyId}/endorsements`,
          endorsementData,
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
                endorsementId: response.id,
                status: response.status,
                effectiveDate: response.effectiveDate,
                changes: response.changes,
                message: "Endorsement created successfully"
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
                error: "Failed to create endorsement",
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