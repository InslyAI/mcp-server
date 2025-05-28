/**
 * Sales Policies Information Tools Registration
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { registerGetBrokerEventsTools } from "./get-broker-events";
import { registerGetInstallmentsScheduleTool } from "./get-installments-schedule";
import { registerGetPolicyChangesTool } from "./get-policy-changes";
import { registerGetPolicyCustomerTool } from "./get-policy-customer";
import { registerGetPolicyHistoryTools } from "./get-policy-history";
import { registerGetPolicyLinksTool } from "./get-policy-links";
import { registerGetPolicyTools } from "./get-policy";
import { registerListPoliciesTool } from "./list-policies";
import { registerManagePolicyActionsTool } from "./manage-policy-actions";
import { registerManagePolicyEventsTool } from "./manage-policy-events";
import { registerSearchPoliciesTools } from "./search-policies";
import { registerUpdatePolicyTool } from "./update-policy";

export function registerSalesPoliciesInformationTools(server: McpServer) {
  registerGetBrokerEventsTools(server);
  registerGetInstallmentsScheduleTool(server);
  registerGetPolicyChangesTool(server);
  registerGetPolicyCustomerTool(server);
  registerGetPolicyHistoryTools(server);
  registerGetPolicyLinksTool(server);
  registerGetPolicyTools(server);
  registerListPoliciesTool(server);
  registerManagePolicyActionsTool(server);
  registerManagePolicyEventsTool(server);
  registerSearchPoliciesTools(server);
  registerUpdatePolicyTool(server);
}