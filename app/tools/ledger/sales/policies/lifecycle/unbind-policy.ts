/**
 * Unbind Policy Tool
 * Unbinds/unlocks a policy to allow further changes
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../../../client";

export function registerUnbindPolicyTool(server: McpServer) {
  server.tool(
    "ledger_sales_policies_lifecycle_unbind",
    "Unbind/unlock a policy to allow further changes and modifications",
    {
      bearerToken: z.string().min(1).describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      policyId: z.string().min(1).describe("ID of the policy to unbind"),
      unbindingReason: z.string().optional().describe("Reason for unbinding the policy")
    },
    async ({ bearerToken, tenantId, policyId, unbindingReason }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const requestBody = unbindingReason ? { reason: unbindingReason } : {};
        
        const response = await client.post(`/api/v1/ledger/sales/policies/${policyId}/unbind`, requestBody);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                message: "Policy unbound/unlocked successfully",
                policyId: policyId,
                status: "unbound",
                unboundAt: new Date().toISOString(),
                unbindingReason: unbindingReason || null
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
                error: "Failed to unbind policy",
                details: error.message,
                statusCode: error.status,
                policyId: policyId
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}