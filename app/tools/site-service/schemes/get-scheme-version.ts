import { createSiteServiceClient } from "../client";
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerGetSchemeVersionTool(server: McpServer) {
  server.tool(
    "site_service_schemes_version_get",
    "Get latest scheme version number",
    {
      bearerToken: z.string().min(1).describe("JWT bearer token from identifier_login"),
      tenantId: z.string().min(1).describe("Tenant identifier for API access"),
      tenantTag: z.string().min(1).describe("Tenant tag identifier"),
      type: z.string().min(1).describe("Schema type"),
      name: z.string().min(1).describe("Schema name")
    },
    async ({ bearerToken, tenantId, tenantTag, type, name }) => {
      try {
        const client = createSiteServiceClient(bearerToken, tenantId);
        const data = await client.get(`/api/v1/sites/schemes/version/${tenantTag}/${type}/${name}`);
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({ 
              success: true, 
              data,
              message: `Retrieved latest version for scheme '${name}' of type '${type}' for tenant '${tenantTag}'`
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
              details: `Failed to get latest version for scheme '${name}' of type '${type}' for tenant '${tenantTag}'`
            }, null, 2)
          }]
        };
      }
    }
  );
}