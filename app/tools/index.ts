import type { McpServer } from "@vercel/mcp-adapter";
import { registerEchoTool } from "./echo";
import { registerCalculatorTool } from "./calculator";

export function registerAllTools(server: McpServer) {
  registerEchoTool(server);
  registerCalculatorTool(server);
}