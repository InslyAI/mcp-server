import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerAccessManagementTools } from './access-management/index';
import { registerClaimsTools } from './claims/index';
import { registerDashboardTools } from './dashboard/index';
import { registerEntitiesTools } from './entities/index';
import { registerFnolTools } from './fnol/index';
import { registerExternalFnolTools } from './external-fnol/index';
import { registerTasksTools } from './tasks/index';
import { registerObjectsTools } from './objects/index';
import { registerPersonsTools } from './persons/index';

/**
 * Register all Claim Management MCP tools
 * Phase 4 COMPLETE: Core Claim Operations (66 tools total)
 * 
 * Includes:
 * - Access Management (1 tool)
 * - Claims Operations (41 tools):
 *   * Basic Operations (6 tools)
 *   * Documents (8 tools) 
 *   * Comments (4 tools)
 *   * Alarms (3 tools)
 *   * Reserves (9 tools) - Phase 3
 *   * Decisions (6 tools) - Phase 3
 *   * Payment Decisions (5 tools) - Phase 3
 * - FNOL Operations (5 tools) - NEW Phase 4:
 *   * FNOL (3 tools): generate link, get data, store claim
 *   * External FNOL (2 tools): create, store document
 * - Tasks Management (6 tools) - NEW Phase 4
 * - Objects Management (5 tools) - NEW Phase 4
 * - Persons Management (4 tools) - NEW Phase 4
 * - Dashboard Views (3 tools)
 * - Entity Lists (2 tools)
 */
export function registerClaimManagementTools(server: McpServer) {
  registerAccessManagementTools(server);
  registerClaimsTools(server);
  registerFnolTools(server);
  registerExternalFnolTools(server);
  registerTasksTools(server);
  registerObjectsTools(server);
  registerPersonsTools(server);
  registerDashboardTools(server);  
  registerEntitiesTools(server);
}

// Export client for use in tools
export { createClaimManagementClient } from './client';