/**
 * Sales Policies Tools Index
 * Registers all sales policies-related MCP tools
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// Import all sales policies subdirectory registration functions
import { registerSalesPoliciesDocumentsTools } from "./documents/index";
import { registerSalesPoliciesCalculationsTools } from "./calculations/index";
import { registerSalesPoliciesLifecycleTools } from "./lifecycle/index";
import { registerSalesPoliciesInformationTools } from "./information/index";
import { registerSalesPoliciesReferralsTools } from "./referrals/index";

export function registerSalesPoliciesTools(server: McpServer) {
  registerSalesPoliciesDocumentsTools(server);
  registerSalesPoliciesCalculationsTools(server);
  registerSalesPoliciesLifecycleTools(server);
  registerSalesPoliciesInformationTools(server);
  registerSalesPoliciesReferralsTools(server);
}