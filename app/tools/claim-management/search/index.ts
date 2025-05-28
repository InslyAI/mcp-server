import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerSearchClaimsToolClaimManagement } from './search-claims';
import { registerLookupDataToolClaimManagement } from './lookup-data';
import { registerCustomersAutocompleteToolClaimManagement } from './customers-autocomplete';

export function registerSearchTools(server: McpServer) {
  registerSearchClaimsToolClaimManagement(server);
  registerLookupDataToolClaimManagement(server);
  registerCustomersAutocompleteToolClaimManagement(server);
}
