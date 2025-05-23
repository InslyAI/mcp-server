import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerEchoTool } from "./echo";
import { registerCalculatorTool } from "./calculator";

export function registerAllTools(server: McpServer) {
  registerEchoTool(server);
  registerCalculatorTool(server);
}