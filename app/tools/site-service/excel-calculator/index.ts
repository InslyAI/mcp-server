import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerGetExcelCalculatorsTool } from "./get-calculators";

export function registerExcelCalculatorTools(server: McpServer) {
  registerGetExcelCalculatorsTool(server);
}