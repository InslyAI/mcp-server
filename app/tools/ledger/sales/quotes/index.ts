/**
 * Sales Quotes Tools Registration
 * Tools for managing quotes in the sales system
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// Import individual registration functions
import { registerCalculateQuoteTools } from "./calculate-quote.js";
import { registerCopyQuoteTools } from "./copy-quote.js";
import { registerCreateQuoteTools } from "./create-quote.js";
import { registerGetQuoteTools } from "./get-quote.js";
import { registerIssueQuoteTools } from "./issue-quote.js";
import { registerUpdateQuoteTools } from "./update-quote.js";

/**
 * Register all quote management tools
 */
export function registerQuoteTools(server: McpServer) {
  registerCalculateQuoteTools(server);
  registerCopyQuoteTools(server);
  registerCreateQuoteTools(server);
  registerGetQuoteTools(server);
  registerIssueQuoteTools(server);
  registerUpdateQuoteTools(server);
}