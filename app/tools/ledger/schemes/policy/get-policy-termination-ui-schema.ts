/**
 * Get Policy Termination UI Schema Tool
 * Retrieves UI schema for rendering policy termination interfaces
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../../client";

export function registerGetPolicyTerminationUiSchemaTool(server: McpServer) {
  server.tool(
    "ledger_schemes_policy_get_termination_ui_schema",
    "Get UI schema for rendering policy termination interfaces for a specific policy",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      policyId: z.string().describe("ID of the policy to get termination UI schema for"),
    },
    async ({ bearerToken, tenantId, policyId }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const response = await client.get(`/api/v1/ledger/schemes/policy/${policyId}/termination/ui`);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                policyId: policyId,
                uiSchema: response,
                schemaCategory: "policy-termination-ui",
                description: "UI schema for rendering policy termination forms and interfaces",
                usage: "Use with React JSON Schema Form for policy termination interfaces"
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
                error: "Failed to retrieve policy termination UI schema",
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