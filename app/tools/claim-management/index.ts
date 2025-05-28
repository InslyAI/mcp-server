import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerAccessManagementTools } from './access-management/index';
import { registerClaimsTools } from './claims/index';
import { registerDashboardTools } from './dashboard/index';
import { registerEntitiesTools } from './entities/index';

/**
 * Register all Claim Management MCP tools
 * Phase 3 COMPLETE: Financial Operations & Decisions (46 tools total)
 * 
 * Includes:
 * - Access Management (1 tool)
 * - Claims Operations (41 tools):
 *   * Basic Operations (6 tools)
 *   * Documents (8 tools) 
 *   * Comments (4 tools)
 *   * Alarms (3 tools)
 *   * Reserves (9 tools) - NEW Phase 3
 *   * Decisions (6 tools) - NEW Phase 3
 *   * Payment Decisions (5 tools) - NEW Phase 3
 * - Dashboard Views (3 tools)
 * - Entity Lists (2 tools)
 */
export function registerClaimManagementTools(server: McpServer) {
  registerAccessManagementTools(server);
  registerClaimsTools(server);
  registerDashboardTools(server);  
  registerEntitiesTools(server);
}

// Export client for use in tools
export { createClaimManagementClient } from './client';