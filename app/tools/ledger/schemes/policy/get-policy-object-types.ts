/**
 * Get Policy Object Types Tool
 * Retrieves available object types for policy schema
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../../client";

export function registerGetPolicyObjectTypesTool(server: McpServer) {
  server.tool(
    "ledger_get_policy_object_types",
    "Get available object types for policy schema (e.g., building, vehicle, etc.)",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      schemaName: z.string().describe("Name of the policy schema to get object types for"),
    },
    async ({ bearerToken, tenantId, schemaName }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const queryParams = new URLSearchParams();
        queryParams.append('name', schemaName);
        
        const response = await client.get(`/api/v1/ledger/schemes/policy/object-types?${queryParams.toString()}`);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                schemaName: schemaName,
                objectTypes: response,
                description: "Available object types for policy schema",
                usage: "Use these object types when creating or updating policies"
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
                error: "Failed to retrieve policy object types",
                details: error.message,
                statusCode: error.status,
                schemaName: schemaName
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}