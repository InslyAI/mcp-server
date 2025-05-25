/**
 * High-Risk Data Management Tools
 * Complete high-risk data management functionality
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerManageHighRiskDataTool } from "./manage-high-risk-data";

export function registerHighRiskDataTools(server: McpServer) {
  registerManageHighRiskDataTool(server);
}

// Export individual registration functions
export { registerManageHighRiskDataTool };