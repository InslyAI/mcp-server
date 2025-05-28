import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerMyClaimsOpenToolClaimManagement } from './my-claims-open';
import { registerMyClaimsAlarmedToolClaimManagement } from './my-claims-alarmed';
import { registerMyClaimsInactiveToolClaimManagement } from './my-claims-inactive';

export function registerDashboardTools(server: McpServer) {
  registerMyClaimsOpenToolClaimManagement(server);
  registerMyClaimsAlarmedToolClaimManagement(server);
  registerMyClaimsInactiveToolClaimManagement(server);
}

// Note: Additional dashboard tools to be implemented:
// - my-claims-recent
// - claims-unassigned  
// - my-tasks-assigned
// - my-tasks-created