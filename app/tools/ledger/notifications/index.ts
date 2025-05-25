/**
 * Notification Tools Registration
 * Communication and notification management tools
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerSendNotificationTool } from "./send-notification";
import { registerListNotificationsTool } from "./list-notifications";
import { registerManageNotificationTemplatesTool } from "./manage-notification-templates";
import { registerGetNotificationPreferencesTool } from "./get-notification-preferences";

/**
 * Register all Notification MCP tools
 * These tools handle multi-channel communications, templates, and user preferences
 */
export function registerNotificationTools(server: McpServer) {
  registerSendNotificationTool(server);
  registerListNotificationsTool(server);
  registerManageNotificationTemplatesTool(server);
  registerGetNotificationPreferencesTool(server);
}