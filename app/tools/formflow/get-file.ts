import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createFormFlowClient } from "./index";


export function registerFormFlowGetFileTool(server: McpServer) {
  server.tool(
    "formflow_get_file",
    "Retrieve detailed information about a specific file by its ID. Returns file metadata including name, type, size, upload timestamp, and public URL. This is useful for file management, verification, and generating download links for processed documents.",
    {
      bearerToken: z.string().optional().describe("JWT bearer token (valid for 1 hour). Use this OR the credential trio below."),
      clientId: z.string().optional().describe("FormFlow API client ID. Required if bearerToken is not provided."),
      clientSecret: z.string().optional().describe("FormFlow API client secret. Required if bearerToken is not provided."),
      organizationId: z.string().optional().describe("FormFlow organization ID. Required if bearerToken is not provided."),
      fileId: z.string().describe("Unique identifier of the file to retrieve information for."),
    },
    async ({ bearerToken, clientId, clientSecret, organizationId, fileId }) => {
      try {
        const client = createFormFlowClient({ bearerToken, clientId, clientSecret, organizationId });

        const file = await client.getFile(fileId);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                isError: false,
                data: {
                  id: file.id,
                  name: file.name,
                  fileName: file.fileName,
                  fileType: file.fileType,
                  fileSize: file.fileSize,
                  url: file.url,
                  createdAt: file.createdAt,
                  updatedAt: file.updatedAt,
                  readableFileSize: `${(file.fileSize / 1024 / 1024).toFixed(2)} MB`,
                },
                message: `File "${file.fileName}" (ID: ${file.id}) retrieved successfully`,
                usage: "Use the 'url' field to access the file directly, or the metadata for file management operations",
              }, null, 2),
            },
          ],
        };

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        
        return {
          content: [
            {
              type: "text", 
              text: JSON.stringify({
                isError: true,
                error: errorMessage,
                troubleshooting: {
                  authentication: "Verify your bearerToken is valid or provide all three credentials (clientId, clientSecret, organizationId)",
                  fileId: "Ensure the file ID exists and is accessible to your organization",
                  permissions: "Check that your account has permission to view this file",
                  existence: "The file may have been deleted or moved",
                },
              }, null, 2),
            },
          ],
        };
      }
    }
  );
}