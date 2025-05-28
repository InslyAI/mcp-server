import { createSiteServiceClient } from "../client";
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerSaveClaimFeaturesTool(server: McpServer) {
  server.tool(
    "site_service_claim_features_save",
    "Save claim features - internal purposes only, used by deploy automation tool",
    {
      bearerToken: z.string().min(1).describe("JWT bearer token from identifier_login"),
      tenantId: z.string().min(1).describe("Tenant identifier for API access"),
      tenantTag: z.string().min(1).describe("Tenant tag identifier"),
      schemaName: z.string().min(1).describe("Schema name for the claim features"),
      features: z.record(z.any()).describe("Feature configuration object with feature_name as key")
    },
    async ({ bearerToken, tenantId, tenantTag, schemaName, features }) => {
      try {
        const client = createSiteServiceClient(bearerToken, tenantId);
        const data = await client.post(`/api/v1/sites/claim-features/${tenantTag}/${schemaName}`, features);
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({ 
              success: true, 
              data,
              message: `Saved claim features for schema '${schemaName}' in tenant '${tenantTag}'`
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
              details: `Failed to save claim features for schema '${schemaName}' in tenant '${tenantTag}'`
            }, null, 2)
          }]
        };
      }
    }
  );
}