import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerListDocumentsToolClaimManagement } from './list-documents';
import { registerUploadDocumentToolClaimManagement } from './upload-document';
import { registerUpdateDocumentToolClaimManagement } from './update-document';
import { registerDeleteDocumentToolClaimManagement } from './delete-document';
import { registerDownloadDocumentToolClaimManagement } from './download-document';
import { registerDownloadThumbnailToolClaimManagement } from './download-thumbnail';
import { registerRenderDocumentToolClaimManagement } from './render-document';
import { registerGenerateDocumentToolClaimManagement } from './generate-document';

export function registerDocumentsTools(server: McpServer) {
  registerListDocumentsToolClaimManagement(server);
  registerUploadDocumentToolClaimManagement(server);
  registerUpdateDocumentToolClaimManagement(server);
  registerDeleteDocumentToolClaimManagement(server);
  registerDownloadDocumentToolClaimManagement(server);
  registerDownloadThumbnailToolClaimManagement(server);
  registerRenderDocumentToolClaimManagement(server);
  registerGenerateDocumentToolClaimManagement(server);
}