import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerCreateProductTool } from "./create-product";
import { registerCopyProductTool } from "./copy-product";

export function registerProductsTools(server: McpServer) {
  registerCreateProductTool(server);
  registerCopyProductTool(server);
}