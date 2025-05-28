import { createSiteServiceClient } from "../client";
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerUpdateUiSchemeTool(server: McpServer) {
  server.tool(
    "site_service_schemes_ui_version_update",
    "Update UI scheme for specific version",
    {
      bearerToken: z.string().min(1).describe("JWT bearer token from identifier_login"),
      tenantId: z.string().min(1).describe("Tenant identifier for API access"),
      tenantTag: z.string().min(1).describe("Tenant tag identifier"),
      type: z.string().min(1).describe("Schema type"),
      name: z.string().min(1).describe("Schema name"),
      version: z.string().min(1).describe("Schema version to update"),
      uiSchema: z.record(z.any()).describe("UI scheme configuration to store")
    },
    async ({ bearerToken, tenantId, tenantTag, type, name, version, uiSchema }) => {
      try {
        const client = createSiteServiceClient(bearerToken, tenantId);
        const data = await client.put(`/api/v1/sites/schemes/configurations/${tenantTag}/${type}/${name}/${version}/ui`, uiSchema);
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({ 
              success: true, 
              data,
              message: `Updated UI scheme '${name}' version '${version}' of type '${type}' for tenant '${tenantTag}'`
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
              details: `Failed to update UI scheme '${name}' version '${version}' of type '${type}' for tenant '${tenantTag}'`
            }, null, 2)
          }]
        };
      }
    }
  );
}