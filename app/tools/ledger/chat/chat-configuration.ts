/**
 * Chat Settings Configuration Tool
 * Manage chat and communication settings
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../client";

export function registerChatConfigurationTool(server: McpServer) {
  server.tool(
    "ledger_chat_chat_configuration",
    "Configure chat settings, notifications, and communication preferences",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      operation: z.enum(["get", "update", "reset", "validate"]).describe("Configuration operation"),
      configData: z.object({
        chatEnabled: z.boolean().optional().describe("Enable/disable chat functionality"),
        notificationSettings: z.object({
          email: z.boolean().optional(),
          sms: z.boolean().optional(),
          push: z.boolean().optional(),
          inApp: z.boolean().optional()
        }).optional().describe("Notification preferences"),
        autoResponse: z.object({
          enabled: z.boolean().optional(),
          message: z.string().optional(),
          businessHours: z.object({
            enabled: z.boolean().optional(),
            start: z.string().optional().describe("Start time (HH:MM)"),
            end: z.string().optional().describe("End time (HH:MM)"),
            timezone: z.string().optional()
          }).optional()
        }).optional().describe("Auto-response settings"),
        chatBehavior: z.object({
          maxMessageLength: z.number().optional(),
          allowFileUpload: z.boolean().optional(),
          allowEmojis: z.boolean().optional(),
          moderationLevel: z.enum(["low", "medium", "high"]).optional()
        }).optional().describe("Chat behavior settings"),
        integrations: z.object({
          slack: z.boolean().optional(),
          teams: z.boolean().optional(),
          webhook: z.string().optional()
        }).optional().describe("Third-party integrations")
      }).optional().describe("Configuration data to update")
    },
    async ({ bearerToken, tenantId, operation, configData = {} }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        let endpoint = `/api/v1/ledger/chat/configuration`;
        let response;
        
        switch (operation) {
          case "get":
            response = await client.get(endpoint);
            break;
          case "update":
            response = await client.put(endpoint, configData);
            break;
          case "reset":
            endpoint += "/reset";
            response = await client.post(endpoint, {});
            break;
          case "validate":
            endpoint += "/validate";
            response = await client.post(endpoint, configData);
            break;
        }

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                operation: operation,
                configuration: response,
                configData: configData
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
                error: "Failed to configure chat settings",
                details: error.message,
                statusCode: error.status,
                operation: operation
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}