import { createSiteServiceClient } from "../client";
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerCheckSchemaTypeFeaturesTools(server: McpServer) {
  server.tool(
    "site_service_scheme_features_schema_type_check",
    "Check which features are enabled for specific schema type",
    {
      bearerToken: z.string().min(1).describe("JWT bearer token from identifier_login"),
      tenantId: z.string().min(1).describe("Tenant identifier for API access"),
      tenantTag: z.string().min(1).describe("Tenant tag identifier"),
      schemaType: z.string().min(1).describe("Schema type to check features for")
    },
    async ({ bearerToken, tenantId, tenantTag, schemaType }) => {
      try {
        const client = createSiteServiceClient(bearerToken, tenantId);
        const data = await client.get(`/api/v1/sites/scheme-features/${tenantTag}/${schemaType}`);
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({ 
              success: true, 
              data,
              message: `Retrieved enabled features for schema type '${schemaType}' in tenant '${tenantTag}'`
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
              details: `Failed to check features for schema type '${schemaType}' in tenant '${tenantTag}'`
            }, null, 2)
          }]
        };
      }
    }
  );
}