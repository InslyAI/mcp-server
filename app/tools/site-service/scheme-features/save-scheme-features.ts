import { createSiteServiceClient } from "../client";
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerSaveSchemeFeaturesTool(server: McpServer) {
  server.tool(
    "site_service_scheme_features_save",
    "Save scheme features - internal purposes only, used by deploy automation tool",
    {
      bearerToken: z.string().min(1).describe("JWT bearer token from identifier_login"),
      tenantId: z.string().min(1).describe("Tenant identifier for API access"),
      tenantTag: z.string().min(1).describe("Tenant tag identifier"),
      schemaType: z.string().min(1).describe("Schema type for the scheme features"),
      schemaName: z.string().min(1).describe("Schema name for the scheme features"),
      features: z.record(z.any()).describe("Scheme features configuration object (e.g., autocomplete settings)")
    },
    async ({ bearerToken, tenantId, tenantTag, schemaType, schemaName, features }) => {
      try {
        const client = createSiteServiceClient(bearerToken, tenantId);
        const data = await client.post(`/api/v1/sites/scheme-features/${tenantTag}/${schemaType}/${schemaName}`, features);
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({ 
              success: true, 
              data,
              message: `Saved scheme features for schema '${schemaName}' of type '${schemaType}' in tenant '${tenantTag}'`
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
              details: `Failed to save scheme features for schema '${schemaName}' of type '${schemaType}' in tenant '${tenantTag}'`
            }, null, 2)
          }]
        };
      }
    }
  );
}