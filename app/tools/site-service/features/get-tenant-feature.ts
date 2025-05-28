import { createSiteServiceClient } from "../client";
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerGetTenantFeatureTool(server: McpServer) {
  server.tool(
    "site_service_features_tenant_feature_get",
    "Get specific tenant feature configuration. If no auth token provided, only publicly available features can be shown",
    {
      bearerToken: z.string().min(1).describe("JWT bearer token from identifier_login"),
      tenantId: z.string().min(1).describe("Tenant identifier for API access"),
      tenantTag: z.string().min(1).describe("Tenant tag identifier"),
      featureName: z.string().min(1).describe("Name of the specific feature to retrieve")
    },
    async ({ bearerToken, tenantId, tenantTag, featureName }) => {
      try {
        const client = createSiteServiceClient(bearerToken, tenantId);
        const data = await client.get(`/api/v1/sites/features/${tenantTag}/${featureName}`);
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({ 
              success: true, 
              data,
              message: `Retrieved feature '${featureName}' configuration for tenant '${tenantTag}'`
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
              details: `Failed to get feature '${featureName}' for tenant '${tenantTag}'`
            }, null, 2)
          }]
        };
      }
    }
  );
}