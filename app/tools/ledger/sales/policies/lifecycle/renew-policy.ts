import { createLedgerClient } from "../../../client";
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerRenewPolicyTools(server: McpServer) {
  server.tool(
    "ledger_sales_policies_lifecycle_renew",
    "Prepare data for policy renewal by creating a renewal quote based on the existing policy",
    {
      bearerToken: z.string().min(1).describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header (e.g., 'accelerate')"),
      policyId: z.number().int().positive().describe("Unique identifier of the policy to renew"),
    },
    async ({ bearerToken, tenantId, policyId }) => {
      try {
        const client = createLedgerClient(bearerToken, tenantId);
        
        const data = await client.get(`/api/v1/ledger/policies/${policyId}/renewal`);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                renewalData: data,
                policyId,
                message: `Renewal data prepared for policy ${policyId}`,
                meta: {
                  originalPolicyId: policyId,
                  renewalPreparedAt: new Date().toISOString(),
                  schemaPath: data.meta?.schemaPath,
                },
                usage: "Use this renewal data to create a new quote for the renewal period. The returned data contains the policy structure needed for the renewal quote creation.",
                relatedTools: {
                  createQuote: "Use the returned data with quote creation tools to finalize the renewal",
                  history: "Use ledger_get_policy_history to see renewal history"
                }
              }, null, 2)
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred',
                policyId,
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}