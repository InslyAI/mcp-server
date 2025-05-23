import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { createFormFlowClient } from "./index";

export function registerFormFlowAIGenerateSchemaForSubmissionTool(server: McpServer) {
  server.tool(
    "formflow_ai_generate_schema_for_submission",
    "Generate a schema for a submission using AI based on the documents and context provided. This creates a structured schema that can be used for data extraction from the submission documents.",
    {
      bearerToken: z.string().optional().describe("JWT bearer token (valid for 1 hour). Use this OR the credential trio below."),
      clientId: z.string().optional().describe("FormFlow API client ID (required if not using bearer token)"),
      clientSecret: z.string().optional().describe("FormFlow API client secret (required if not using bearer token)"),
      organizationId: z.string().optional().describe("Organization ID (required if not using bearer token)"),
      submissionId: z.string().describe("The ID of the submission to generate a schema for"),
      model: z.enum(["claude", "gpt4", "gemini25", "claudeThinking", "claudeHaiku", "gemini20flash"]).optional().describe("Foundational LLM model to use (optional)")
    },
    async ({ bearerToken, clientId, clientSecret, organizationId, submissionId, model }) => {
      try {
        const client = createFormFlowClient({ bearerToken, clientId, clientSecret, organizationId });
        
        const requestBody: any = {
          submissionId
        };
        
        if (model) {
          requestBody.model = model;
        }
        
        const response = await client.post('/api/ai/generateSchemaForSubmission', requestBody);
        return {
          content: [{
            type: 'text' as const,
            text: JSON.stringify(response.data, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text' as const,
            text: `Error generating schema for submission: ${error.response?.data?.message || error.message}\n\nTroubleshooting:\n- Verify the submission ID exists and you have access to it\n- Check that your authentication credentials are valid\n- Ensure the submission has documents uploaded for schema generation\n- FormFlow API rate limit: 60 requests/minute\n- Bearer tokens expire after 1 hour`
          }]
        };
      }
    }
  );
}