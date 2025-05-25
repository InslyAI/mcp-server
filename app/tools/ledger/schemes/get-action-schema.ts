/**
 * Get Action Schema Tool
 * Retrieves JSON schema for specific action types
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../client";

export function registerGetActionSchemaTool(server: McpServer) {
  server.tool(
    "ledger_get_action_schema",
    "Get JSON schema for specific action types in the system",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      actionType: z.string().describe("Type of action to get schema for"),
    },
    async ({ bearerToken, tenantId, actionType }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const response = await client.get(`/api/v1/ledger/schemes/action/${actionType}/scheme`);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                actionType: actionType,
                schema: response,
                schemaCategory: "action",
                description: "JSON schema for specific action type configuration"
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
                error: "Failed to retrieve action schema",
                details: error.message,
                statusCode: error.status,
                actionType: actionType
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}