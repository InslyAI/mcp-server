import { createSiteServiceClient } from "../client";
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerGetStaticDocumentTool(server: McpServer) {
  server.tool(
    "site_service_static_documents_get",
    "Get static document content by path",
    {
      bearerToken: z.string().min(1).describe("JWT bearer token from identifier_login"),
      tenantId: z.string().min(1).describe("Tenant identifier for API access"),
      tenantTag: z.string().min(1).describe("Tenant tag identifier"),
      path: z.string().min(1).describe("Document path (e.g., 'someFolder/testFile.pdf')")
    },
    async ({ bearerToken, tenantId, tenantTag, path }) => {
      try {
        const client = createSiteServiceClient(bearerToken, tenantId);
        const data = await client.get(`/api/v1/sites/static-documents/${tenantTag}/${path}`);
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({ 
              success: true, 
              data,
              message: `Retrieved static document '${path}' for tenant '${tenantTag}'`
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
              details: `Failed to get static document '${path}' for tenant '${tenantTag}'`
            }, null, 2)
          }]
        };
      }
    }
  );
}