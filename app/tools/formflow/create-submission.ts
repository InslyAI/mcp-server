import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { createFormFlowClient } from "./index";

export function registerFormFlowCreateSubmissionTool(server: McpServer) {
  server.tool(
    "formflow_create_submission",
    "Create a new FormFlow submission using a template. This initializes a new submission that can then have files uploaded and be processed.",
    {
      bearerToken: z.string().optional().describe("JWT bearer token (valid for 1 hour). Use this OR the credential trio below."),
      clientId: z.string().optional().describe("FormFlow API client ID. Required if bearerToken is not provided."),
      clientSecret: z.string().optional().describe("FormFlow API client secret. Required if bearerToken is not provided."),
      organizationId: z.string().optional().describe("FormFlow organization ID. Required if bearerToken is not provided."),
      name: z.string().describe("Name for the submission"),
      templateId: z.string().describe("Template ID to use for the submission"),
    },
    async ({ bearerToken, clientId, clientSecret, organizationId, name, templateId }) => {
      try {
        const client = createFormFlowClient({ bearerToken, clientId, clientSecret, organizationId });

        const submissionData = {
          name,
          templateId
        };

        const submission = await client.post('/api/submission', submissionData);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                isError: false,
                data: submission,
                message: `Submission '${name}' created successfully`,
                nextSteps: "Use formflow_get_upload_url to upload files, then formflow_start_processing to begin AI processing"
              }, null, 2)
            }
          ]
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
                  templateId: "Ensure the template ID exists and you have access to it",
                  name: "Submission name should be descriptive and not empty",
                  permissions: "Check that you have permission to create submissions in your organization",
                },
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}