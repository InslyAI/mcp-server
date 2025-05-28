/**
 * Invoice File Management Tools
 * Handle invoice file operations and metadata
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createLedgerClient } from "../client";

export function registerManageInvoiceFilesTool(server: McpServer) {
  server.tool(
    "ledger_invoices_manage",
    "Manage invoice files including upload, download, and metadata operations",
    {
      bearerToken: z.string().min(1).describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      invoiceId: z.string().describe("Invoice ID"),
      operation: z.enum(["list", "upload", "download", "delete", "metadata"]).describe("File operation to perform"),
      fileData: z.object({
        fileName: z.string().optional(),
        fileContent: z.string().optional().describe("Base64 encoded file content"),
        fileType: z.string().optional().describe("MIME type of the file"),
        fileId: z.string().optional().describe("File ID for download/delete operations"),
        metadata: z.record(z.any()).optional().describe("Additional file metadata")
      }).optional().describe("File operation data")
    },
    async ({ bearerToken, tenantId, invoiceId, operation, fileData = {} }) => {
      try {
        const client = createLedgerClient(bearerToken, tenantId);
        
        let endpoint;
        let response;
        
        switch (operation) {
          case "list":
            endpoint = `/api/v1/ledger/invoices/${invoiceId}/files`;
            response = await client.get(endpoint);
            break;
          case "upload":
            endpoint = `/api/v1/ledger/invoices/${invoiceId}/files`;
            response = await client.post(endpoint, {
              fileName: fileData.fileName,
              fileContent: fileData.fileContent,
              fileType: fileData.fileType,
              metadata: fileData.metadata
            });
            break;
          case "download":
            endpoint = `/api/v1/ledger/invoices/${invoiceId}/files/${fileData.fileId}`;
            response = await client.get(endpoint);
            break;
          case "delete":
            endpoint = `/api/v1/ledger/invoices/${invoiceId}/files/${fileData.fileId}`;
            response = await client.delete(endpoint);
            break;
          case "metadata":
            endpoint = `/api/v1/ledger/invoices/${invoiceId}/files/${fileData.fileId}/metadata`;
            if (fileData.metadata) {
              response = await client.put(endpoint, fileData.metadata);
            } else {
              response = await client.get(endpoint);
            }
            break;
        }

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                operation: operation,
                invoiceId: invoiceId,
                result: response,
                fileData: fileData
              }, null, 2)
            }
          ]
        };
      } catch (error: any) {
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: false,
                error: "Failed to manage invoice files",
                details: error.message,
                statusCode: error.status,
                operation: operation,
                invoiceId: invoiceId
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}

export function registerInvoiceFileValidationTool(server: McpServer) {
  server.tool(
    "ledger_invoices_validate",
    "Validate invoice files for compliance, format, and content requirements",
    {
      bearerToken: z.string().min(1).describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      fileData: z.object({
        fileName: z.string().describe("Name of the file to validate"),
        fileContent: z.string().optional().describe("Base64 encoded file content"),
        fileUrl: z.string().url().optional().describe("URL to the file for validation"),
        validationType: z.enum(["format", "content", "compliance", "all"]).describe("Type of validation to perform")
      }).describe("File validation data"),
      validationRules: z.object({
        maxFileSize: z.number().optional().describe("Maximum file size in bytes"),
        allowedFormats: z.array(z.string()).optional().describe("Allowed file formats"),
        requireDigitalSignature: z.boolean().optional().describe("Whether digital signature is required"),
        complianceStandards: z.array(z.string()).optional().describe("Compliance standards to check against")
      }).optional().describe("Validation rules and requirements")
    },
    async ({ bearerToken, tenantId, fileData, validationRules = {} }) => {
      try {
        const client = createLedgerClient(bearerToken, tenantId);
        
        const endpoint = `/api/v1/ledger/invoices/files/validate`;
        const requestData = {
          fileData,
          validationRules
        };
        
        const response = await client.post(endpoint, requestData);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                fileName: fileData.fileName,
                validationType: fileData.validationType,
                validationResult: response,
                validationRules: validationRules
              }, null, 2)
            }
          ]
        };
      } catch (error: any) {
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: false,
                error: "Failed to validate invoice file",
                details: error.message,
                statusCode: error.status,
                fileName: fileData.fileName
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}