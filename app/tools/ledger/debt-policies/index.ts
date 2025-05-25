/**
 * Debt Policies Management Tools Registration
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerListDebtPoliciesTool } from './list-debt-policies';

export function registerDebtPolicyTools(server: McpServer) {
  registerListDebtPoliciesTool(server);
}