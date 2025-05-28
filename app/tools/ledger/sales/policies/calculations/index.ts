/**
 * Sales Policies Calculations Tools Registration
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { registerCalculatePolicyDebugTool } from "./calculate-policy-debug";
import { registerCalculatePolicyTool } from "./calculate-policy";
import { registerCreatePolicyTool } from "./create-policy";
import { registerManagePolicyCalculationsTool } from "./manage-policy-calculations";
import { registerManagePolicyPackagesTool } from "./manage-policy-packages";

export function registerSalesPoliciesCalculationsTools(server: McpServer) {
  registerCalculatePolicyDebugTool(server);
  registerCalculatePolicyTool(server);
  registerCreatePolicyTool(server);
  registerManagePolicyCalculationsTool(server);
  registerManagePolicyPackagesTool(server);
}