import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createFormFlowClient } from "./index";

const UpdateWebhookSchema = z.object({
  bearerToken: z.string().optional(),
  clientId: z.string().optional(),
  clientSecret: z.string().optional(),
  organizationId: z.string().optional(),
  webhookId: z.string().min(1, "Webhook ID is required"),
  url: z.string().url().optional(),
  event: z.string().optional(),
});

export function registerFormFlowUpdateWebhookTool(server: McpServer) {
  server.tool(
    "formflow_update_webhook",
    "Update an existing webhook subscription with new URL or event configuration. This allows you to modify webhook endpoints or change which events trigger notifications without recreating the subscription. Only provided fields will be updated, leaving other settings unchanged.",
    {
      bearerToken: {
        type: "string",
        description: "JWT bearer token (valid for 1 hour). Use this OR the credential trio below.",
      },
      clientId: {
        type: "string", 
        description: "FormFlow API client ID. Required if bearerToken is not provided.",
      },
      clientSecret: {
        type: "string",
        description: "FormFlow API client secret. Required if bearerToken is not provided.",
      },
      organizationId: {
        type: "string",
        description: "FormFlow organization ID. Required if bearerToken is not provided.",
      },
      webhookId: {
        type: "string",
        description: "Unique identifier of the webhook subscription to update.",
      },
      url: {
        type: "string",
        description: "New webhook URL endpoint (optional). Must be a valid HTTPS URL.",
      },
      event: {
        type: "string",
        description: "New event type to trigger webhook notifications (optional). Examples: 'form.submitted', 'processing.completed'.",
      },
    },
    async (request) => {
      try {
        const params = UpdateWebhookSchema.parse(request.params);
        const client = createFormFlowClient(params);

        const updateData: any = {};
        if (params.url !== undefined) updateData.url = params.url;
        if (params.event !== undefined) updateData.event = params.event;

        const updatedWebhook = await client.updateWebhook(params.webhookId, updateData);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                isError: false,
                data: updatedWebhook,
                message: `Webhook subscription ID ${params.webhookId} updated successfully`,
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