/**
 * Excel Calculator Tools Registration
 * Excel-based calculation tool management
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerUploadExcelCalculatorTool } from './upload-calculator';
import { registerDebugCalculationApiTool } from './debug-calculation-api';

export function registerExcelCalculatorTools(server: McpServer) {
  registerUploadExcelCalculatorTool(server);
  registerDebugCalculationApiTool(server);
}