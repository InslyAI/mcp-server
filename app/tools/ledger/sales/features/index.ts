/**
 * Sales Features Tools Registration
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { registerGetProductFeaturesTool } from "./get-product-features";
import { registerGetSpecificFeatureTool } from "./get-specific-feature";
import { registerGetTenantFeaturesTool } from "./get-tenant-features";
import { registerUpdateFeatureConfigTool } from "./update-feature-config";

export function registerFeatureConfigTools(server: McpServer) {
  registerGetProductFeaturesTool(server);
  registerGetSpecificFeatureTool(server);
  registerGetTenantFeaturesTool(server);
  registerUpdateFeatureConfigTool(server);
}