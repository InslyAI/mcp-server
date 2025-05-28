import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerGenerateFnolLinkToolClaimManagement } from './generate-fnol-link';
import { registerGetFnolToolClaimManagement } from './get-fnol';
import { registerStoreClaimToolClaimManagement } from './store-claim';

export function registerFnolTools(server: McpServer) {
  registerGenerateFnolLinkToolClaimManagement(server);
  registerGetFnolToolClaimManagement(server);
  registerStoreClaimToolClaimManagement(server);
}
