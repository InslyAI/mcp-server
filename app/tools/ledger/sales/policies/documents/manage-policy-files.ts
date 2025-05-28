/**
 * Manage Policy Files Tool
 * Upload and manage files associated with a policy
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createLedgerClient } from "../../../client";

export function registerManagePolicyFilesTool(server: McpServer) {
  server.tool(
    "ledger_sales_policies_documents_manage",
    "Upload and manage files associated with a policy",
    {
      bearerToken: z.string().min(1).describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      policyId: z.string().min(1).describe("ID of the policy to manage files for"),
      action: z.enum(["list", "upload", "delete"]).describe("Action to perform on policy files"),
      fileData: z.object({
        fileName: z.string().optional().describe("Name of the file"),
        fileType: z.string().optional().describe("Type/category of the file"),
        fileContent: z.string().optional().describe("Base64 encoded file content for upload"),
        fileId: z.string().optional().describe("File ID for delete action"),
        description: z.string().optional().describe("Description of the file")
      }).optional().describe("File data for upload/delete actions")
    },
    async ({ bearerToken, tenantId, policyId, action, fileData }) => {
      try {
        const client = createLedgerClient(bearerToken, tenantId);
        
        const endpoint = `/api/v1/ledger/sales/policies/${policyId}/files`;
        let response;

        switch (action) {
          case "list":
            response = await client.get(endpoint);
            break;
          case "upload":
            if (!fileData?.fileName || !fileData?.fileContent) {
              throw new Error("fileName and fileContent are required for upload");
            }
            response = await client.post(endpoint, {
              fileName: fileData.fileName,
              fileType: fileData.fileType,
              fileContent: fileData.fileContent,
              description: fileData.description
            });
            break;
          case "delete":
            if (!fileData?.fileId) {
              throw new Error("fileId is required for delete");
            }
            response = await client.delete(`${endpoint}/${fileData.fileId}`);
            break;
        }

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                policyId: policyId,
                action: action,
                result: response,
                fileInfo: fileData
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
                error: "Failed to manage policy files",
                details: error.message,
                statusCode: error.status,
                policyId: policyId,
                action: action
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}