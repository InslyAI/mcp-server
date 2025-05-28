import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerAccessManagementTools } from './access-management/index';
import { registerClaimsTools } from './claims/index';
import { registerDashboardTools } from './dashboard/index';
import { registerEntitiesTools } from './entities/index';

/**
 * Register all Claim Management MCP tools
 * Phase 2 implementation: Document & Communication tools (26 tools total)
 * 
 * Includes:
 * - Access Management (1 tool)
 * - Claims Operations (21 tools):
 *   * Basic Operations (6 tools)
 *   * Documents (8 tools) 
 *   * Comments (4 tools)
 *   * Alarms (3 tools)
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