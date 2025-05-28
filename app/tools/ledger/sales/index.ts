/**
 * Sales Tools Index
 * Registers all sales-related MCP tools for the Ledger service
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// Import existing registration functions from moved tools
import { registerBinderTools } from "./binders/index";
import { registerQuoteTools } from "./quotes/index";
import { registerEndorsementTools } from "./endorsements/index";
import { registerEProposalTools } from "./e-proposals/index";
import { registerFeatureConfigTools } from "./features/index";
import { registerHighRiskTools } from "./high-risk/index";
import { registerLookupServicesTools } from "./ireland-lookup/index";
import { registerSalesPoliciesTools } from "./policies/index";

export function registerSalesTools(server: McpServer) {
  // Register all sales tools
  registerBinderTools(server);
  registerQuoteTools(server);
  registerEndorsementTools(server);
  registerEProposalTools(server);
  registerFeatureConfigTools(server);
  registerHighRiskTools(server);
  registerLookupServicesTools(server);
  registerSalesPoliciesTools(server);
}