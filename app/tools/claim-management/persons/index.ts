import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerListPersonsToolClaimManagement } from './list-persons';
import { registerCreatePersonToolClaimManagement } from './create-person';
import { registerUpdatePersonToolClaimManagement } from './update-person';
import { registerDeletePersonToolClaimManagement } from './delete-person';

export function registerPersonsTools(server: McpServer) {
  registerListPersonsToolClaimManagement(server);
  registerCreatePersonToolClaimManagement(server);
  registerUpdatePersonToolClaimManagement(server);
  registerDeletePersonToolClaimManagement(server);
}
