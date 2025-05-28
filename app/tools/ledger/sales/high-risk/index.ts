/**
 * Sales High-Risk Tools Registration
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { registerCreateHighRiskCaseTool } from "./create-high-risk-case";
import { registerEscalateHighRiskCaseTool } from "./escalate-high-risk-case";
import { registerGetHighRiskCaseTool } from "./get-high-risk-case";
import { registerListHighRiskCasesTool } from "./list-high-risk-cases";
import { registerUpdateHighRiskCaseTool } from "./update-high-risk-case";

export function registerHighRiskTools(server: McpServer) {
  registerCreateHighRiskCaseTool(server);
  registerEscalateHighRiskCaseTool(server);
  registerGetHighRiskCaseTool(server);
  registerListHighRiskCasesTool(server);
  registerUpdateHighRiskCaseTool(server);
}