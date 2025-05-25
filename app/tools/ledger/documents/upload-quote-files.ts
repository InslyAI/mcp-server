import { createLedgerClient } from "../client";
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerUploadQuoteFilesTools(server: McpServer) {
  server.tool(
    "ledger_upload_quote_files",
    "Upload one or more files to a quote. Files are attached as supporting documents to the quote record",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header (e.g., 'accelerate')"),
      quoteId: z.number().int().positive().describe("Unique identifier of the quote"),
      files: z.array(z.object({
        content: z.string().describe("Base64 encoded file content"),
        fileName: z.string().describe("Name of the file including extension"),
        mimeType: z.string().optional().describe("MIME type of the file (auto-detected if not provided)")
      })).describe("Array of files to upload"),
    },
    async ({ bearerToken, tenantId, quoteId, files }) => {
      try {
        const url = `https://${tenantId}.app.beta.insly.training/api/v1/ledger/sales/policies/${quoteId}/files`;
        
        // Create FormData for multipart upload
        const formData = new FormData();
        
        for (const file of files) {
          // Convert base64 to blob
          const binaryData = atob(file.content);
          const bytes = new Uint8Array(binaryData.length);
          for (let i = 0; i < binaryData.length; i++) {
            bytes[i] = binaryData.charCodeAt(i);
          }
          
          // Detect MIME type if not provided
          const mimeType = file.mimeType || getMimeTypeFromFileName(file.fileName);
          const blob = new Blob([bytes], { type: mimeType });
          
          // Add file to form data (API expects file[] array)
          formData.append('file[]', blob, file.fileName);
        }
        
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${bearerToken}`,
            'X-Tenant-ID': tenantId,
            // Don't set Content-Type for FormData, let browser set it with boundary
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                uploadedDocuments: data,
                quoteId,
                filesCount: files.length,
                meta: {
                  quoteId,
                  filesUploaded: files.length,
                  fileNames: files.map(f => f.fileName),
                  uploadedAt: new Date().toISOString(),
                },
                message: `Successfully uploaded ${files.length} file(s) to quote ${quoteId}`,
                relatedTools: {
                  generate: "Use ledger_generate_quote_document to create quote documents",
                  issue: "Use ledger_issue_quote to convert quote to policy"
                }
              }, null, 2)
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred',
                quoteId,
                filesCount: files.length,
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}

// Helper function to detect MIME type from file extension
function getMimeTypeFromFileName(fileName: string): string {
  const extension = fileName.toLowerCase().split('.').pop();
  const mimeTypes: Record<string, string> = {
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'xls': 'application/vnd.ms-excel',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'txt': 'text/plain',
    'csv': 'text/csv',
    'zip': 'application/zip',
  };
  return mimeTypes[extension || ''] || 'application/octet-stream';
}