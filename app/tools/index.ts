import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerFormFlowTools } from "./formflow";
import { registerLedgerTools } from "./ledger";
import { registerIdentifierTools } from "./identifier";

export function registerAllTools(server: McpServer) {
  registerFormFlowTools(server);
  registerLedgerTools(server);
  registerIdentifierTools(server);
}