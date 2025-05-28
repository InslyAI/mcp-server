/**
 * Sales Endorsements Tools Registration
 * Tools for managing endorsements in the sales system
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// Import individual registration functions
import { registerCalculateEndorsementTool } from "./calculate-endorsement";
import { registerCreateEndorsementTool } from "./create-endorsement";
import { registerGetEndorsementTool } from "./get-endorsement";
import { registerIssueEndorsementTool } from "./issue-endorsement";
import { registerListEndorsementsTool } from "./list-endorsements";
import { registerUpdateEndorsementTool } from "./update-endorsement";

/**
 * Register all endorsement management tools
 */
export function registerEndorsementTools(server: McpServer) {
  registerCalculateEndorsementTool(server);
  registerCreateEndorsementTool(server);
  registerGetEndorsementTool(server);
  registerIssueEndorsementTool(server);
  registerListEndorsementsTool(server);
  registerUpdateEndorsementTool(server);
}