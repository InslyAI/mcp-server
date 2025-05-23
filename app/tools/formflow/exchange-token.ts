import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { FormFlowClient } from "./client";
import { validateCredentials } from "./index";

export function registerFormFlowExchangeTokenTool(server: McpServer) {
  server.tool(
    "formflow_exchange_token",
    "Exchange FormFlow credentials for a JWT bearer token valid for 1 hour. This token can then be used with other FormFlow tools instead of providing credentials each time. The token enables secure, efficient API access without exposing credentials in subsequent requests.",
    {
      clientId: z.string().describe("FormFlow client identifier provided by FormFlow support"),
      clientSecret: z.string().describe("FormFlow client secret (keep secure, never expose in client-side code)"),
      organizationId: z.string().describe("FormFlow organization identifier for your tenant"),
    },
    async ({ clientId, clientSecret, organizationId }) => {
      try {
        const credentials = validateCredentials({ clientId, clientSecret, organizationId });
        const client = new FormFlowClient(credentials);

        // Force token generation by calling the private method
        const token = await (client as any).getAccessToken();
        
        return {
          content: [
            {
              type: "text",
              text: `✅ Token exchange successful!\n\n` +
                `🔑 **Bearer Token**: ${token}\n\n` +
                `⏰ **Expires**: 1 hour from now\n` +
                `📝 **Usage**: Use this token with other FormFlow tools by providing it as the 'bearerToken' parameter\n\n` +
                `⚠️  **Security Note**: This token provides full access to your FormFlow organization. Keep it secure and never expose it in logs or client-side code.`
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `❌ **Token exchange failed**\n\n` +
                `**Error**: ${error instanceof Error ? error.message : 'Unknown error occurred'}\n\n` +
                `**Troubleshooting**:\n` +
                `• Verify your clientId, clientSecret, and organizationId are correct\n` +
                `• Ensure you have network connectivity to FormFlow development API\n` +
                `• Check if your credentials have not expired\n` +
                `• Contact FormFlow support if credentials were recently issued`
            }
          ],
          isError: true
        };
      }
    }
  );
}