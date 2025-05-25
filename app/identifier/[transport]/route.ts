import { createMcpHandler } from "@vercel/mcp-adapter";
import { registerIdentifierTools } from "../../tools/identifier";

const handler = createMcpHandler(
  (server) => {
    registerIdentifierTools(server);
  },
  {
    capabilities: {
      tools: {
        identifier_login: {
          description: "Login with username and password to get JWT bearer token for Ledger API access",
        },
        identifier_client_credentials: {
          description: "Authenticate with client credentials to get JWT bearer token",
        },
        identifier_refresh_token: {
          description: "Refresh expired JWT bearer token using refresh token",
        },
      },
    },
  },
  {
    redisUrl: process.env.REDIS_URL,
    basePath: "/identifier",
    verboseLogs: true,
    maxDuration: 800,
  }
);

export { handler as GET, handler as POST, handler as DELETE };