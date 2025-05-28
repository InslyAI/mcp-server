import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerGetActiveUsersToolClaimManagement } from './get-active-users';

export function registerUsersTools(server: McpServer) {
  registerGetActiveUsersToolClaimManagement(server);
}
