import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { createFormFlowClient } from "./index";

export function registerFormFlowListTemplatesTool(server: McpServer) {
  server.tool(
    "formflow_list_templates",
    "List FormFlow templates with optional pagination. Returns a list of available form templates that can be used to create submissions.",
    {
      bearerToken: z.string().optional().describe("JWT bearer token (valid for 1 hour). Use this OR the credential trio below."),
      clientId: z.string().optional().describe("FormFlow API client ID. Required if bearerToken is not provided."),
      clientSecret: z.string().optional().describe("FormFlow API client secret. Required if bearerToken is not provided."),
      organizationId: z.string().optional().describe("FormFlow organization ID. Required if bearerToken is not provided."),
      page: z.number().optional().describe("Page number for pagination (optional)"),
      perPage: z.number().optional().describe("Number of items per page (optional)"),
    },
    async ({ bearerToken, clientId, clientSecret, organizationId, page, perPage }) => {
      try {
        const client = createFormFlowClient({ bearerToken, clientId, clientSecret, organizationId });

        // Build query parameters
        const queryParams = new URLSearchParams();
        if (page) queryParams.set('page', page.toString());
        if (perPage) queryParams.set('perPage', perPage.toString());

        const queryString = queryParams.toString();
        const endpoint = queryString ? `/api/template?${queryString}` : '/api/template';
        
        const templates = await client.get(endpoint);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                isError: false,
                data: templates,
                pagination: {
                  page: page || 1,
                  perPage: perPage || 10
                },
                usage: "Use these templates with formflow_create_submission to create new submissions"
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
                troubleshooting: {
                  authentication: "Verify your bearerToken is valid or provide all three credentials (clientId, clientSecret, organizationId)",
                  pagination: "Check that page and perPage parameters are positive numbers",
                  permissions: "Ensure you have permission to list templates in your organization",
                },
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}