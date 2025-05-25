/**
 * Get Action UI Schema Tool
 * Retrieves UI schema for rendering action type interfaces
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../client";

export function registerGetActionUiSchemaTool(server: McpServer) {
  server.tool(
    "ledger_get_action_ui_schema",
    "Get UI schema for rendering action type interfaces",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      actionType: z.string().describe("Type of action to get UI schema for"),
    },
    async ({ bearerToken, tenantId, actionType }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const response = await client.get(`/api/v1/ledger/schemes/action/${actionType}/ui`);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                actionType: actionType,
                uiSchema: response,
                schemaCategory: "action-ui",
                description: "UI schema for rendering action type forms and interfaces",
                usage: "Use with React JSON Schema Form for action interfaces"
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
                error: "Failed to retrieve action UI schema",
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