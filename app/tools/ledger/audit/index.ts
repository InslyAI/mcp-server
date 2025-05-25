/**
 * Audit Tools Registration
 * Compliance monitoring and audit trail tools
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerListAuditLogsTool } from "./list-audit-logs";
import { registerCreateAuditEntryTool } from "./create-audit-entry";
import { registerGetComplianceReportTool } from "./get-compliance-report";
import { registerTrackDataAccessTool } from "./track-data-access";

/**
 * Register all Audit MCP tools
 * These tools handle compliance monitoring, audit trails, and regulatory reporting
 */
export function registerAuditTools(server: McpServer) {
  registerListAuditLogsTool(server);
  registerCreateAuditEntryTool(server);
  registerGetComplianceReportTool(server);
  registerTrackDataAccessTool(server);
}