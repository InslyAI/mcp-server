import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerListReservesToolClaimManagement } from './list-reserves';
import { registerCreateReserveToolClaimManagement } from './create-reserve';
import { registerUpdateReserveToolClaimManagement } from './update-reserve';
import { registerAuthorizeReserveToolClaimManagement } from './authorize-reserve';
import { registerGetReserveAmountsToolClaimManagement } from './get-reserve-amounts';
import { registerClearAllReservesToolClaimManagement } from './clear-all-reserves';
import { registerClearReserveToolClaimManagement } from './clear-reserve';
import { registerListReserveDecisionsToolClaimManagement } from './list-reserve-decisions';
import { registerCreateReserveDecisionToolClaimManagement } from './create-reserve-decision';

export function registerReservesTools(server: McpServer) {
  registerListReservesToolClaimManagement(server);
  registerCreateReserveToolClaimManagement(server);
  registerUpdateReserveToolClaimManagement(server);
  registerAuthorizeReserveToolClaimManagement(server);
  registerGetReserveAmountsToolClaimManagement(server);
  registerClearAllReservesToolClaimManagement(server);
  registerClearReserveToolClaimManagement(server);
  registerListReserveDecisionsToolClaimManagement(server);
  registerCreateReserveDecisionToolClaimManagement(server);
}
