/**
 * Sales Policies Lifecycle Tools Registration
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { registerBindPolicyTool } from "./bind-policy";
import { registerCopyPolicyTool } from "./copy-policy";
import { registerCreateExternalPolicyTool } from "./create-external-policy";
import { registerCreateMtaTool } from "./create-mta";
import { registerDeclinePolicyTool } from "./decline-policy";
import { registerIssuePolicyTool } from "./issue-policy";
import { registerRenewPolicyTools } from "./renew-policy";
import { registerTerminatePolicyTools } from "./terminate-policy";
import { registerUnbindPolicyTool } from "./unbind-policy";

export function registerSalesPoliciesLifecycleTools(server: McpServer) {
  registerBindPolicyTool(server);
  registerCopyPolicyTool(server);
  registerCreateExternalPolicyTool(server);
  registerCreateMtaTool(server);
  registerDeclinePolicyTool(server);
  registerIssuePolicyTool(server);
  registerRenewPolicyTools(server);
  registerTerminatePolicyTools(server);
  registerUnbindPolicyTool(server);
}