import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerAccessManagementTools } from './access-management/index';
import { registerBasicClaimsTools } from './claims/basic/index';
import { registerDashboardTools } from './dashboard/index';
import { registerEntitiesTools } from './entities/index';

/**
 * Register all Claim Management MCP tools
 * Phase 1 implementation: Foundation tools (11 tools)
 * 
 * Includes:
 * - Access Management (1 tool)
 * - Basic Claims Operations (6 tools)
 * - Dashboard Views (3 tools)
 * - Entity Lists (2 tools)
 */
export function registerClaimManagementTools(server: McpServer) {
  // TODO: Convert remaining tools to new MCP API format
  registerAccessManagementTools(server);
  // registerBasicClaimsTools(server);
  // registerDashboardTools(server);  
  // registerEntitiesTools(server);
}

// Export client for use in tools
export { createClaimManagementClient } from './client';