import { createSiteServiceClient } from "../client";
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerGetTenantBrokerFeatureTool(server: McpServer) {
  server.tool(
    "site_service_features_broker_get",
    "Get tenant broker feature configuration for a specific feature and broker",
    {
      bearerToken: z.string().min(1).describe("JWT bearer token from identifier_login"),
      tenantId: z.string().min(1).describe("Tenant identifier for API access"),
      tenantTag: z.string().min(1).describe("Tenant tag identifier"),
      featureName: z.string().min(1).describe("Name of the feature to retrieve"),
      broker: z.string().min(1).describe("Broker identifier")
    },
    async ({ bearerToken, tenantId, tenantTag, featureName, broker }) => {
      try {
        const client = createSiteServiceClient(bearerToken, tenantId);
        const data = await client.get(`/api/v1/sites/features/${tenantTag}/${featureName}/${broker}`);
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({ 
              success: true, 
              data,
              message: `Retrieved feature '${featureName}' configuration for broker '${broker}'`
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
              details: `Failed to get feature '${featureName}' for broker '${broker}'`
            }, null, 2)
          }]
        };
      }
    }
  );
}