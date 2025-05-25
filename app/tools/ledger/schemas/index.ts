/**
 * Schema MCP Tools Registration
 * JSON Schema and validation tools for Insly products
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerGetSchemaTools } from "./get-schema";
import { registerGetRenewalSchemaTools } from "./get-renewal-schema";
import { registerGetSchemaUITools } from "./get-schema-ui";
import { registerGetFeatureSchemaTools } from "./get-feature-schema";
import { registerUploadCalculatorTools } from "./upload-calculator";

/**
 * Register all Schema MCP tools
 */
export function registerSchemaTools(server: McpServer) {
  registerGetSchemaTools(server);
  registerGetRenewalSchemaTools(server);
  registerGetSchemaUITools(server);
  registerGetFeatureSchemaTools(server); // Registers 2 tools: feature schema + feature UI schema
  registerUploadCalculatorTools(server);
}