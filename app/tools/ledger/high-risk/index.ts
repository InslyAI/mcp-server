/**
 * High Risk Tools Registration
 * High-risk case management and escalation tools
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerListHighRiskCasesTool } from "./list-high-risk-cases";
import { registerCreateHighRiskCaseTool } from "./create-high-risk-case";
import { registerGetHighRiskCaseTool } from "./get-high-risk-case";
import { registerUpdateHighRiskCaseTool } from "./update-high-risk-case";
import { registerEscalateHighRiskCaseTool } from "./escalate-high-risk-case";

/**
 * Register all High Risk MCP tools
 * These tools handle high-risk case management and escalation workflows
 */
export function registerHighRiskTools(server: McpServer) {
  registerListHighRiskCasesTool(server);
  registerCreateHighRiskCaseTool(server);
  registerGetHighRiskCaseTool(server);
  registerUpdateHighRiskCaseTool(server);
  registerEscalateHighRiskCaseTool(server);
}