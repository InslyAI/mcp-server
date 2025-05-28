import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerListObjectsToolClaimManagement } from './list-objects';
import { registerCreateObjectToolClaimManagement } from './create-object';
import { registerUpdateObjectToolClaimManagement } from './update-object';
import { registerDeleteObjectToolClaimManagement } from './delete-object';
import { registerListObjectReservesToolClaimManagement } from './list-object-reserves';

export function registerObjectsTools(server: McpServer) {
  registerListObjectsToolClaimManagement(server);
  registerCreateObjectToolClaimManagement(server);
  registerUpdateObjectToolClaimManagement(server);
  registerDeleteObjectToolClaimManagement(server);
  registerListObjectReservesToolClaimManagement(server);
}
