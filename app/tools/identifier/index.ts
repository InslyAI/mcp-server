/**
 * Identifier MCP Tools Registration
 * Authentication tools for Insly Identifier service
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerIdentifierLoginTool } from "./login";
import { registerIdentifierClientCredentialsTool } from "./client-credentials";
import { registerIdentifierRefreshTokenTool } from "./refresh-token";

/**
 * Register all Identifier MCP tools
 * These tools handle authentication with Insly Identifier service
 */
export function registerIdentifierTools(server: McpServer) {
  registerIdentifierLoginTool(server);
  registerIdentifierClientCredentialsTool(server);
  registerIdentifierRefreshTokenTool(server);
}