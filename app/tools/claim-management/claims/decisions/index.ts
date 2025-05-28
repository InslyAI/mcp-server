import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerListDecisionsToolClaimManagement } from './list-decisions';
import { registerCreateDecisionToolClaimManagement } from './create-decision';
import { registerGetDecisionToolClaimManagement } from './get-decision';
import { registerUpdateDecisionToolClaimManagement } from './update-decision';
import { registerApproveDecisionToolClaimManagement } from './approve-decision';
import { registerRejectDecisionToolClaimManagement } from './reject-decision';

export function registerDecisionsTools(server: McpServer) {
  registerListDecisionsToolClaimManagement(server);
  registerCreateDecisionToolClaimManagement(server);
  registerGetDecisionToolClaimManagement(server);
  registerUpdateDecisionToolClaimManagement(server);
  registerApproveDecisionToolClaimManagement(server);
  registerRejectDecisionToolClaimManagement(server);
}
