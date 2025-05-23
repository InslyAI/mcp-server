import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { createFormFlowClient } from "./index";

export function registerFormFlowListWebhooksTool(server: McpServer) {
  server.tool(
    "formflow_list_webhooks",
    `List all webhook subscriptions for your FormFlow organization.

This tool displays all active webhook subscriptions including:
• Webhook URLs and event types
• Subscription IDs for management
• Creation and update timestamps
• Organization assignments

**Authentication Options:**
1. Use bearerToken (recommended) - Get from formflow_exchange_token tool
2. Use clientId, clientSecret, and organizationId directly

**Common Use Cases:**
• Audit existing webhook subscriptions
• Review webhook configurations before changes
• Find webhook IDs for updates or deletion
• Monitor webhook subscription activity

**Related Tools:**
• Use formflow_create_webhook to add new subscriptions
• Use formflow_update_webhook to modify existing ones
• Use formflow_delete_webhook to remove subscriptions`,
    {
      bearerToken: z.string().optional().describe("JWT bearer token from formflow_exchange_token (recommended for security)"),
      clientId: z.string().optional().describe("FormFlow client identifier (alternative to bearerToken)"),
      clientSecret: z.string().optional().describe("FormFlow client secret (alternative to bearerToken)"),
      organizationId: z.string().optional().describe("FormFlow organization identifier (alternative to bearerToken)"),
    },
    async ({ bearerToken, clientId, clientSecret, organizationId }) => {
      try {
        const client = createFormFlowClient({ bearerToken, clientId, clientSecret, organizationId });

        const webhooks = await client.get('/api/webhook/subscriptions');

        if (!Array.isArray(webhooks) || webhooks.length === 0) {
          return {
            content: [
              {
                type: "text",
                text: `📡 **FormFlow Webhook Subscriptions**\n\n` +
                  `**No webhook subscriptions found**\n\n` +
                  `You haven't created any webhook subscriptions yet.\n\n` +
                  `**To get started**:\n` +
                  `• Use formflow_create_webhook to create your first subscription\n` +
                  `• Set up webhook endpoints in your application\n` +
                  `• Choose events that trigger your business logic\n\n` +
                  `💡 **Tip**: Webhooks are essential for real-time integration with FormFlow`
              }
            ]
          };
        }

        return {
          content: [
            {
              type: "text",
              text: `📡 **FormFlow Webhook Subscriptions**\n\n` +
                `**Total Subscriptions**: ${webhooks.length}\n\n` +
                `${webhooks.map((webhook: any, index: number) => {
                  return `**${index + 1}. ${webhook.event}**\n` +
                    `🆔 **ID**: ${webhook.id}\n` +
                    `🔗 **URL**: ${webhook.url}\n` +
                    `🏢 **Organization**: ${webhook.orgId || 'Default'}\n` +
                    `📅 **Created**: ${new Date(webhook.createdAt).toLocaleDateString()}\n` +
                    `🔄 **Updated**: ${new Date(webhook.updatedAt).toLocaleDateString()}`;
                }).join('\n\n')}\n\n` +
                `**Webhook Management**:\n` +
                `• Use formflow_update_webhook to modify existing subscriptions\n` +
                `• Use formflow_delete_webhook to remove subscriptions\n` +
                `• Use formflow_get_webhook to view specific subscription details\n\n` +
                `💡 **Tip**: Regularly review webhook URLs to ensure they're still active`
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `❌ **Error listing webhook subscriptions**\n\n` +
                `**Error**: ${error instanceof Error ? error.message : 'Unknown error occurred'}\n\n` +
                `**Troubleshooting**:\n` +
                `• Verify your authentication credentials\n` +
                `• Check that you have permission to view webhooks\n` +
                `• Ensure you're connected to the correct organization\n` +
                `• Try refreshing your bearer token if using token authentication`
            }
          ],
          isError: true
        };
      }
    }
  );
}