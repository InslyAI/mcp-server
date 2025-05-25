/**
 * Search Tools Registration
 * Universal search capabilities across the platform
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerMultiSearchTool } from './multi-search';

export function registerSearchTools(server: McpServer) {
  registerMultiSearchTool(server);
}