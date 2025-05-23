import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createFormFlowClient } from "./index";


export function registerFormFlowDeleteWebhookTool(server: McpServer) {
  server.tool(
    "formflow_delete_webhook",
    "Permanently delete a webhook subscription. This will stop all event notifications to the webhook URL and cannot be undone. The webhook will no longer receive any FormFlow events. Use this when decommissioning integrations or when webhook endpoints are no longer available.",
    {
      bearerToken: z.string().optional().describe("JWT bearer token (valid for 1 hour). Use this OR the credential trio below."),
      clientId: z.string().optional().describe("FormFlow API client ID. Required if bearerToken is not provided."),
      clientSecret: z.string().optional().describe("FormFlow API client secret. Required if bearerToken is not provided."),
      organizationId: z.string().optional().describe("FormFlow organization ID. Required if bearerToken is not provided."),
      webhookId: z.string().describe("Unique identifier of the webhook subscription to delete."),
    },
    async ({ bearerToken, clientId, clientSecret, organizationId, webhookId }) => {
      try {
        const client = createFormFlowClient({ bearerToken, clientId, clientSecret, organizationId });

        const result = await client.deleteWebhook(webhookId);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                isError: false,
                data: {
                  webhookId: webhookId,
                  success: result.success,
                  status: "deleted",
                },
                message: `Webhook subscription ID ${webhookId} has been permanently deleted`,
                warning: "This webhook will no longer receive event notifications",
                impact: "Any systems depending on this webhook will stop receiving FormFlow updates",
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
                  permissions: "Check that your account has permission to delete this webhook subscription",
                  dependencies: "Verify that no critical integrations depend on this webhook before deletion",
                },
              }, null, 2),
            },
          ],
        };
      }
    }
  );
}