import { createSiteServiceClient } from "../client";
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerGetProductFeaturesForSchemaTool(server: McpServer) {
  server.tool(
    "site_service_product_features_schema_get",
    "Get tenant product features for specific product schema",
    {
      bearerToken: z.string().min(1).describe("JWT bearer token from identifier_login"),
      tenantId: z.string().min(1).describe("Tenant identifier for API access"),
      tenantTag: z.string().min(1).describe("Tenant tag identifier"),
      schemaName: z.string().min(1).describe("Schema name to get product features for")
    },
    async ({ bearerToken, tenantId, tenantTag, schemaName }) => {
      try {
        const client = createSiteServiceClient(bearerToken, tenantId);
        const data = await client.get(`/api/v1/sites/product-features/${tenantTag}/${schemaName}`);
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({ 
              success: true, 
              data,
              message: `Retrieved product features for schema '${schemaName}' in tenant '${tenantTag}'`
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
              details: `Failed to get product features for schema '${schemaName}' in tenant '${tenantTag}'`
            }, null, 2)
          }]
        };
      }
    }
  );
}