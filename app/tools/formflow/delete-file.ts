import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createFormFlowClient } from "./index";


export function registerFormFlowDeleteFileTool(server: McpServer) {
  server.tool(
    "formflow_delete_file",
    "Permanently delete a file from FormFlow. This action removes the file from storage and cannot be undone. The file will no longer be accessible and any references to it in submissions will become invalid. Use with extreme caution as this operation is irreversible.",
    {
      bearerToken: z.string().optional().describe("JWT bearer token (valid for 1 hour). Use this OR the credential trio below."),
      clientId: z.string().optional().describe("FormFlow API client ID. Required if bearerToken is not provided."),
      clientSecret: z.string().optional().describe("FormFlow API client secret. Required if bearerToken is not provided."),
      organizationId: z.string().optional().describe("FormFlow organization ID. Required if bearerToken is not provided."),
      fileId: z.string().describe("Unique identifier of the file to permanently delete."),
    },
    async ({ bearerToken, clientId, clientSecret, organizationId, fileId }) => {
      try {
        const client = createFormFlowClient({ bearerToken, clientId, clientSecret, organizationId });

        await client.deleteFile(fileId);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                isError: false,
                data: {
                  fileId: fileId,
                  status: "deleted",
                },
                message: `File ID ${fileId} has been permanently deleted`,
                warning: "This action cannot be undone. The file is no longer accessible.",
                impact: "Any submissions referencing this file may be affected.",
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
                  permissions: "Check that your account has permission to delete this file",
                  dependencies: "Verify that no critical submissions depend on this file before deletion",
                },
              }, null, 2),
            },
          ],
        };
      }
    }
  );
}