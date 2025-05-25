/**
 * Endorsement Tools Registration
 * Policy modification and endorsement management tools
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerCreateEndorsementTool } from "./create-endorsement";
import { registerGetEndorsementTool } from "./get-endorsement";
import { registerUpdateEndorsementTool } from "./update-endorsement";
import { registerCalculateEndorsementTool } from "./calculate-endorsement";
import { registerIssueEndorsementTool } from "./issue-endorsement";
import { registerListEndorsementsTool } from "./list-endorsements";

/**
 * Register all Endorsement MCP tools
 * These tools handle policy modifications and endorsement workflow
 */
export function registerEndorsementTools(server: McpServer) {
  registerCreateEndorsementTool(server);
  registerGetEndorsementTool(server);
  registerUpdateEndorsementTool(server);
  registerCalculateEndorsementTool(server);
  registerIssueEndorsementTool(server);
  registerListEndorsementsTool(server);
}