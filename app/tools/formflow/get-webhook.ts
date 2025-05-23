import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createFormFlowClient } from "./index";


export function registerFormFlowGetWebhookTool(server: McpServer) {
  server.tool(
    "formflow_get_webhook",
    "Retrieve detailed information about a specific webhook subscription by its ID. Returns webhook configuration including URL, event type, organization ID, and timestamps. This is useful for webhook management, debugging, and verification of webhook settings.",
    {
      bearerToken: z.string().optional().describe("JWT bearer token (valid for 1 hour). Use this OR the credential trio below."),
      clientId: z.string().optional().describe("FormFlow API client ID. Required if bearerToken is not provided."),
      clientSecret: z.string().optional().describe("FormFlow API client secret. Required if bearerToken is not provided."),
      organizationId: z.string().optional().describe("FormFlow organization ID. Required if bearerToken is not provided."),
      webhookId: z.string().describe("Unique identifier of the webhook subscription to retrieve."),
    },
    async ({ bearerToken, clientId, clientSecret, organizationId, webhookId }) => {
      try {
        const client = createFormFlowClient({ bearerToken, clientId, clientSecret, organizationId });

        const webhook = await client.getWebhook(webhookId);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                isError: false,
                data: {
                  id: webhook.id,
                  event: webhook.event,
                  url: webhook.url,
                  orgId: webhook.orgId,
                  createdAt: webhook.createdAt,
                  updatedAt: webhook.updatedAt,
                },
                message: `Webhook subscription ID ${webhook.id} retrieved successfully`,
                usage: "Use this webhook information for debugging, updates, or verification of notification settings",
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
                  permissions: "Check that your account has permission to view this webhook subscription",
                },
              }, null, 2),
            },
          ],
        };
      }
    }
  );
}