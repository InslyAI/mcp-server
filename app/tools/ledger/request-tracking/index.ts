/**
 * Request Tracking Tools Registration
 * Async operation and request status monitoring
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerGetRequestStatusTool } from './get-request-status';

export function registerRequestTrackingTools(server: McpServer) {
  registerGetRequestStatusTool(server);
}