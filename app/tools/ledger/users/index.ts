/**
 * User Management Tools Registration
 * User listing tool for Ledger service
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerListUsersTool } from "./list-users";

/**
 * Register User Management MCP tools
 * Note: Only simple user listing is available through Ledger API
 * Other user management operations are not supported by the Ledger service
 */
export function registerUserTools(server: McpServer) {
  registerListUsersTool(server);
}