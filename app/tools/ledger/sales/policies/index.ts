/**
 * Sales Policies Tools Index
 * Registers all sales policies-related MCP tools
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// Import all sales policies subdirectory registration functions
export * from "./documents/index.js";
export * from "./calculations/index.js";
export * from "./lifecycle/index.js";
export * from "./information/index.js";
export * from "./referrals/index.js";

export function registerSalesPoliciesTools(server: McpServer) {
  // Registration will be implemented after organizing all tools
}