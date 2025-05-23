import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { FormFlowClient } from "../../lib/formflow-client";
import { validateCredentials } from "./index";

export function registerFormFlowAIGenerateMetadataTool(server: McpServer) {
  server.tool(
    "formflow_ai_generate_metadata",
    "Generate metadata for FormFlow submission using AI",
    {
      clientId: z.string().describe("FormFlow client ID"),
      clientSecret: z.string().describe("FormFlow client secret"),
      organizationId: z.string().describe("FormFlow organization ID"),
      submissionId: z.string().describe("ID of the submission"),
      fileUrls: z.array(z.string()).describe("URLs of files to analyze"),
    },
    async ({ clientId, clientSecret, organizationId, submissionId, fileUrls }) => {
      try {
        const credentials = validateCredentials({ clientId, clientSecret, organizationId });
        const client = new FormFlowClient(credentials);

        const metadataData = {
          submissionId,
          fileUrls
        };

        const metadata = await client.post('/api/ai/generateSubmissionMetadata', metadataData);

        return {
          content: [
            {
              type: "text",
              text: `AI Generated Metadata:\n\n${JSON.stringify(metadata, null, 2)}`
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error generating metadata with AI: ${error instanceof Error ? error.message : 'Unknown error'}`
            }
          ]
        };
      }
    }
  );
}