/**
 * User Management Tools Registration
 * User administration and permission management tools
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerListUsersTool } from "./list-users";
import { registerGetUserTool } from "./get-user";
import { registerCreateUserTool } from "./create-user";
import { registerUpdateUserTool } from "./update-user";
import { registerGetUserPermissionsTool } from "./get-user-permissions";

/**
 * Register all User Management MCP tools
 * These tools handle user administration, roles, and permissions management
 */
export function registerUserTools(server: McpServer) {
  registerListUsersTool(server);
  registerGetUserTool(server);
  registerCreateUserTool(server);
  registerUpdateUserTool(server);
  registerGetUserPermissionsTool(server);
}