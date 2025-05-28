/**
 * Sales Endorsements Tools Registration
 * Tools for managing endorsements in the sales system
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// Import individual registration functions
import { registerCalculateEndorsementTool } from "./calculate-endorsement.js";
import { registerCreateEndorsementTool } from "./create-endorsement.js";
import { registerGetEndorsementTool } from "./get-endorsement.js";
import { registerIssueEndorsementTool } from "./issue-endorsement.js";
import { registerListEndorsementsTool } from "./list-endorsements.js";
import { registerUpdateEndorsementTool } from "./update-endorsement.js";

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