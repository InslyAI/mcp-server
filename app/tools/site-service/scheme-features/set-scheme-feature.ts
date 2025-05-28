import { createSiteServiceClient } from "../client";
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerSetSchemeFeatureTool(server: McpServer) {
  server.tool(
    "site_service_scheme_features_feature_set",
    "Set specific scheme feature configuration",
    {
      bearerToken: z.string().min(1).describe("JWT bearer token from identifier_login"),
      tenantId: z.string().min(1).describe("Tenant identifier for API access"),
      tenantTag: z.string().min(1).describe("Tenant tag identifier"),
      schemaType: z.string().min(1).describe("Schema type for the scheme feature"),
      schemaName: z.string().min(1).describe("Schema name for the scheme feature"),
      featureName: z.string().min(1).describe("Name of the specific feature to set"),
      config: z.union([
        z.array(z.record(z.any())),
        z.record(z.any())
      ]).describe("Feature configuration object or array (e.g., autocomplete settings)")
    },
    async ({ bearerToken, tenantId, tenantTag, schemaType, schemaName, featureName, config }) => {
      try {
        const client = createSiteServiceClient(bearerToken, tenantId);
        const data = await client.post(`/api/v1/sites/scheme-features/${tenantTag}/${schemaType}/${schemaName}/${featureName}`, config);
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({ 
              success: true, 
              data,
              message: `Set scheme feature '${featureName}' for schema '${schemaName}' of type '${schemaType}' in tenant '${tenantTag}'`
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
              details: `Failed to set scheme feature '${featureName}' for schema '${schemaName}' of type '${schemaType}' in tenant '${tenantTag}'`
            }, null, 2)
          }]
        };
      }
    }
  );
}