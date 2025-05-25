/**
 * Claims Tools Registration
 * Insurance claims management and processing tools
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerListClaimsTool } from "./list-claims";
import { registerCreateClaimTool } from "./create-claim";
import { registerGetClaimTool } from "./get-claim";
import { registerUpdateClaimTool } from "./update-claim";
import { registerProcessClaimTool } from "./process-claim";
import { registerSetClaimReserveTool } from "./set-claim-reserve";

/**
 * Register all Claims MCP tools
 * These tools handle insurance claims management, processing, and financial operations
 */
export function registerClaimsTools(server: McpServer) {
  registerListClaimsTool(server);
  registerCreateClaimTool(server);
  registerGetClaimTool(server);
  registerUpdateClaimTool(server);
  registerProcessClaimTool(server);
  registerSetClaimReserveTool(server);
}