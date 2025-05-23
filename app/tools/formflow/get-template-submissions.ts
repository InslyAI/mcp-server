import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { createFormFlowClient } from "./index";

export function registerFormFlowGetTemplateSubmissionsTool(server: McpServer) {
  server.tool(
    "formflow_get_template_submissions",
    "Get all submissions for a specific template. Returns a list of submissions that have been created using the specified template.",
    {
      bearerToken: z.string().optional().describe("JWT bearer token (valid for 1 hour). Use this OR the credential trio below."),
      clientId: z.string().optional().describe("FormFlow API client ID (required if not using bearer token)"),
      clientSecret: z.string().optional().describe("FormFlow API client secret (required if not using bearer token)"),
      organizationId: z.string().optional().describe("Organization ID (required if not using bearer token)"),
      templateId: z.string().describe("The ID of the template to get submissions for")
    },
    async ({ bearerToken, clientId, clientSecret, organizationId, templateId }) => {
      try {
        const client = createFormFlowClient({ bearerToken, clientId, clientSecret, organizationId });
        const response = await client.get(`/api/template/${templateId}/submissions`);
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
            text: `Error getting template submissions: ${error.response?.data?.message || error.message}\n\nTroubleshooting:\n- Verify the template ID exists and you have access to it\n- Check that your authentication credentials are valid\n- Ensure you have permission to view submissions for this template\n- FormFlow API rate limit: 60 requests/minute\n- Bearer tokens expire after 1 hour`
          }]
        };
      }
    }
  );
}