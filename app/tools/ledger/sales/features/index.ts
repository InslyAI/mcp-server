/**
 * Sales Features Tools Registration
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { registerGetProductFeaturesTool } from "./get-product-features.js";
import { registerGetSpecificFeatureTool } from "./get-specific-feature.js";
import { registerGetTenantFeaturesTool } from "./get-tenant-features.js";
import { registerUpdateFeatureConfigTool } from "./update-feature-config.js";

export function registerFeatureConfigTools(server: McpServer) {
  registerGetProductFeaturesTool(server);
  registerGetSpecificFeatureTool(server);
  registerGetTenantFeaturesTool(server);
  registerUpdateFeatureConfigTool(server);
}