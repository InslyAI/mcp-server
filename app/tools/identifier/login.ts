import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { IdentifierClient } from "./client";

export function registerIdentifierLoginTool(server: McpServer) {
  server.tool(
    "identifier_login",
    "Login to Insly Identifier service with username and password to get JWT bearer token. This token is required for all Ledger API operations.",
    {
      username: z.string().describe("Insly username/email (e.g., rasim.mehtijev@insly.com)"),
      password: z.string().describe("User password"),
      tenantTag: z.string().describe("Tenant identifier (e.g., 'accelerate')"),
    },
    async ({ username, password, tenantTag }) => {
      try {
        const client = new IdentifierClient(tenantTag);
        
        const result = await client.login({
          username,
          password,
          tenantTag
        });

        // Check if we got an authentication result with access token
        if (result.authentication_result?.access_token) {
          const { access_token, expires_in, token_type, refresh_token } = result.authentication_result;
          
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  success: true,
                  access_token,
                  token_type: token_type || "Bearer",
                  expires_in: expires_in || 3600,
                  refresh_token,
                  tenant: tenantTag,
                  message: "Login successful! Use the access_token as bearerToken for Ledger API calls.",
                  usage: {
                    bearerToken: access_token,
                    tenantId: tenantTag,
                    exampleLedgerCall: "ledger_list_binders({ bearerToken, tenantId: 'accelerate', ... })"
                  }
                }, null, 2)
              }
            ]
          };
        } 
        
        // Handle challenge-based authentication (MFA, password reset, etc.)
        if (result.challenge_name) {
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  success: false,
                  requiresChallenge: true,
                  challenge_name: result.challenge_name,
                  challenge_parameters: result.challenge_parameters,
                  message: `Authentication requires additional challenge: ${result.challenge_name}`,
                  nextSteps: "Use identifier_challenge tool to complete authentication"
                }, null, 2)
              }
            ]
          };
        }

        // Unexpected response format
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: false,
                error: "Unexpected response format from Identifier service",
                response: result,
                troubleshooting: {
                  credentials: "Verify username, password, and tenantTag are correct",
                  service: "Check if Identifier service is accessible",
                  tenant: "Ensure tenant 'accelerate' exists and is active"
                }
              }, null, 2)
            }
          ]
        };

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: false,
                error: errorMessage,
                troubleshooting: {
                  credentials: "Verify username and password are correct",
                  tenant: "Check tenant identifier (should be 'accelerate')",
                  network: "Ensure access to https://accelerate.app.beta.insly.training",
                  service: "Verify Identifier service is operational",
                  testCredentials: {
                    username: "rasim.mehtijev@insly.com",
                    password: "[test password]",
                    tenantTag: "accelerate"
                  }
                }
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}