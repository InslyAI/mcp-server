import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerListMajorEventsToolClaimManagement } from './list-major-events';
import { registerCreateMajorEventToolClaimManagement } from './create-major-event';
import { registerGetMajorEventToolClaimManagement } from './get-major-event';
import { registerUpdateMajorEventToolClaimManagement } from './update-major-event';
import { registerDeleteMajorEventToolClaimManagement } from './delete-major-event';
import { registerListOpenMajorEventsToolClaimManagement } from './list-open-events';

export function registerMajorEventsTools(server: McpServer) {
  registerListMajorEventsToolClaimManagement(server);
  registerCreateMajorEventToolClaimManagement(server);
  registerGetMajorEventToolClaimManagement(server);
  registerUpdateMajorEventToolClaimManagement(server);
  registerDeleteMajorEventToolClaimManagement(server);
  registerListOpenMajorEventsToolClaimManagement(server);
}
