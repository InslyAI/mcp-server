import { createSiteServiceClient } from "../client";
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerUpdateTenantFeaturesTool(server: McpServer) {
  server.tool(
    "site_service_features_tenant_update",
    "Update tenant features configuration",
    {
      bearerToken: z.string().min(1).describe("JWT bearer token from identifier_login"),
      tenantId: z.string().min(1).describe("Tenant identifier for API access"),
      tenantTag: z.string().min(1).describe("Tenant tag identifier"),
      features: z.record(z.any()).describe("Features configuration object to update")
    },
    async ({ bearerToken, tenantId, tenantTag, features }) => {
      try {
        const client = createSiteServiceClient(bearerToken, tenantId);
        const data = await client.put(`/api/v1/sites/features/${tenantTag}`, features);
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({ 
              success: true, 
              data,
              message: `Updated features configuration for tenant '${tenantTag}'`
            }, null, 2)
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: JSON.stringify({ 
              success: false, 
              error: error instanceof Error ? error.message : 'Unknown error',
              details: `Failed to update tenant features for '${tenantTag}'`
            }, null, 2)
          }]
        };
      }
    }
  );
}