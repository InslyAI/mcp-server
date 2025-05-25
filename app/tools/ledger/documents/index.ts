/**
 * Document MCP Tools Registration
 * Document generation and file management tools
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerGetDocumentTypesTools } from "./get-document-types";
import { registerGeneratePolicyDocumentTools } from "./generate-policy-document";
import { registerGenerateQuoteDocumentTools } from "./generate-quote-document";
import { registerUploadPolicyFilesTools } from "./upload-policy-files";
import { registerUploadQuoteFilesTools } from "./upload-quote-files";

/**
 * Register all Document MCP tools
 */
export function registerDocumentTools(server: McpServer) {
  registerGetDocumentTypesTools(server);
  registerGeneratePolicyDocumentTools(server);
  registerGenerateQuoteDocumentTools(server);
  registerUploadPolicyFilesTools(server);
  registerUploadQuoteFilesTools(server);
}