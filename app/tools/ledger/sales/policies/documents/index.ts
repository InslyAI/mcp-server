/**
 * Sales Policies Documents Tools Registration
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { registerGetPolicyDocumentsTool } from "./get-policy-documents";
import { registerImportPolicyDataTool } from "./import-policy-data";
import { registerManagePolicyFilesTool } from "./manage-policy-files";
import { registerSendPolicyEmailTool } from "./send-policy-email";

export function registerSalesPoliciesDocumentsTools(server: McpServer) {
  registerGetPolicyDocumentsTool(server);
  registerImportPolicyDataTool(server);
  registerManagePolicyFilesTool(server);
  registerSendPolicyEmailTool(server);
}