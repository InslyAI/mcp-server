/**
 * Document MCP Tools Registration
 * Document generation and file management tools
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerGetDocumentTypesTools } from "./get-document-types";
import { registerGenerateQuoteDocumentTools } from "./generate-quote-document";
import { registerUploadQuoteFilesTools } from "./upload-quote-files";

/**
 * Register remaining Document MCP tools
 * Note: Policy document tools moved to policies/documents
 */
export function registerDocumentTools(server: McpServer) {
  registerGetDocumentTypesTools(server);
  registerGenerateQuoteDocumentTools(server);
  registerUploadQuoteFilesTools(server);
}