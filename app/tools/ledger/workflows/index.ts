/**
 * Workflow Tools Registration
 * Business process automation and workflow management tools
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerCreateWorkflowTool } from "./create-workflow";
import { registerListWorkflowsTool } from "./list-workflows";
import { registerExecuteWorkflowTool } from "./execute-workflow";
import { registerMonitorWorkflowTool } from "./monitor-workflow";

/**
 * Register all Workflow MCP tools
 * These tools handle business process automation, workflow execution, and monitoring
 */
export function registerWorkflowTools(server: McpServer) {
  registerCreateWorkflowTool(server);
  registerListWorkflowsTool(server);
  registerExecuteWorkflowTool(server);
  registerMonitorWorkflowTool(server);
}