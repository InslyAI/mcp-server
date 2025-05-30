import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { IdentifierClient } from "./client";

export function registerIdentifierClientCredentialsTool(server: McpServer) {
  server.tool(
    "identifier_client_credentials",
    "Authenticate with Insly Identifier service using client credentials (client ID and secret) to get JWT bearer token. Alternative to username/password authentication.",
    {
      clientId: z.string().describe("Client identifier provided by Insly"),
      clientSecret: z.string().describe("Client secret (keep secure)"),
      tenantTag: z.string().describe("Tenant identifier (e.g., 'accelerate')"),
      scope: z.string().optional().describe("Optional scope for the token"),
      env: z
        .enum(["beta", "devbox"])
        .default("beta")
        .describe("Environment, one of 'beta' or 'devbox'"),
    },
    async ({ clientId, clientSecret, tenantTag, scope, env }) => {
      try {
        const client = new IdentifierClient(tenantTag, env);

        const result = await client.clientCredentials({
          clientId,
          clientSecret,
          tenantTag,
          scope,
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: true,
                  access_token: result.access_token,
                  token_type: result.token_type || "Bearer",
                  expires_in: result.expires_in || 3600,
                  tenant: tenantTag,
                  scope: scope || "default",
                  message:
                    "Client credentials authentication successful! Use the access_token as bearerToken for Ledger API calls.",
                  usage: {
                    bearerToken: result.access_token,
                    tenantId: tenantTag,
                    exampleLedgerCall:
                      "ledger_list_binders({ bearerToken, tenantId: 'accelerate', ... })",
                  },
                },
                null,
                2
              ),
            },
          ],
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: false,
                  error: errorMessage,
                  troubleshooting: {
                    credentials: "Verify clientId and clientSecret are valid",
                    tenant: "Check tenant identifier (should be 'accelerate')",
                    network: "Ensure access to https://accelerate.app.beta.insly.training",
                    service: "Verify Identifier service is operational",
                    scope: "Check if specified scope is allowed for this client",
                    clientSetup: "Ensure client credentials are properly configured in Insly",
                  },
                },
                null,
                2
              ),
            },
          ],
        };
      }
    }
  );
}
