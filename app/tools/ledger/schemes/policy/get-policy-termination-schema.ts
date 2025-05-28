/**
 * Get Policy Termination Schema Tool
 * Retrieves JSON schema for policy termination process
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../../client";

export function registerGetPolicyTerminationSchemaTool(server: McpServer) {
  server.tool(
    "ledger_schemes_policy_get_termination_schema",
    "Retrieve JSON schema definitions for policy termination process for a specific policy validation and form configuration",
    {
      bearerToken: z.string().min(1).describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      policyId: z.string().min(1).describe("ID of the policy to get termination schema for"),
    },
    async ({ bearerToken, tenantId, policyId }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const response = await client.get(`/api/v1/ledger/schemes/policy/${policyId}/termination/scheme`);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                policyId: policyId,
                schema: response,
                schemaCategory: "policy-termination",
                description: "JSON schema for policy termination process",
                usage: "Use this schema to validate termination requests and forms"
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
                error: "Failed to retrieve policy termination schema",
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