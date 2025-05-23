import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { createFormFlowClient } from "./index";

export function registerFormFlowUpdateSubmissionTool(server: McpServer) {
  server.tool(
    "formflow_update_submission",
    `Update FormFlow submission details and metadata.

This tool allows you to modify various aspects of an existing submission including:
• Submission name and status
• User assignments (uploaderUserId, userId)
• Email context (sender, body)
• Payload data (submission data, manual data, metadata)

**Authentication Options:**
1. Use bearerToken (recommended) - Get from formflow_exchange_token tool
2. Use clientId, clientSecret, and organizationId directly

**Common Use Cases:**
• Update submission status as it progresses through workflow
• Assign submissions to specific users for review
• Add manual corrections or additional data
• Update metadata for better organization

**Status Values:** created, processing, processing-failed, processed, in-review, completed, exported, export-failed, discarded, preparing, queued

**Important**: Only provide the fields you want to update. Omitted fields will remain unchanged.`,
    {
      bearerToken: z.string().optional().describe("JWT bearer token from formflow_exchange_token (recommended for security)"),
      clientId: z.string().optional().describe("FormFlow client identifier (alternative to bearerToken)"),
      clientSecret: z.string().optional().describe("FormFlow client secret (alternative to bearerToken)"),
      organizationId: z.string().optional().describe("FormFlow organization identifier (alternative to bearerToken)"),
      submissionId: z.string().describe("ID of the submission to update"),
      name: z.string().optional().describe("New name for the submission"),
      status: z.enum([
        "created", "processing", "processing-failed", "processed", 
        "in-review", "completed", "exported", "export-failed", 
        "discarded", "preparing", "queued"
      ]).optional().describe("New status for the submission"),
      uploaderUserId: z.string().optional().describe("ID of the user who uploaded the submission"),
      userId: z.string().optional().describe("ID of the user assigned to this submission"),
      emailSender: z.string().optional().describe("Email address of the sender"),
      emailBody: z.string().optional().describe("Email body or additional context"),
      payload: z.object({}).passthrough().optional().describe("Submission payload data (extracted information)"),
      manualPayload: z.object({}).passthrough().optional().describe("Manual payload data (user corrections)"),
      metaPayload: z.object({}).passthrough().optional().describe("Metadata payload (additional context)"),
    },
    async ({ bearerToken, clientId, clientSecret, organizationId, submissionId, ...updateData }) => {
      try {
        const client = createFormFlowClient({ bearerToken, clientId, clientSecret, organizationId });

        // Remove undefined values to only send fields that should be updated
        const filteredUpdateData = Object.fromEntries(
          Object.entries(updateData).filter(([_, value]) => value !== undefined)
        );

        if (Object.keys(filteredUpdateData).length === 0) {
          return {
            content: [
              {
                type: "text",
                text: `⚠️ **No update data provided**\n\n` +
                  `Please provide at least one field to update (name, status, payload, etc.)`
              }
            ],
            isError: true
          };
        }

        const updatedSubmission = await client.patch(`/api/submission/${submissionId}`, filteredUpdateData);

        return {
          content: [
            {
              type: "text",
              text: `✅ **Submission updated successfully**\n\n` +
                `📝 **Submission**: ${updatedSubmission.name || submissionId}\n` +
                `🔄 **Status**: ${updatedSubmission.status}\n` +
                `📅 **Last Updated**: ${new Date(updatedSubmission.updatedAt).toLocaleString()}\n\n` +
                `**Updated Fields**: ${Object.keys(filteredUpdateData).join(', ')}\n\n` +
                `💡 **Tip**: Use formflow_get_submission to see all current details`
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `❌ **Error updating FormFlow submission**\n\n` +
                `**Submission ID**: ${submissionId}\n` +
                `**Error**: ${error instanceof Error ? error.message : 'Unknown error occurred'}\n\n` +
                `**Troubleshooting**:\n` +
                `• Verify the submission ID exists and you have access\n` +
                `• Check that status values are valid if updating status\n` +
                `• Ensure payload objects are valid JSON if provided\n` +
                `• Verify your authentication credentials`
            }
          ],
          isError: true
        };
      }
    }
  );
}