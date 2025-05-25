/**
 * Reports Tools Registration
 * Business reporting and analytics tools
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerGenerateReportTool } from "./generate-report";
import { registerListReportsTool } from "./list-reports";
import { registerGetReportTool } from "./get-report";
import { registerScheduleReportTool } from "./schedule-report";
import { registerDeleteReportTool } from "./delete-report";

/**
 * Register all Reports MCP tools
 * These tools handle business reporting, analytics, and scheduled report generation
 */
export function registerReportTools(server: McpServer) {
  registerGenerateReportTool(server);
  registerListReportsTool(server);
  registerGetReportTool(server);
  registerScheduleReportTool(server);
  registerDeleteReportTool(server);
}