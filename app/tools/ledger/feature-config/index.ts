/**
 * Feature Configuration Tools Registration
 * Platform feature management and customization
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerGetProductFeaturesTool } from './get-product-features';
import { registerGetTenantFeaturesTool } from './get-tenant-features';
import { registerGetSpecificFeatureTool } from './get-specific-feature';
import { registerUpdateFeatureConfigTool } from './update-feature-config';

export function registerFeatureConfigTools(server: McpServer) {
  registerGetProductFeaturesTool(server);
  registerGetTenantFeaturesTool(server);
  registerGetSpecificFeatureTool(server);
  registerUpdateFeatureConfigTool(server);
}