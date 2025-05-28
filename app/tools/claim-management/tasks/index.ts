import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerListTasksToolClaimManagement } from './list-tasks';
import { registerCreateTaskToolClaimManagement } from './create-task';
import { registerUpdateTaskToolClaimManagement } from './update-task';
import { registerDeleteTaskToolClaimManagement } from './delete-task';
import { registerListClaimTasksToolClaimManagement } from './list-claim-tasks';
import { registerMyTasksDashboardToolClaimManagement } from './my-tasks-dashboard';

export function registerTasksTools(server: McpServer) {
  registerListTasksToolClaimManagement(server);
  registerCreateTaskToolClaimManagement(server);
  registerUpdateTaskToolClaimManagement(server);
  registerDeleteTaskToolClaimManagement(server);
  registerListClaimTasksToolClaimManagement(server);
  registerMyTasksDashboardToolClaimManagement(server);
}
