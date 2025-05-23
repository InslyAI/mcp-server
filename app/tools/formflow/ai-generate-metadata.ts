import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { createFormFlowClient } from "./index";

export function registerFormFlowAIGenerateMetadataTool(server: McpServer) {
  server.tool(
    "formflow_ai_generate_metadata",
    "Generate metadata for FormFlow submission using AI. This runs sequential AI processes on a submission to generate various data, including the main data extraction. The AI will analyze the submission files and generate comprehensive metadata about the content.",
    {
      bearerToken: z.string().optional().describe("JWT bearer token (valid for 1 hour). Use this OR the credential trio below."),
      clientId: z.string().optional().describe("FormFlow API client ID. Required if bearerToken is not provided."),
      clientSecret: z.string().optional().describe("FormFlow API client secret. Required if bearerToken is not provided."),
      organizationId: z.string().optional().describe("FormFlow organization ID. Required if bearerToken is not provided."),
      submissionId: z.string().describe("ID of the submission to generate metadata for"),
      model: z.enum(["claude", "gpt4", "gemini25", "claudeThinking", "claudeHaiku", "gemini20flash"]).optional().describe("Foundational LLM model to use (optional)"),
    },
    async ({ bearerToken, clientId, clientSecret, organizationId, submissionId, model }) => {
      try {
        const client = createFormFlowClient({ bearerToken, clientId, clientSecret, organizationId });

        const metadataData: any = {
          submissionId
        };
        
        if (model) {
          metadataData.model = model;
        }

        const metadata = await client.post('/api/ai/generateSubmissionMetadata', metadataData);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                isError: false,
                data: metadata,
                message: `AI metadata generation completed successfully for submission ${submissionId}`,
                model: model || "default",
                usage: "The AI has analyzed the submission and generated comprehensive metadata including data extraction results",
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
                  submissionId: "Ensure the submission ID exists and is accessible to your organization",
                  model: "Check that the model parameter is one of the supported values: claude, gpt4, gemini25, claudeThinking, claudeHaiku, gemini20flash",
                  processing: "The submission may still be processing or may not have files ready for AI analysis",
                },
              }, null, 2),
            }
          ]
        };
      }
    }
  );
}