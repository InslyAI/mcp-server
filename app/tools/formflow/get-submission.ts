import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { FormFlowClient } from "../../lib/formflow-client";
import { validateCredentials } from "./index";

export function registerFormFlowGetSubmissionTool(server: McpServer) {
  server.tool(
    "formflow_get_submission",
    "Get a specific FormFlow submission by ID",
    {
      clientId: z.string().describe("FormFlow client ID"),
      clientSecret: z.string().describe("FormFlow client secret"),
      organizationId: z.string().describe("FormFlow organization ID"),
      submissionId: z.string().describe("ID of the submission to retrieve"),
    },
    async ({ clientId, clientSecret, organizationId, submissionId }) => {
      try {
        const credentials = validateCredentials({ clientId, clientSecret, organizationId });
        const client = new FormFlowClient(credentials);

        const submission = await client.get(`/api/submission/${submissionId}`);

        return {
          content: [
            {
              type: "text",
              text: `FormFlow submission details:\n\n${JSON.stringify(submission, null, 2)}`
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error retrieving FormFlow submission: ${error instanceof Error ? error.message : 'Unknown error'}`
            }
          ]
        };
      }
    }
  );
}