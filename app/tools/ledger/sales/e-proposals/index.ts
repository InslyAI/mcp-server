/**
 * Sales E-Proposals Tools Registration
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { registerApproveEProposalTool } from "./approve-e-proposal.js";
import { registerCreateEProposalTool } from "./create-e-proposal.js";
import { registerGetEProposalTool } from "./get-e-proposal.js";
import { registerListEProposalsTool } from "./list-e-proposals.js";
import { registerSubmitEProposalTool } from "./submit-e-proposal.js";
import { registerUpdateEProposalTool } from "./update-e-proposal.js";

export function registerEProposalTools(server: McpServer) {
  registerApproveEProposalTool(server);
  registerCreateEProposalTool(server);
  registerGetEProposalTool(server);
  registerListEProposalsTool(server);
  registerSubmitEProposalTool(server);
  registerUpdateEProposalTool(server);
}