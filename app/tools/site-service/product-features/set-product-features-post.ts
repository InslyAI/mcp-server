import { createSiteServiceClient } from "../client";
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerSetProductFeaturesPostTool(server: McpServer) {
  server.tool(
    "site_service_product_features_schema_create",
    "Create tenant product features for specific schema using POST method",
    {
      bearerToken: z.string().min(1).describe("JWT bearer token from identifier_login"),
      tenantId: z.string().min(1).describe("Tenant identifier for API access"),
      tenantTag: z.string().min(1).describe("Tenant tag identifier"),
      schemaName: z.string().min(1).describe("Schema name to create product features for"),
      features: z.record(z.any()).describe("Product features configuration object")
    },
    async ({ bearerToken, tenantId, tenantTag, schemaName, features }) => {
      try {
        const client = createSiteServiceClient(bearerToken, tenantId);
        const data = await client.post(`/api/v1/sites/product-features/${tenantTag}/${schemaName}`, features);
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({ 
              success: true, 
              data,
              message: `Created product features for schema '${schemaName}' in tenant '${tenantTag}'`
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
              details: `Failed to create product features for schema '${schemaName}' in tenant '${tenantTag}'`
            }, null, 2)
          }]
        };
      }
    }
  );
}