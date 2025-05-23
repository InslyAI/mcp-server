import { createMcpHandler } from "@vercel/mcp-adapter";
import { registerAllTools } from "../tools";

const handler = createMcpHandler(
  (server) => {
    registerAllTools(server);
  },
  {
    capabilities: {
      tools: {
        echo: {
          description: "Echo a message",
        },
        calculator: {
          description: "Perform basic mathematical calculations",
        },
      },
    },
  },
  {
    redisUrl: process.env.REDIS_URL,
    basePath: "",
    verboseLogs: true,
    maxDuration: 800,
  }
);

export { handler as GET, handler as POST, handler as DELETE };
