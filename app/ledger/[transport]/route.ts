import { createMcpHandler } from "@vercel/mcp-adapter";
import { registerLedgerTools } from "../../tools/ledger";

const handler = createMcpHandler(
  (server) => {
    registerLedgerTools(server);
  },
  {
    capabilities: {
      tools: {},
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
