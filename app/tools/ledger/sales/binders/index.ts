/**
 * Sales Binders Tools Registration
 * Tools for managing insurance binders in the sales system
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// Import individual registration functions
import { registerCreateBinderTools } from "./create-binder";
import { registerGetBinderTools } from "./get-binder";
import { registerGetBinderGroupsTools } from "./get-binder-groups";
import { registerLedgerListBinderNamesTool } from "./list-binder-names";
import { registerListBindersTools } from "./list-binders";
import { registerRenewBinderTools } from "./renew-binder";
import { registerUpdateBinderTools } from "./update-binder";

/**
 * Register all binder management tools
 */
export function registerBinderTools(server: McpServer) {
  registerCreateBinderTools(server);
  registerGetBinderTools(server);
  registerGetBinderGroupsTools(server);
  registerLedgerListBinderNamesTool(server);
  registerListBindersTools(server);
  registerRenewBinderTools(server);
  registerUpdateBinderTools(server);
}