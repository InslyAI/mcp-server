/**
 * Dashboard MCP Tools Registration
 * Business intelligence and reporting dashboard tools
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerQuotesInReferralTools } from "./quotes-in-referral";
import { registerQuotesRenewalTools } from "./quotes-renewal";
import { registerGetRenewalProductsTools } from "./get-renewal-products";
import { registerPoliciesRenewalTools } from "./policies-renewal";
import { registerGetPoliciesRenewalProductsTools } from "./get-policies-renewal-products";

/**
 * Register all Dashboard MCP tools
 */
export function registerDashboardTools(server: McpServer) {
  registerQuotesInReferralTools(server);
  registerQuotesRenewalTools(server);
  registerGetRenewalProductsTools(server);
  registerPoliciesRenewalTools(server);
  registerGetPoliciesRenewalProductsTools(server);
}