import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { FormFlowClient } from "../../lib/formflow-client";
import { validateCredentials } from "./index";

export function registerFormFlowAIExtractDataTool(server: McpServer) {
  server.tool(
    "formflow_ai_extract_data",
    "Use AI to extract data from FormFlow submission documents",
    {
      clientId: z.string().describe("FormFlow client ID"),
      clientSecret: z.string().describe("FormFlow client secret"),
      organizationId: z.string().describe("FormFlow organization ID"),
      submissionId: z.string().describe("ID of the submission to extract data from"),
      extractionSchema: z.object({}).passthrough().describe("Schema defining what data to extract"),
    },
    async ({ clientId, clientSecret, organizationId, submissionId, extractionSchema }) => {
      try {
        const credentials = validateCredentials({ clientId, clientSecret, organizationId });
        const client = new FormFlowClient(credentials);

        const extractionData = {
          submissionId,
          extractionSchema
        };

        const extractedData = await client.post('/api/ai/atomic-extract', extractionData);

        return {
          content: [
            {
              type: "text",
              text: `AI Data Extraction Results:\n\n${JSON.stringify(extractedData, null, 2)}`
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error extracting data with AI: ${error instanceof Error ? error.message : 'Unknown error'}`
            }
          ]
        };
      }
    }
  );
}