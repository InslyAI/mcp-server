import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerBasicClaimsTools } from './basic/index';
import { registerDocumentsTools } from './documents/index';
import { registerCommentsTools } from './comments/index';
import { registerAlarmsTools } from './alarms/index';

/**
 * Register all claims-related tools
 * Total: 21 tools across 4 categories
 * 
 * Categories:
 * - Basic Operations (6 tools): CRUD, amounts, events
 * - Documents (8 tools): upload, download, generate, render
 * - Comments (4 tools): CRUD operations for notes
 * - Alarms (3 tools): list, update, poll unnoted
 */
export function registerClaimsTools(server: McpServer) {
  registerBasicClaimsTools(server);
  registerDocumentsTools(server);
  registerCommentsTools(server);
  registerAlarmsTools(server);
}