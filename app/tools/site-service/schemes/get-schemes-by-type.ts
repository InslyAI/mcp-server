import { createSiteServiceClient } from "../client";
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerGetSchemesByTypeTool(server: McpServer) {
  server.tool(
    "site_service_schemes_configurations_by_type_list",
    "Get schemes list of latest version by type",
    {
      bearerToken: z.string().min(1).describe("JWT bearer token from identifier_login"),
      tenantId: z.string().min(1).describe("Tenant identifier for API access"),
      tenantTag: z.string().min(1).describe("Tenant tag identifier"),
      type: z.string().min(1).describe("Schema type to filter by"),
      name: z.string().optional().describe("Optional name filter for schemes")
    },
    async ({ bearerToken, tenantId, tenantTag, type, name }) => {
      try {
        const client = createSiteServiceClient(bearerToken, tenantId);
        const params = name ? { name } : undefined;
        const data = await client.get(`/api/v1/sites/schemes/configurations/${tenantTag}/${type}`, params);
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({ 
              success: true, 
              data,
              message: `Retrieved schemes list of type '${type}' for tenant '${tenantTag}'${name ? ` filtered by name '${name}'` : ''}`
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
              details: `Failed to get schemes list of type '${type}' for tenant '${tenantTag}'`
            }, null, 2)
          }]
        };
      }
    }
  );
}