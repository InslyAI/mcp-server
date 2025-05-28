import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerListClaimsToolClaimManagement } from './list-claims';
import { registerCreateClaimToolClaimManagement } from './create-claim';
import { registerGetClaimToolClaimManagement } from './get-claim';
import { registerUpdateClaimToolClaimManagement } from './update-claim';
import { registerGetAmountsToolClaimManagement } from './get-amounts';
import { registerGetEventsHistoryToolClaimManagement } from './get-events-history';

export function registerBasicClaimsTools(server: McpServer) {
  registerListClaimsToolClaimManagement(server);
  registerCreateClaimToolClaimManagement(server);
  registerGetClaimToolClaimManagement(server);
  registerUpdateClaimToolClaimManagement(server);
  registerGetAmountsToolClaimManagement(server);
  registerGetEventsHistoryToolClaimManagement(server);
}