import { z } from "zod";
import type { McpServer } from "@vercel/mcp-adapter";

export function registerEchoTool(server: McpServer) {
  server.tool(
    "echo",
    "Echo a message",
    { message: z.string() },
    async ({ message }) => ({
      content: [{ type: "text", text: `Tool echo: ${message}` }],
    })
  );
}