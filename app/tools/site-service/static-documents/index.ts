import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerGetStaticDocumentsTool } from "./get-static-documents";
import { registerUploadStaticDocumentsTool } from "./upload-static-documents";
import { registerGetStaticDocumentTool } from "./get-static-document";
import { registerDeleteStaticDocumentTool } from "./delete-static-document";

export function registerStaticDocumentsTools(server: McpServer) {
  registerGetStaticDocumentsTool(server);
  registerUploadStaticDocumentsTool(server);
  registerGetStaticDocumentTool(server);
  registerDeleteStaticDocumentTool(server);
}