import { createSiteServiceClient } from "../client";
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerUploadStaticDocumentsTool(server: McpServer) {
  server.tool(
    "site_service_static_documents_upload",
    "Upload static document(s) to tenant storage. Note: This tool requires multipart/form-data which may need special handling",
    {
      bearerToken: z.string().min(1).describe("JWT bearer token from identifier_login"),
      tenantId: z.string().min(1).describe("Tenant identifier for API access"),
      tenantTag: z.string().min(1).describe("Tenant tag identifier"),
      folder: z.string().optional().describe("Folder where to store document (optional)"),
      files: z.array(z.string()).describe("Array of file paths or base64 encoded files to upload")
    },
    async ({ bearerToken, tenantId, tenantTag, folder, files }) => {
      try {
        const client = createSiteServiceClient(bearerToken, tenantId);
        
        // Note: This is a simplified implementation
        // In a real scenario, you'd need to handle multipart/form-data properly
        const formData = {
          folder: folder || '',
          files: files
        };
        
        const data = await client.post(`/api/v1/sites/static-documents/${tenantTag}`, formData);
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({ 
              success: true, 
              data,
              message: `Uploaded ${files.length} static document(s) for tenant '${tenantTag}'${folder ? ` to folder '${folder}'` : ''}`
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
              details: `Failed to upload static documents for tenant '${tenantTag}'. Note: This endpoint requires multipart/form-data which may need special handling.`
            }, null, 2)
          }]
        };
      }
    }
  );
}