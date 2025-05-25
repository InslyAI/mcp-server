/**
 * Binder MCP Tools Registration
 * Insurance binder management tools
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerLedgerListBinderNamesTool } from "./list-binder-names";
import { registerListBindersTools } from "./list-binders";
import { registerCreateBinderTools } from "./create-binder";
import { registerGetBinderTools } from "./get-binder";
import { registerUpdateBinderTools } from "./update-binder";
import { registerRenewBinderTools } from "./renew-binder";
import { registerGetBinderGroupsTools } from "./get-binder-groups";

/**
 * Register all Binder MCP tools
 */
export function registerBinderTools(server: McpServer) {
  registerLedgerListBinderNamesTool(server);
  registerListBindersTools(server);
  registerCreateBinderTools(server);
  registerGetBinderTools(server);
  registerUpdateBinderTools(server);
  registerRenewBinderTools(server);
  registerGetBinderGroupsTools(server);
}