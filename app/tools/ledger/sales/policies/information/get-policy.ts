import { createLedgerClient } from "../../../client";
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerGetPolicyTools(server: McpServer) {
  server.tool(
    "ledger_get_policy",
    "Get detailed information about a specific policy by ID",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header (e.g., 'accelerate')"),
      policyId: z.number().int().positive().describe("Unique identifier of the policy to retrieve"),
      forceCoverageDateFormat: z.boolean().optional().describe("Force coverage date format (default: true)"),
    },
    async ({ bearerToken, tenantId, policyId, forceCoverageDateFormat }) => {
      try {
        const client = createLedgerClient(bearerToken, tenantId);
        
        const params = new URLSearchParams();
        if (forceCoverageDateFormat !== undefined) {
          params.set('forceCoverageDateFormat', forceCoverageDateFormat.toString());
        }
        
        const queryString = params.toString();
        const endpoint = `/api/v1/ledger/policies/${policyId}${queryString ? `?${queryString}` : ''}`;
        
        const data = await client.get(endpoint);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                policy: data,
                meta: {
                  policyId,
                  retrievedAt: new Date().toISOString(),
                  forceCoverageDateFormat: forceCoverageDateFormat ?? true,
                },
                relatedTools: {
                  history: "Use ledger_get_policy_history to see policy changes",
                  terminate: "Use ledger_terminate_policy to terminate this policy",
                  renew: "Use ledger_renew_policy to create a renewal"
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