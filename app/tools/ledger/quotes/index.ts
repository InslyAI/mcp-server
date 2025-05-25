/**
 * Quote MCP Tools Registration
 * Insurance quote management tools
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerCreateQuoteTools } from "./create-quote";
import { registerGetQuoteTools } from "./get-quote";
import { registerUpdateQuoteTools } from "./update-quote";
import { registerCalculateQuoteTools } from "./calculate-quote";
import { registerIssueQuoteTools } from "./issue-quote";
import { registerCopyQuoteTools } from "./copy-quote";

/**
 * Register all Quote MCP tools
 */
export function registerQuoteTools(server: McpServer) {
  registerCreateQuoteTools(server);
  registerGetQuoteTools(server);
  registerUpdateQuoteTools(server);
  registerCalculateQuoteTools(server);
  registerIssueQuoteTools(server);
  registerCopyQuoteTools(server);
}