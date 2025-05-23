import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { FormFlowClient } from "../../lib/formflow-client";
import { validateCredentials } from "./index";

export function registerFormFlowListSubmissionsTool(server: McpServer) {
  server.tool(
    "formflow_list_submissions",
    "List FormFlow submissions with optional filtering and pagination",
    {
      clientId: z.string().describe("FormFlow client ID"),
      clientSecret: z.string().describe("FormFlow client secret"),
      organizationId: z.string().describe("FormFlow organization ID"),
      page: z.number().optional().describe("Page number for pagination"),
      perPage: z.number().optional().describe("Number of items per page"),
      sortField: z.string().optional().describe("Field to sort by"),
      sortDirection: z.enum(["asc", "desc"]).optional().describe("Sort direction"),
      status: z.string().optional().describe("Filter by submission status"),
    },
    async ({ clientId, clientSecret, organizationId, page, perPage, sortField, sortDirection, status }) => {
      try {
        const credentials = validateCredentials({ clientId, clientSecret, organizationId });
        const client = new FormFlowClient(credentials);

        // Build query parameters
        const queryParams = new URLSearchParams();
        if (page) queryParams.set('page', page.toString());
        if (perPage) queryParams.set('perPage', perPage.toString());
        if (sortField) queryParams.set('sortField', sortField);
        if (sortDirection) queryParams.set('sortDirection', sortDirection);
        if (status) queryParams.set('status', status);

        const queryString = queryParams.toString();
        const endpoint = queryString ? `/api/submission?${queryString}` : '/api/submission';
        
        const submissions = await client.get(endpoint);

        return {
          content: [
            {
              type: "text",
              text: `FormFlow Submissions:\n\n${JSON.stringify(submissions, null, 2)}`
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error listing FormFlow submissions: ${error instanceof Error ? error.message : 'Unknown error'}`
            }
          ]
        };
      }
    }
  );
}