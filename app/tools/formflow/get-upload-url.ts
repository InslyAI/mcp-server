import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createFormFlowClient } from "./index";

export function registerFormFlowGetUploadUrlTool(server: McpServer) {
  server.tool(
    "formflow_get_upload_url",
    "Get a temporary S3 upload URL for uploading files to a FormFlow submission. This generates a presigned URL that allows client-side file uploads directly to S3 without exposing AWS credentials. The URL is typically valid for 15 minutes and supports uploads up to the specified file size limit.",
    {
      bearerToken: z.string().optional().describe("JWT bearer token (valid for 1 hour). Use this OR the credential trio below."),
      clientId: z.string().optional().describe("FormFlow API client ID. Required if bearerToken is not provided."),
      clientSecret: z.string().optional().describe("FormFlow API client secret. Required if bearerToken is not provided."),
      organizationId: z.string().optional().describe("FormFlow organization ID. Required if bearerToken is not provided."),
      submissionId: z.string().describe("ID of the submission to upload files to. Must be a valid UUID."),
      fileName: z.string().describe("Original name of the file to upload (e.g., 'document.pdf', 'image.jpg')."),
      contentType: z.string().describe("MIME type of the file (e.g., 'application/pdf', 'image/jpeg', 'text/plain')."),
      fileSize: z.number().positive().describe("Size of the file in bytes. Must be a positive number."),
    },
    async ({ bearerToken, clientId, clientSecret, organizationId, submissionId, fileName, contentType, fileSize }) => {
      try {
        const client = createFormFlowClient({ bearerToken, clientId, clientSecret, organizationId });

        const uploadRequest = {
          fileName,
          contentType,
          fileSize,
        };

        const result = await client.getUploadUrl(submissionId, uploadRequest);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                isError: false,
                data: {
                  uploadUrl: result.uploadUrl,
                  fileId: result.fileId,
                  expiresAt: result.expiresAt,
                  method: result.method || 'PUT',
                  headers: result.headers || {},
                },
                message: `Upload URL generated successfully for file: ${fileName}`,
                usage: `Use the uploadUrl to make a ${result.method || 'PUT'} request with the file content. Include any provided headers in your upload request.`,
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
                  submissionId: "Ensure the submission ID exists and is accessible to your organization",
                  fileValidation: "Check that fileName, contentType, and fileSize are all provided and valid",
                  contentType: "Use standard MIME types like 'application/pdf', 'image/jpeg', 'text/plain'",
                  fileSize: "File size must be a positive number in bytes",
                },
              }, null, 2),
            },
          ],
        };
      }
    }
  );
}