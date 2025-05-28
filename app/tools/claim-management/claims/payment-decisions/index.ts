import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerListPaymentDecisionsToolClaimManagement } from './list-payment-decisions';
import { registerCreatePaymentDecisionToolClaimManagement } from './create-payment-decision';
import { registerGetPaymentDecisionToolClaimManagement } from './get-payment-decision';
import { registerApprovePaymentToolClaimManagement } from './approve-payment';
import { registerProcessPaymentToolClaimManagement } from './process-payment';

export function registerPaymentDecisionsTools(server: McpServer) {
  registerListPaymentDecisionsToolClaimManagement(server);
  registerCreatePaymentDecisionToolClaimManagement(server);
  registerGetPaymentDecisionToolClaimManagement(server);
  registerApprovePaymentToolClaimManagement(server);
  registerProcessPaymentToolClaimManagement(server);
}
