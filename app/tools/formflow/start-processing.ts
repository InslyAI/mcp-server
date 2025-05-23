import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { createFormFlowClient } from "./index";

export function registerFormFlowStartProcessingTool(server: McpServer) {
  server.tool(
    "formflow_start_processing",
    "Start processing a FormFlow submission. This initiates the processing workflow for a submission, which may include AI extraction, data processing, and other automated tasks. You can optionally generate a template from the submission during processing.",
    {
      bearerToken: z.string().optional().describe("JWT bearer token (valid for 1 hour). Use this OR the credential trio below."),
      clientId: z.string().optional().describe("FormFlow API client ID. Required if bearerToken is not provided."),
      clientSecret: z.string().optional().describe("FormFlow API client secret. Required if bearerToken is not provided."),
      organizationId: z.string().optional().describe("FormFlow organization ID. Required if bearerToken is not provided."),
      submissionId: z.string().describe("The ID of the submission to start processing"),
      generateTemplate: z.boolean().default(false).describe("Whether to generate a template for the submission (default: false)"),
    },
    async ({ bearerToken, clientId, clientSecret, organizationId, submissionId, generateTemplate }) => {
      try {
        const client = createFormFlowClient({ bearerToken, clientId, clientSecret, organizationId });

        const processingData = {
          submissionId,
          generateTemplate
        };

        const result = await client.post('/api/processing', processingData);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                isError: false,
                data: result,
                message: `Processing started successfully for submission ${submissionId}`,
                generateTemplate,
                usage: "You can monitor the processing status using the formflow_get_submission_events tool",
              }, null, 2),
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
                  submissionId: "Ensure the submission ID exists and has files ready for processing",
                  status: "Check that the submission is in a state ready for processing (not already processing)",
                  files: "Make sure the submission has uploaded files to process",
                },
              }, null, 2),
            }
          ]
        };
      }
    }
  );
}