import { createSiteServiceClient } from "../client";
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerUpdateSpecificProductFeatureTool(server: McpServer) {
  server.tool(
    "site_service_product_features_feature_update",
    "Update specific product feature configuration",
    {
      bearerToken: z.string().min(1).describe("JWT bearer token from identifier_login"),
      tenantId: z.string().min(1).describe("Tenant identifier for API access"),
      tenantTag: z.string().min(1).describe("Tenant tag identifier"),
      schemaName: z.string().min(1).describe("Schema name for the product feature"),
      featureName: z.string().min(1).describe("Name of the specific feature to update"),
      config: z.record(z.any()).describe("Feature configuration object to update")
    },
    async ({ bearerToken, tenantId, tenantTag, schemaName, featureName, config }) => {
      try {
        const client = createSiteServiceClient(bearerToken, tenantId);
        const data = await client.put(`/api/v1/sites/product-features/${tenantTag}/${schemaName}/${featureName}`, config);
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({ 
              success: true, 
              data,
              message: `Updated product feature '${featureName}' for schema '${schemaName}' in tenant '${tenantTag}'`
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
              details: `Failed to update product feature '${featureName}' for schema '${schemaName}' in tenant '${tenantTag}'`
            }, null, 2)
          }]
        };
      }
    }
  );
}