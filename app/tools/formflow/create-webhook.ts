import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { createFormFlowClient } from "./index";

export function registerFormFlowCreateWebhookTool(server: McpServer) {
  server.tool(
    "formflow_create_webhook",
    `Create a webhook subscription to receive real-time notifications from FormFlow.

Webhooks allow your applications to receive instant notifications when events occur in FormFlow:
• Form submissions created or updated
• Document processing completed
• AI extraction finished
• Export operations completed
• Error notifications for failed processes

**Webhook Events:**
• **form.submitted** - New form submission received
• **submission.processed** - Document processing completed
• **extraction.completed** - AI data extraction finished
• **export.completed** - Data export finished
• **processing.failed** - Processing error occurred

**Authentication Options:**
1. Use bearerToken (recommended) - Get from formflow_exchange_token tool
2. Use clientId, clientSecret, and organizationId directly

**Security Notes:**
• Webhook URLs must be HTTPS for production
• FormFlow will send POST requests with JSON payload
• Include authentication in your webhook endpoint
• Validate webhook signatures if available

**Common Use Cases:**
• Trigger downstream processing when forms are submitted
• Update external systems when extraction completes
• Send notifications for processing failures
• Sync data with CRM or insurance management systems`,
    {
      bearerToken: z.string().optional().describe("JWT bearer token from formflow_exchange_token (recommended for security)"),
      clientId: z.string().optional().describe("FormFlow client identifier (alternative to bearerToken)"),
      clientSecret: z.string().optional().describe("FormFlow client secret (alternative to bearerToken)"),
      organizationId: z.string().optional().describe("FormFlow organization identifier (alternative to bearerToken)"),
      url: z.string().url().describe("HTTPS URL where webhook notifications will be sent (must be publicly accessible)"),
      event: z.string().describe("Event type that triggers the webhook (e.g., 'form.submitted', 'extraction.completed')"),
    },
    async ({ bearerToken, clientId, clientSecret, organizationId, url, event }) => {
      try {
        const client = createFormFlowClient({ bearerToken, clientId, clientSecret, organizationId });

        const webhook = await client.post('/api/webhook/subscription', { url, event });

        return {
          content: [
            {
              type: "text",
              text: `✅ **Webhook subscription created successfully**\n\n` +
                `🆔 **Subscription ID**: ${webhook.id}\n` +
                `🔗 **URL**: ${webhook.url}\n` +
                `📡 **Event**: ${webhook.event}\n` +
                `🏢 **Organization**: ${webhook.orgId || 'Default'}\n` +
                `📅 **Created**: ${new Date(webhook.createdAt).toLocaleString()}\n\n` +
                `**Webhook Details**:\n` +
                `• FormFlow will send POST requests to your URL\n` +
                `• Requests include JSON payload with event data\n` +
                `• Your endpoint should respond with 200 status for success\n` +
                `• Failed deliveries will be retried with exponential backoff\n\n` +
                `**Next Steps**:\n` +
                `• Ensure your endpoint handles POST requests\n` +
                `• Test webhook delivery with a sample event\n` +
                `• Monitor webhook delivery status\n` +
                `• Use formflow_list_webhooks to manage subscriptions\n\n` +
                `💡 **Tip**: Test webhook endpoints with tools like ngrok for local development`
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `❌ **Error creating webhook subscription**\n\n` +
                `**URL**: ${url}\n` +
                `**Event**: ${event}\n` +
                `**Error**: ${error instanceof Error ? error.message : 'Unknown error occurred'}\n\n` +
                `**Troubleshooting**:\n` +
                `• Ensure URL is publicly accessible and uses HTTPS\n` +
                `• Verify event type is supported by FormFlow\n` +
                `• Check that URL responds to POST requests\n` +
                `• Ensure you haven't exceeded webhook limits\n` +
                `• Verify your authentication credentials`
            }
          ],
          isError: true
        };
      }
    }
  );
}