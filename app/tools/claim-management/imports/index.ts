import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerValidateBdxToolClaimManagement } from './validate-bdx';
import { registerImportBdxToolClaimManagement } from './import-bdx';
import { registerGetImportStatusToolClaimManagement } from './get-import-status';
import { registerListImportJobsToolClaimManagement } from './list-import-jobs';
import { registerGetImportLogsToolClaimManagement } from './get-import-logs';
import { registerGetImportableProductsToolClaimManagement } from './get-importable-products';

export function registerImportsTools(server: McpServer) {
  registerValidateBdxToolClaimManagement(server);
  registerImportBdxToolClaimManagement(server);
  registerGetImportStatusToolClaimManagement(server);
  registerListImportJobsToolClaimManagement(server);
  registerGetImportLogsToolClaimManagement(server);
  registerGetImportableProductsToolClaimManagement(server);
}
