import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { createFormFlowClient } from "./index";

export function registerFormFlowAIGenerateReferencesTool(server: McpServer) {
  server.tool(
    "formflow_ai_generate_references",
    "Generate references for answers in a FormFlow submission. This AI tool analyzes the submission answers and creates references that link specific answers back to the source documents and locations where the information was found.",
    {
      bearerToken: z.string().optional().describe("JWT bearer token (valid for 1 hour). Use this OR the credential trio below."),
      clientId: z.string().optional().describe("FormFlow API client ID. Required if bearerToken is not provided."),
      clientSecret: z.string().optional().describe("FormFlow API client secret. Required if bearerToken is not provided."),
      organizationId: z.string().optional().describe("FormFlow organization ID. Required if bearerToken is not provided."),
      submissionId: z.string().describe("The ID of the submission to generate references for"),
    },
    async ({ bearerToken, clientId, clientSecret, organizationId, submissionId }) => {
      try {
        const client = createFormFlowClient({ bearerToken, clientId, clientSecret, organizationId });

        const requestData = {
          submissionId
        };

        const result = await client.post('/api/ai/generateReferencesForAnswers', requestData);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                isError: false,
                data: result,
                message: `AI reference generation completed successfully for submission ${submissionId}`,
                usage: "References have been generated linking answers to their source locations in the documents",
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
                  submissionId: "Ensure the submission ID exists and has been processed with extracted data",
                  processing: "The submission must have completed data extraction before references can be generated",
                  answers: "Make sure the submission has answers/extracted data to create references for",
                },
              }, null, 2),
            }
          ]
        };
      }
    }
  );
}