import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerMyClaimsOpenToolClaimManagement } from './my-claims-open';
import { registerMyClaimsAlarmedToolClaimManagement } from './my-claims-alarmed';
import { registerMyClaimsInactiveToolClaimManagement } from './my-claims-inactive';
import { registerMyClaimsRecentToolClaimManagement } from './my-claims-recent';
import { registerClaimsUnassignedToolClaimManagement } from './claims-unassigned';
import { registerMyTasksAssignedToolClaimManagement } from './my-tasks-assigned';
import { registerMyTasksCreatedToolClaimManagement } from './my-tasks-created';

export function registerDashboardTools(server: McpServer) {
  registerMyClaimsOpenToolClaimManagement(server);
  registerMyClaimsAlarmedToolClaimManagement(server);
  registerMyClaimsInactiveToolClaimManagement(server);
  registerMyClaimsRecentToolClaimManagement(server);
  registerClaimsUnassignedToolClaimManagement(server);
  registerMyTasksAssignedToolClaimManagement(server);
  registerMyTasksCreatedToolClaimManagement(server);
}

// All dashboard tools implemented!