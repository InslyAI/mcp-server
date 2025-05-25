/**
 * Ledger MCP Endpoint
 * Complete Ledger API coverage with 164 tools
 */

import { createMcpHandler } from "@vercel/mcp-adapter";
import { registerLedgerTools } from "../../tools/ledger";

const handler = createMcpHandler(
  (server) => {
    registerLedgerTools(server);
  },
  {
    capabilities: {
      tools: {
        // Populated dynamically by tool registration
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