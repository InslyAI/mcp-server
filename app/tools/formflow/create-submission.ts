import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { FormFlowClient } from "../../lib/formflow-client";
import { validateCredentials } from "./index";

export function registerFormFlowCreateSubmissionTool(server: McpServer) {
  server.tool(
    "formflow_create_submission",
    "Create a new FormFlow submission",
    {
      clientId: z.string().describe("FormFlow client ID"),
      clientSecret: z.string().describe("FormFlow client secret"),
      organizationId: z.string().describe("FormFlow organization ID"),
      name: z.string().describe("Name for the submission"),
      templateId: z.string().describe("Template ID to use for the submission"),
    },
    async ({ clientId, clientSecret, organizationId, name, templateId }) => {
      try {
        const credentials = validateCredentials({ clientId, clientSecret, organizationId });
        const client = new FormFlowClient(credentials);

        const submissionData = {
          name,
          templateId
        };

        const submission = await client.post('/api/submission', submissionData);

        return {
          content: [
            {
              type: "text",
              text: `FormFlow submission created successfully:\n\n${JSON.stringify(submission, null, 2)}`
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error creating FormFlow submission: ${error instanceof Error ? error.message : 'Unknown error'}`
            }
          ]
        };
      }
    }
  );
}