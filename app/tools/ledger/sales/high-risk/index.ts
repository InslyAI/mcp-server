/**
 * Sales High-Risk Tools Registration
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { registerCreateHighRiskCaseTool } from "./create-high-risk-case.js";
import { registerEscalateHighRiskCaseTool } from "./escalate-high-risk-case.js";
import { registerGetHighRiskCaseTool } from "./get-high-risk-case.js";
import { registerListHighRiskCasesTool } from "./list-high-risk-cases.js";
import { registerUpdateHighRiskCaseTool } from "./update-high-risk-case.js";

export function registerHighRiskTools(server: McpServer) {
  registerCreateHighRiskCaseTool(server);
  registerEscalateHighRiskCaseTool(server);
  registerGetHighRiskCaseTool(server);
  registerListHighRiskCasesTool(server);
  registerUpdateHighRiskCaseTool(server);
}