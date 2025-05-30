import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { IdentifierClient } from "./client";

export function registerIdentifierRefreshTokenTool(server: McpServer) {
  server.tool(
    "identifier_refresh_token",
    "Refresh an expired JWT bearer token using a refresh token. Use this when the access token expires to get a new token without re-entering credentials.",
    {
      refreshToken: z
        .string()
        .describe("Refresh token obtained from previous login"),
      username: z
        .string()
        .describe("Username that was used for the original login"),
      tenantTag: z.string().describe("Tenant identifier (e.g., 'accelerate')"),
    },
    async ({ refreshToken, username, tenantTag }) => {
      try {
        const client = new IdentifierClient(tenantTag);

        const result = await client.refreshToken({
          refresh_token: refreshToken,
          username,
          tenantTag,
        });

        // Check if we got a new authentication result
        if (result.authentication_result?.access_token) {
          const { access_token, expires_in, token_type, refresh_token } =
            result.authentication_result;

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(
                  {
                    success: true,
                    access_token,
                    token_type: token_type || "Bearer",
                    expires_in: expires_in || 3600,
                    refresh_token: refresh_token || refreshToken, // Use new refresh token or keep old one
                    tenant: tenantTag,
                    message:
                      "Token refresh successful! Use the new access_token as bearerToken for Ledger API calls.",
                    usage: {
                      bearerToken: access_token,
                      tenantId: tenantTag,
                      exampleLedgerCall:
                        "ledger_list_binders({ bearerToken, tenantId: 'accelerate', ... })",
                    },
                  },
                  null,
                  2,
                ),
              },
            ],
          };
        }

        // Handle challenge-based refresh (if required)
        if (result.challenge_name) {
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(
                  {
                    success: false,
                    requiresChallenge: true,
                    challenge_name: result.challenge_name,
                    challenge_parameters: result.challenge_parameters,
                    message: `Token refresh requires additional challenge: ${result.challenge_name}`,
                    nextSteps:
                      "May need to re-authenticate with identifier_login",
                  },
                  null,
                  2,
                ),
              },
            ],
          };
        }

        // Unexpected response format
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: false,
                  error: "Unexpected response format from token refresh",
                  response: result,
                  troubleshooting: {
                    refreshToken:
                      "Verify refresh token is valid and not expired",
                    username: "Ensure username matches the original login",
                    tenant: "Check tenant identifier is correct",
                    reAuthenticate:
                      "Consider using identifier_login to get new tokens",
                  },
                },
                null,
                2,
              ),
            },
          ],
        };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: false,
                  error: errorMessage,
                  troubleshooting: {
                    refreshToken:
                      "Verify refresh token is valid and not expired",
                    username: "Check username matches the original login",
                    tenant:
                      "Ensure tenant identifier is correct ('accelerate')",
                    network:
                      "Check network access to https://accelerate.app.devbox.insly.training",
                    reAuthenticate:
                      "If refresh fails, use identifier_login to get new tokens",
                    tokenLifetime: "Refresh tokens may have limited lifetime",
                  },
                },
                null,
                2,
              ),
            },
          ],
        };
      }
    },
  );
}
