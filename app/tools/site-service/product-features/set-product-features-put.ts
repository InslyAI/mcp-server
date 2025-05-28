import { createSiteServiceClient } from "../client";
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerSetProductFeaturesPutTool(server: McpServer) {
  server.tool(
    "site_service_product_features_schema_update",
    "Update tenant product features for specific schema using PUT method",
    {
      bearerToken: z.string().min(1).describe("JWT bearer token from identifier_login"),
      tenantId: z.string().min(1).describe("Tenant identifier for API access"),
      tenantTag: z.string().min(1).describe("Tenant tag identifier"),
      schemaName: z.string().min(1).describe("Schema name to update product features for"),
      features: z.record(z.any()).describe("Product features configuration object")
    },
    async ({ bearerToken, tenantId, tenantTag, schemaName, features }) => {
      try {
        const client = createSiteServiceClient(bearerToken, tenantId);
        const data = await client.put(`/api/v1/sites/product-features/${tenantTag}/${schemaName}`, features);
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({ 
              success: true, 
              data,
              message: `Updated product features for schema '${schemaName}' in tenant '${tenantTag}'`
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
              details: `Failed to update product features for schema '${schemaName}' in tenant '${tenantTag}'`
            }, null, 2)
          }]
        };
      }
    }
  );
}