import { createMcpHandler } from "@vercel/mcp-adapter";
import { registerSiteServiceTools } from "../../tools/site-service";

export const dynamic = "force-dynamic";
export const maxDuration = 800;

const handler = createMcpHandler(
  (server) => {
    registerSiteServiceTools(server);
  },
  {},
  {
    redisUrl: process.env.REDIS_URL,
    basePath: "/site-service",
    verboseLogs: true,
    maxDuration: 800,
  }
);

export { handler as GET, handler as POST };