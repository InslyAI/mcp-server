import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerGetTenantBrokerFeatureTool } from "./get-tenant-broker-feature";
import { registerGetTenantFeaturesTool } from "./get-tenant-features";
import { registerUpdateTenantFeaturesTool } from "./update-tenant-features";
import { registerGetTenantFeatureTool } from "./get-tenant-feature";
import { registerGetPublicFeaturesTool } from "./get-public-features";

export function registerFeaturesTools(server: McpServer) {
  registerGetTenantBrokerFeatureTool(server);
  registerGetTenantFeaturesTool(server);
  registerUpdateTenantFeaturesTool(server);
  registerGetTenantFeatureTool(server);
  registerGetPublicFeaturesTool(server);
}