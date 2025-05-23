import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createFormFlowClient } from "./index";


export function registerFormFlowUpdateWebhookTool(server: McpServer) {
  server.tool(
    "formflow_update_webhook",
    "Update an existing webhook subscription with new URL or event configuration. This allows you to modify webhook endpoints or change which events trigger notifications without recreating the subscription. Only provided fields will be updated, leaving other settings unchanged.",
    {
      bearerToken: z.string().optional().describe("JWT bearer token (valid for 1 hour). Use this OR the credential trio below."),
      clientId: z.string().optional().describe("FormFlow API client ID. Required if bearerToken is not provided."),
      clientSecret: z.string().optional().describe("FormFlow API client secret. Required if bearerToken is not provided."),
      organizationId: z.string().optional().describe("FormFlow organization ID. Required if bearerToken is not provided."),
      webhookId: z.string().describe("Unique identifier of the webhook subscription to update."),
      url: z.string().url().optional().describe("New webhook URL endpoint (optional). Must be a valid HTTPS URL."),
      event: z.string().optional().describe("New event type to trigger webhook notifications (optional). Examples: 'form.submitted', 'processing.completed'."),
    },
    async ({ bearerToken, clientId, clientSecret, organizationId, webhookId, url, event }) => {
      try {
        const client = createFormFlowClient({ bearerToken, clientId, clientSecret, organizationId });

        const updateData: any = {};
        if (url !== undefined) updateData.url = url;
        if (event !== undefined) updateData.event = event;

        const updatedWebhook = await client.updateWebhook(webhookId, updateData);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                isError: false,
                data: updatedWebhook,
                message: `Webhook subscription ID ${webhookId} updated successfully`,
                updatedFields: Object.keys(updateData),
                usage: "The webhook will now use the updated configuration for future event notifications",
              }, null, 2),
            },
          ],
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
                  webhookId: "Ensure the webhook ID exists and is accessible to your organization",
                  permissions: "Check that your account has permission to modify this webhook subscription",
                  url: "Ensure the URL is valid and accessible. Use HTTPS for security.",
                  event: "Verify the event type is supported by FormFlow",
                },
              }, null, 2),
            },
          ],
        };
      }
    }
  );
}