/**
 * E-proposal Tools Registration
 * Electronic proposal workflow and management tools
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerCreateEProposalTool } from "./create-e-proposal";
import { registerGetEProposalTool } from "./get-e-proposal";
import { registerUpdateEProposalTool } from "./update-e-proposal";
import { registerSubmitEProposalTool } from "./submit-e-proposal";
import { registerApproveEProposalTool } from "./approve-e-proposal";
import { registerListEProposalsTool } from "./list-e-proposals";

/**
 * Register all E-proposal MCP tools
 * These tools handle electronic proposal workflow and underwriting management
 */
export function registerEProposalTools(server: McpServer) {
  registerCreateEProposalTool(server);
  registerGetEProposalTool(server);
  registerUpdateEProposalTool(server);
  registerSubmitEProposalTool(server);
  registerApproveEProposalTool(server);
  registerListEProposalsTool(server);
}