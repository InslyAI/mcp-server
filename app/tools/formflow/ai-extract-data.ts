import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { createFormFlowClient } from "./index";

export function registerFormFlowAIExtractDataTool(server: McpServer) {
  server.tool(
    "formflow_ai_extract_data",
    "Extract data from a FormFlow submission using the Atomic extraction strategy. This AI tool analyzes documents in a submission and extracts structured data according to the provided schema. The extraction uses advanced AI models to understand document content and map it to your specified data structure.",
    {
      bearerToken: z.string().optional().describe("JWT bearer token (valid for 1 hour). Use this OR the credential trio below."),
      clientId: z.string().optional().describe("FormFlow API client ID. Required if bearerToken is not provided."),
      clientSecret: z.string().optional().describe("FormFlow API client secret. Required if bearerToken is not provided."),
      organizationId: z.string().optional().describe("FormFlow organization ID. Required if bearerToken is not provided."),
      submissionId: z.string().describe("ID of the submission to extract files from"),
      schema: z.object({}).passthrough().describe("Schema to use for the extraction - defines the structure and fields to extract from documents"),
    },
    async ({ bearerToken, clientId, clientSecret, organizationId, submissionId, schema }) => {
      try {
        const client = createFormFlowClient({ bearerToken, clientId, clientSecret, organizationId });

        const extractionData = {
          submissionId,
          schema
        };

        const extractedData = await client.post('/api/ai/atomic-extract', extractionData);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                isError: false,
                data: extractedData,
                message: `AI data extraction completed successfully for submission ${submissionId}`,
                extractionStrategy: "atomic",
                usage: "The AI has analyzed the submission documents and extracted structured data according to your schema",
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
                  schema: "Verify the extraction schema is a valid JSON object with proper field definitions",
                  processing: "The submission may still be processing or may not have files ready for AI extraction",
                  templates: "Consider using a template with a predefined extraction strategy for better results",
                },
              }, null, 2),
            }
          ]
        };
      }
    }
  );
}