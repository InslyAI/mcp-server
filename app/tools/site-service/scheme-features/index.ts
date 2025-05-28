import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerGetSchemeFeaturesTool } from "./get-scheme-features";
import { registerSaveSchemeFeaturesTool } from "./save-scheme-features";
import { registerCheckSchemaTypeFeaturesTools } from "./check-schema-type-features";
import { registerGetSchemeFeatureTool } from "./get-scheme-feature";
import { registerSetSchemeFeatureTool } from "./set-scheme-feature";

export function registerSchemeFeaturesTools(server: McpServer) {
  registerGetSchemeFeaturesTool(server);
  registerSaveSchemeFeaturesTool(server);
  registerCheckSchemaTypeFeaturesTools(server);
  registerGetSchemeFeatureTool(server);
  registerSetSchemeFeatureTool(server);
}