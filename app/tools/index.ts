import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerFormFlowTools } from "./formflow";

export function registerAllTools(server: McpServer) {
  registerFormFlowTools(server);
}