/**
 * Policy MCP Tools Registration
 * Insurance policy management tools
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerSearchPoliciesTools } from "./search-policies";
import { registerGetPolicyTools } from "./get-policy";
import { registerGetPolicyHistoryTools } from "./get-policy-history";
import { registerTerminatePolicyTools } from "./terminate-policy";
import { registerRenewPolicyTools } from "./renew-policy";
import { registerGetBrokerEventsTools } from "./get-broker-events";

/**
 * Register all Policy MCP tools
 */
export function registerPolicyTools(server: McpServer) {
  registerSearchPoliciesTools(server);
  registerGetPolicyTools(server);
  registerGetPolicyHistoryTools(server);
  registerTerminatePolicyTools(server);
  registerRenewPolicyTools(server);
  registerGetBrokerEventsTools(server);
}