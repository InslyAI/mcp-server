/**
 * Sales Binders Tools Registration
 * Tools for managing insurance binders in the sales system
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// Import individual registration functions
import { registerCreateBinderTools } from "./create-binder.js";
import { registerGetBinderTools } from "./get-binder.js";
import { registerGetBinderGroupsTools } from "./get-binder-groups.js";
import { registerLedgerListBinderNamesTool } from "./list-binder-names.js";
import { registerListBindersTools } from "./list-binders.js";
import { registerRenewBinderTools } from "./renew-binder.js";
import { registerUpdateBinderTools } from "./update-binder.js";

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