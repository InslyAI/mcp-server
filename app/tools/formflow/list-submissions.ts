import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { createFormFlowClient } from "./index";

export function registerFormFlowListSubmissionsTool(server: McpServer) {
  server.tool(
    "formflow_list_submissions",
    `List and filter FormFlow submissions with advanced pagination and search capabilities.

This tool retrieves submissions from your FormFlow organization with comprehensive filtering options. It supports:
• Pagination through large submission datasets (default: 10 per page)
• Sorting by creation date or last update (newest first by default)
• Status filtering (created, processing, completed, etc.)
• Full submission details including templates, files, and metadata

**Authentication Options:**
1. Use bearerToken (recommended) - Get from formflow_exchange_token tool
2. Use clientId, clientSecret, and organizationId directly

**Common Use Cases:**
• Review recent submissions: Use default parameters
• Find specific submissions: Filter by status (e.g., "completed,processed")
• Paginate through submissions: Set page and perPage parameters
• Sort submissions: Use sort="updatedAt" with sortDir="desc"

**Example Status Values:** created, processing, processing-failed, processed, in-review, completed, exported, export-failed, discarded, preparing, queued`,
    {
      bearerToken: z.string().optional().describe("JWT bearer token from formflow_exchange_token (recommended for security)"),
      clientId: z.string().optional().describe("FormFlow client identifier (alternative to bearerToken)"),
      clientSecret: z.string().optional().describe("FormFlow client secret (alternative to bearerToken)"),
      organizationId: z.string().optional().describe("FormFlow organization identifier (alternative to bearerToken)"),
      page: z.number().min(1).default(1).describe("Page number for pagination (starts at 1)"),
      perPage: z.number().min(1).max(100).default(10).describe("Number of submissions per page (1-100)"),
      sort: z.enum(["createdAt", "updatedAt"]).default("createdAt").describe("Field to sort submissions by"),
      sortDir: z.enum(["asc", "desc"]).default("desc").describe("Sort direction (desc = newest first)"),
      status: z.string().optional().describe("Comma-separated status filter (e.g., 'completed,processed')"),
    },
    async ({ bearerToken, clientId, clientSecret, organizationId, page, perPage, sort, sortDir, status }) => {
      try {
        const client = createFormFlowClient({ bearerToken, clientId, clientSecret, organizationId });

        // Build query parameters
        const queryParams = new URLSearchParams();
        queryParams.set('page', page.toString());
        queryParams.set('perPage', perPage.toString());
        queryParams.set('sort', sort);
        queryParams.set('sortDir', sortDir);
        if (status) queryParams.set('status', status);

        const submissions = await client.get(`/api/submission?${queryParams}`);

        // Format response with better structure
        const totalSubmissions = submissions.dataCount || 0;
        const totalPages = submissions.pageCount || 1;
        const currentPage = submissions.page || 1;
        const submissionsList = submissions.data || [];

        return {
          content: [
            {
              type: "text",
              text: `📋 **FormFlow Submissions** (Page ${currentPage} of ${totalPages})\n\n` +
                `📊 **Summary**: ${totalSubmissions} total submissions, showing ${submissionsList.length} on this page\n\n` +
                (submissionsList.length > 0 
                  ? `**Submissions:**\n${submissionsList.map((sub: any, index: number) => 
                      `${index + 1}. **${sub.name}** (ID: ${sub.id})\n` +
                      `   📅 Created: ${new Date(sub.createdAt).toLocaleDateString()}\n` +
                      `   🔄 Status: ${sub.status}\n` +
                      `   📝 Template: ${sub.template?.name || 'N/A'}\n` +
                      `   📎 Files: ${sub.files?.length || 0}`
                    ).join('\n\n')}`
                  : '**No submissions found matching your criteria**'
                ) + 
                `\n\n💡 **Tip**: Use status filter to find specific submissions (e.g., status="completed")`
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `❌ **Error listing FormFlow submissions**\n\n` +
                `**Error**: ${error instanceof Error ? error.message : 'Unknown error occurred'}\n\n` +
                `**Troubleshooting**:\n` +
                `• Verify your authentication (bearerToken or credentials)\n` +
                `• Check page and perPage parameters are within valid ranges\n` +
                `• Ensure status filter uses valid status values\n` +
                `• Try reducing perPage if getting timeout errors`
            }
          ],
          isError: true
        };
      }
    }
  );
}