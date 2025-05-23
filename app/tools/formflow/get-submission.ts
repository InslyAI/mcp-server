import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { createFormFlowClient } from "./index";

export function registerFormFlowGetSubmissionTool(server: McpServer) {
  server.tool(
    "formflow_get_submission",
    "Get detailed information about a specific FormFlow submission by ID. Returns complete submission data including status, files, processing results, and metadata.",
    {
      bearerToken: z.string().optional().describe("JWT bearer token (valid for 1 hour). Use this OR the credential trio below."),
      clientId: z.string().optional().describe("FormFlow API client ID. Required if bearerToken is not provided."),
      clientSecret: z.string().optional().describe("FormFlow API client secret. Required if bearerToken is not provided."),
      organizationId: z.string().optional().describe("FormFlow organization ID. Required if bearerToken is not provided."),
      submissionId: z.string().describe("ID of the submission to retrieve"),
    },
    async ({ bearerToken, clientId, clientSecret, organizationId, submissionId }) => {
      try {
        const client = createFormFlowClient({ bearerToken, clientId, clientSecret, organizationId });

        const submission = await client.get(`/api/submission/${submissionId}`);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                isError: false,
                data: submission,
                submissionId,
                relatedTools: {
                  events: "Use formflow_get_submission_events to see processing history",
                  references: "Use formflow_get_submission_references to see document references",
                  update: "Use formflow_update_submission to modify submission details"
                }
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
                submissionId,
                troubleshooting: {
                  authentication: "Verify your bearerToken is valid or provide all three credentials (clientId, clientSecret, organizationId)",
                  submissionId: "Ensure the submission ID exists and you have access to it",
                  permissions: "Check that you have permission to view this submission",
                  format: "Submission ID should be a valid UUID or string identifier",
                },
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}