import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { createFormFlowClient } from "./index";

export function registerFormFlowGetSubmissionEventsTool(server: McpServer) {
  server.tool(
    "formflow_get_submission_events",
    `Retrieve all processing events and their status for a FormFlow submission.

This tool provides complete visibility into submission processing lifecycle including:
• File upload events and their success/failure status
• Email processing events for email-submitted forms
• Document conversion events (PDF to text, OCR, etc.)
• AI extraction events and their completion status
• Export events for delivering processed data
• Reference generation events for source citations

**Event Types:**
• **upload** - File upload to submission
• **email** - Email processing for email submissions
• **conversion** - Document format conversion
• **extraction** - AI data extraction processing
• **export** - Data export to external systems
• **discard** - Submission discarded/deleted
• **reference** - Reference generation for answers
• **generate-schema** - Schema generation from submission

**Event States:**
• **pending** - Event is queued or in progress
• **succeed** - Event completed successfully
• **fail** - Event failed with error

**Authentication Options:**
1. Use bearerToken (recommended) - Get from formflow_exchange_token tool
2. Use clientId, clientSecret, and organizationId directly`,
    {
      bearerToken: z.string().optional().describe("JWT bearer token from formflow_exchange_token (recommended for security)"),
      clientId: z.string().optional().describe("FormFlow client identifier (alternative to bearerToken)"),
      clientSecret: z.string().optional().describe("FormFlow client secret (alternative to bearerToken)"),
      organizationId: z.string().optional().describe("FormFlow organization identifier (alternative to bearerToken)"),
      submissionId: z.string().describe("ID of the submission to get events for"),
    },
    async ({ bearerToken, clientId, clientSecret, organizationId, submissionId }) => {
      try {
        const client = createFormFlowClient({ bearerToken, clientId, clientSecret, organizationId });

        const events = await client.get(`/api/submission/${submissionId}/events`);

        if (!Array.isArray(events) || events.length === 0) {
          return {
            content: [
              {
                type: "text",
                text: `📋 **FormFlow Submission Events**\n\n` +
                  `**Submission ID**: ${submissionId}\n\n` +
                  `**No events found**\n\n` +
                  `This could mean:\n` +
                  `• The submission was just created and hasn't been processed yet\n` +
                  `• Events are still being generated\n` +
                  `• The submission ID is incorrect\n\n` +
                  `💡 **Tip**: Check the submission status with formflow_get_submission`
              }
            ]
          };
        }

        // Group events by state for better overview
        const eventsByState = events.reduce((acc: any, event: any) => {
          if (!acc[event.state]) acc[event.state] = [];
          acc[event.state].push(event);
          return acc;
        }, {});

        const formatEvents = (eventList: any[]) => {
          return eventList.map((event, index) => {
            const stateIcon = event.state === 'succeed' ? '✅' : event.state === 'fail' ? '❌' : '⏳';
            return `${stateIcon} **${event.type}** (${event.state})\n` +
              `   📅 Created: ${new Date(event.createdAt).toLocaleString()}\n` +
              `   🔄 Updated: ${new Date(event.updatedAt).toLocaleString()}\n` +
              `   🆔 Event ID: ${event.id}`;
          }).join('\n\n');
        };

        return {
          content: [
            {
              type: "text",
              text: `📋 **FormFlow Submission Events**\n\n` +
                `**Submission ID**: ${submissionId}\n` +
                `**Total Events**: ${events.length}\n\n` +
                `**Summary**:\n` +
                `• ✅ Successful: ${eventsByState.succeed?.length || 0}\n` +
                `• ❌ Failed: ${eventsByState.fail?.length || 0}\n` +
                `• ⏳ Pending: ${eventsByState.pending?.length || 0}\n\n` +
                (eventsByState.succeed ? `**✅ Successful Events:**\n${formatEvents(eventsByState.succeed)}\n\n` : '') +
                (eventsByState.pending ? `**⏳ Pending Events:**\n${formatEvents(eventsByState.pending)}\n\n` : '') +
                (eventsByState.fail ? `**❌ Failed Events:**\n${formatEvents(eventsByState.fail)}\n\n` : '') +
                `💡 **Tip**: Monitor pending events to track processing progress`
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `❌ **Error retrieving submission events**\n\n` +
                `**Submission ID**: ${submissionId}\n` +
                `**Error**: ${error instanceof Error ? error.message : 'Unknown error occurred'}\n\n` +
                `**Troubleshooting**:\n` +
                `• Verify the submission ID exists and you have access\n` +
                `• Check your authentication credentials\n` +
                `• Ensure the submission belongs to your organization\n` +
                `• Try using formflow_get_submission to verify the submission exists`
            }
          ],
          isError: true
        };
      }
    }
  );
}