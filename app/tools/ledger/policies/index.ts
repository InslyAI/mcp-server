/**
 * Policy Management Tools Registration
 * Comprehensive insurance policy lifecycle management tools
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerSearchPoliciesTools } from "./search-policies";
import { registerGetPolicyTools } from "./get-policy";
import { registerGetPolicyHistoryTools } from "./get-policy-history";
import { registerTerminatePolicyTools } from "./terminate-policy";
import { registerRenewPolicyTools } from "./renew-policy";
import { registerGetBrokerEventsTools } from "./get-broker-events";
import { registerListPoliciesTool } from "./list-policies";
import { registerCreatePolicyTool } from "./create-policy";
import { registerUpdatePolicyTool } from "./update-policy";
import { registerCalculatePolicyTool } from "./calculate-policy";
import { registerBindPolicyTool } from "./bind-policy";
import { registerUnbindPolicyTool } from "./unbind-policy";
import { registerDeclinePolicyTool } from "./decline-policy";
import { registerCopyPolicyTool } from "./copy-policy";
import { registerCreateMtaTool } from "./create-mta";
import { registerGetPolicyLinksTool } from "./get-policy-links";
import { registerGetPolicyDocumentsTool } from "./get-policy-documents";
import { registerManagePolicyFilesTool } from "./manage-policy-files";
import { registerManagePolicyPackagesTool } from "./manage-policy-packages";
import { registerCalculatePolicyDebugTool } from "./calculate-policy-debug";
import { registerManagePolicyActionsTool } from "./manage-policy-actions";
import { registerSendPolicyEmailTool } from "./send-policy-email";
import { registerGetPolicyCustomerTool } from "./get-policy-customer";
import { registerCreateExternalPolicyTool } from "./create-external-policy";
import { registerManagePolicyCalculationsTool } from "./manage-policy-calculations";
import { registerGetInstallmentsScheduleTool } from "./get-installments-schedule";
import { registerGetPolicyChangesTool } from "./get-policy-changes";
import { registerImportPolicyDataTool } from "./import-policy-data";
import { registerManagePolicyEventsTool } from "./manage-policy-events";
import { registerManagePolicyReferralsTool } from "./manage-policy-referrals";
import { registerIssuePolicyTool } from "./issue-policy";
import { registerCreateEProposalTool } from "./create-e-proposal";

/**
 * Register all Policy Management MCP tools
 * These tools handle complete policy lifecycle from creation to termination
 */
export function registerPolicyTools(server: McpServer) {
  // Existing tools (6 tools)
  registerSearchPoliciesTools(server);
  registerGetPolicyTools(server);
  registerGetPolicyHistoryTools(server);
  registerTerminatePolicyTools(server);
  registerRenewPolicyTools(server);
  registerGetBrokerEventsTools(server);
  
  // Core policy management tools (10 tools)
  registerListPoliciesTool(server);
  registerCreatePolicyTool(server);
  registerUpdatePolicyTool(server);
  registerCalculatePolicyTool(server);
  registerBindPolicyTool(server);
  registerUnbindPolicyTool(server);
  registerDeclinePolicyTool(server);
  registerCopyPolicyTool(server);
  registerCreateMtaTool(server);
  registerGetPolicyLinksTool(server);
  
  // Advanced policy operations (17 tools)
  registerGetPolicyDocumentsTool(server);
  registerManagePolicyFilesTool(server);
  registerManagePolicyPackagesTool(server);
  registerCalculatePolicyDebugTool(server);
  registerManagePolicyActionsTool(server);
  registerSendPolicyEmailTool(server);
  registerGetPolicyCustomerTool(server);
  registerCreateExternalPolicyTool(server);
  registerManagePolicyCalculationsTool(server);
  registerGetInstallmentsScheduleTool(server);
  registerGetPolicyChangesTool(server);
  registerImportPolicyDataTool(server);
  registerManagePolicyEventsTool(server);
  registerManagePolicyReferralsTool(server);
  registerIssuePolicyTool(server);
  registerCreateEProposalTool(server);
}