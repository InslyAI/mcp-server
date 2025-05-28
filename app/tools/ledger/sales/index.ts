/**
 * Sales Tools Index
 * Registers all sales-related MCP tools for the Ledger service
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// Import existing registration functions from moved tools
import { registerBinderTools } from "./binders/index.js";

// TODO: Add other sales tools after fixing import issues
// import { registerQuoteTools } from "./quotes/index.js";
// import { registerEndorsementTools } from "./endorsements/index.js";
// import { registerEProposalTools } from "./e-proposals/index.js";
// import { registerFeatureConfigTools } from "./features/index.js";
// import { registerHighRiskTools } from "./high-risk/index.js";
// import { registerLookupServicesTools } from "./ireland-lookup/index.js";

export function registerSalesTools(server: McpServer) {
  // Register sales tools (starting with binders)
  registerBinderTools(server);
  
  // TODO: Add other sales tools after fixing import issues
}