/**
 * Sales Policies Referrals Tools Registration
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { registerCreateEProposalTool } from "./create-e-proposal";
import { registerManagePolicyReferralsTool } from "./manage-policy-referrals";

export function registerSalesPoliciesReferralsTools(server: McpServer) {
  registerCreateEProposalTool(server);
  registerManagePolicyReferralsTool(server);
}