/**
 * Reinsurance Management Tools Registration
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerListReinsuranceTool } from './list-reinsurance';

export function registerReinsuranceTools(server: McpServer) {
  registerListReinsuranceTool(server);
}