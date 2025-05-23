import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { createFormFlowClient } from "./index";

export function registerFormFlowFileViewTool(server: McpServer) {
  server.tool(
    "formflow_file_view",
    "View or download a file by its ID. This endpoint allows you to access files that have been uploaded to FormFlow, such as documents in submissions.",
    {
      bearerToken: z.string().optional().describe("JWT bearer token (valid for 1 hour). Use this OR the credential trio below."),
      clientId: z.string().optional().describe("FormFlow API client ID (required if not using bearer token)"),
      clientSecret: z.string().optional().describe("FormFlow API client secret (required if not using bearer token)"),
      organizationId: z.string().optional().describe("Organization ID (required if not using bearer token)"),
      fileId: z.string().describe("The ID of the file to view or download")
    },
    async ({ bearerToken, clientId, clientSecret, organizationId, fileId }) => {
      try {
        const client = createFormFlowClient({ bearerToken, clientId, clientSecret, organizationId });
        const response = await client.get(`/api/file/${fileId}/view`);
        
        // For file data, we'll return information about the file
        const isString = typeof response === 'string';
        const isObject = typeof response === 'object' && response !== null;
        
        return {
          content: [{
            type: 'text' as const,
            text: `File retrieved successfully:\n- File ID: ${fileId}\n- Response Type: ${isString ? 'string' : isObject ? 'object' : typeof response}\n- Data: ${JSON.stringify(response, null, 2)}\n\nNote: This endpoint provides access to files that have been uploaded to FormFlow.`
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text' as const,
            text: `Error viewing file: ${error.response?.data?.message || error.message}\n\nTroubleshooting:\n- Verify the file ID exists and you have access to it\n- Check that your authentication credentials are valid\n- Ensure you have permission to view this file\n- FormFlow API rate limit: 60 requests/minute\n- Bearer tokens expire after 1 hour`
          }]
        };
      }
    }
  );
}