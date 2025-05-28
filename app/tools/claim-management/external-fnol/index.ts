import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerCreateExternalFnolToolClaimManagement } from './create-external-fnol';
import { registerStoreExternalFnolDocumentToolClaimManagement } from './store-document';

export function registerExternalFnolTools(server: McpServer) {
  registerCreateExternalFnolToolClaimManagement(server);
  registerStoreExternalFnolDocumentToolClaimManagement(server);
}
