import { createMcpHandler } from "@vercel/mcp-adapter";
import { registerAllTools } from "../tools";

const handler = createMcpHandler(
  (server) => {
    registerAllTools(server);
  },
  {
    // Remove hardcoded capabilities - let MCP adapter auto-discover all registered tools
  },
  {
    redisUrl: process.env.REDIS_URL,
    basePath: "",
    verboseLogs: true,
    maxDuration: 800,
  }
);

export { handler as GET, handler as POST, handler as DELETE };
