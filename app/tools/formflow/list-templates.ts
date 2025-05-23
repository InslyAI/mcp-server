import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { FormFlowClient } from "../../lib/formflow-client";
import { validateCredentials } from "./index";

export function registerFormFlowListTemplatesTool(server: McpServer) {
  server.tool(
    "formflow_list_templates",
    "List FormFlow templates with optional pagination",
    {
      clientId: z.string().describe("FormFlow client ID"),
      clientSecret: z.string().describe("FormFlow client secret"),
      organizationId: z.string().describe("FormFlow organization ID"),
      page: z.number().optional().describe("Page number for pagination"),
      perPage: z.number().optional().describe("Number of items per page"),
    },
    async ({ clientId, clientSecret, organizationId, page, perPage }) => {
      try {
        const credentials = validateCredentials({ clientId, clientSecret, organizationId });
        const client = new FormFlowClient(credentials);

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
              text: `FormFlow Templates:\n\n${JSON.stringify(templates, null, 2)}`
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error listing FormFlow templates: ${error instanceof Error ? error.message : 'Unknown error'}`
            }
          ]
        };
      }
    }
  );
}