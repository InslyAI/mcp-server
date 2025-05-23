/**
 * Ledger MCP Endpoint
 * 
 * Note: This endpoint is prepared but tools are not yet implemented.
 * Once Ledger API schemas are available, tools will be added to the capabilities.
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
        // TODO: Add actual Ledger tools here once API schemas are available
        // Example structure (will be replaced with real tools):
        // ledger_create_transaction: {
        //   description: "Create a new transaction in the ledger",
        // },
        // ledger_get_balance: {
        //   description: "Get account balance from the ledger",
        // },
        // ledger_list_accounts: {
        //   description: "List all accounts in the ledger",
        // },
        // ... other Ledger tools based on API schema
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