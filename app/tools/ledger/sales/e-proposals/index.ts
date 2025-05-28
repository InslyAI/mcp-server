/**
 * Sales E-Proposals Tools Registration
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { registerApproveEProposalTool } from "./approve-e-proposal";
import { registerCreateEProposalTool } from "./create-e-proposal";
import { registerGetEProposalTool } from "./get-e-proposal";
import { registerListEProposalsTool } from "./list-e-proposals";
import { registerSubmitEProposalTool } from "./submit-e-proposal";
import { registerUpdateEProposalTool } from "./update-e-proposal";

export function registerEProposalTools(server: McpServer) {
  registerApproveEProposalTool(server);
  registerCreateEProposalTool(server);
  registerGetEProposalTool(server);
  registerListEProposalsTool(server);
  registerSubmitEProposalTool(server);
  registerUpdateEProposalTool(server);
}