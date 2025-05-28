import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerGetActionsToolClaimManagement } from './get-actions';

export function registerAccessManagementTools(server: McpServer) {
  registerGetActionsToolClaimManagement(server);
}