/**
 * Manage Policy Actions Tool
 * Handles policy actions and workflow operations
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../client";

export function registerManagePolicyActionsTool(server: McpServer) {
  server.tool(
    "ledger_manage_policy_actions",
    "Manage policy actions and workflow operations",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      actionId: z.string().describe("ID of the action to manage"),
      actionData: z.object({
        actionType: z.string().optional().describe("Type of action to perform"),
        parameters: z.record(z.any()).optional().describe("Action parameters"),
        scheduledTime: z.string().optional().describe("When to execute the action"),
        priority: z.string().optional().describe("Action priority level")
      }).optional().describe("Action configuration data")
    },
    async ({ bearerToken, tenantId, actionId, actionData }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const response = await client.post(`/api/v1/ledger/sales/policies/actions/${actionId}`, actionData || {});

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                actionId: actionId,
                actionResult: response,
                actionData: actionData
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
                error: "Failed to manage policy action",
                details: error.message,
                statusCode: error.status,
                actionId: actionId
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}