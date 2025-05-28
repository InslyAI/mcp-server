import { createLedgerClient } from "../../../client";
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// Schema for policy termination
const PolicyTerminationSchema = z.object({
  policy: z.object({
    terminationType: z.enum(["manual", "full-rollback", "pro-rata"]).describe("Type of termination"),
    terminationDate: z.string().optional().describe("Termination date (YYYY-MM-DD format, required for manual termination)"),
    terminationReason: z.string().optional().describe("Optional reason for termination"),
  }),
  financials: z.object({
    adminFeeSum: z.number().describe("Administrative fee sum (use 0 for no fee)"),
  }),
});

export function registerTerminatePolicyTools(server: McpServer) {
  server.tool(
    "ledger_sales_policies_lifecycle_terminate",
    "Terminate an existing policy with specified termination type and financial details",
    {
      bearerToken: z.string().min(1).describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header (e.g., 'accelerate')"),
      policyId: z.number().int().positive().describe("Unique identifier of the policy to terminate"),
      terminationData: PolicyTerminationSchema.describe("Termination configuration including type, date, and financial details"),
    },
    async ({ bearerToken, tenantId, policyId, terminationData }) => {
      try {
        const client = createLedgerClient(bearerToken, tenantId);
        
        const data = await client.post(`/api/v1/ledger/policies/${policyId}/terminate`, terminationData);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                termination: data,
                policyId,
                terminationType: terminationData.policy.terminationType,
                terminationDate: terminationData.policy.terminationDate,
                message: `Policy ${policyId} terminated successfully with type: ${terminationData.policy.terminationType}`,
                meta: {
                  terminatedAt: new Date().toISOString(),
                  adminFeeSum: terminationData.financials.adminFeeSum,
                  reason: terminationData.policy.terminationReason,
                },
                relatedTools: {
                  revert: "Use ledger_revert_policy_termination to undo this termination if needed",
                  history: "Use ledger_get_policy_history to see the termination in policy history"
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
                terminationType: terminationData.policy.terminationType,
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}