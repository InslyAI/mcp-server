import { createSiteServiceClient } from "../client";
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerGetSpecificProductFeatureTool(server: McpServer) {
  server.tool(
    "site_service_product_features_feature_get",
    "Get specific product feature configuration",
    {
      bearerToken: z.string().min(1).describe("JWT bearer token from identifier_login"),
      tenantId: z.string().min(1).describe("Tenant identifier for API access"),
      tenantTag: z.string().min(1).describe("Tenant tag identifier"),
      schemaName: z.string().min(1).describe("Schema name for the product feature"),
      featureName: z.string().min(1).describe("Name of the specific feature to retrieve")
    },
    async ({ bearerToken, tenantId, tenantTag, schemaName, featureName }) => {
      try {
        const client = createSiteServiceClient(bearerToken, tenantId);
        const data = await client.get(`/api/v1/sites/product-features/${tenantTag}/${schemaName}/${featureName}`);
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({ 
              success: true, 
              data,
              message: `Retrieved product feature '${featureName}' for schema '${schemaName}' in tenant '${tenantTag}'`
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
              details: `Failed to get product feature '${featureName}' for schema '${schemaName}' in tenant '${tenantTag}'`
            }, null, 2)
          }]
        };
      }
    }
  );
}