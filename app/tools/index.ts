import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerFormFlowTools } from "./formflow";
import { registerLedgerTools } from "./ledger";
import { registerIdentifierTools } from "./identifier";
import { registerClaimManagementTools } from "./claim-management";
import { registerSiteServiceTools } from "./site-service";

export function registerAllTools(server: McpServer) {
  registerFormFlowTools(server);
  registerLedgerTools(server);
  registerIdentifierTools(server);
  registerClaimManagementTools(server);
  registerSiteServiceTools(server);
}