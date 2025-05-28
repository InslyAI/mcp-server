/**
 * Chat Settings Tools
 * Communication and chat configuration
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerChatConfigurationTool } from "./chat-configuration";

export function registerChatSettingsTools(server: McpServer) {
  registerChatConfigurationTool(server);
}

// Export individual registration functions
export { registerChatConfigurationTool };