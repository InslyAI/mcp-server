/**
 * Sales Quotes Tools Registration
 * Tools for managing quotes in the sales system
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// Import individual registration functions
import { registerCalculateQuoteTools } from "./calculate-quote";
import { registerCopyQuoteTools } from "./copy-quote";
import { registerCreateQuoteTools } from "./create-quote";
import { registerGetQuoteTools } from "./get-quote";
import { registerIssueQuoteTools } from "./issue-quote";
import { registerUpdateQuoteTools } from "./update-quote";

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