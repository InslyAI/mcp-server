import { createMcpHandler } from "@vercel/mcp-adapter";
import { registerLedgerTools } from "../../tools/ledger";

const handler = createMcpHandler(
  (server) => {
    registerLedgerTools(server);
  },
  {
    capabilities: {
      tools: {
        ledger_login: {
          description:
            "Login with username and password to get JWT bearer token for Ledger API access",
        },
      },
    },
  },
  {
    redisUrl: process.env.REDIS_URL,
    basePath: "/ledger",
    verboseLogs: true,
    maxDuration: 800,
  }
);

export { handler as GET, handler as POST, handler as DELETE };
