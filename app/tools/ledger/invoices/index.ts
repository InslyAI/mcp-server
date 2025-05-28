/**
 * Invoice File Management Tools
 * File operations for invoice documents
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerManageInvoiceFilesTool, registerInvoiceFileValidationTool } from "./manage-invoice-files";

export function registerInvoiceFilesTools(server: McpServer) {
  registerManageInvoiceFilesTool(server);
  registerInvoiceFileValidationTool(server);
}

// Export individual registration functions
export { registerManageInvoiceFilesTool, registerInvoiceFileValidationTool };