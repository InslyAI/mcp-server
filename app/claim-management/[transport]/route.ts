import { createMcpHandler } from "@vercel/mcp-adapter";
import { registerClaimManagementTools } from "../../tools/claim-management";

const handler = createMcpHandler(
  (server) => {
    registerClaimManagementTools(server);
  },
  {
    // Remove hardcoded capabilities - let MCP adapter auto-discover registered tools
  },
  {
    redisUrl: process.env.REDIS_URL,
    basePath: "/claim-management",
    verboseLogs: true,
    maxDuration: 800,
  }
);

export { handler as GET, handler as POST, handler as DELETE };