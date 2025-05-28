/**
 * Import Policy Data Tool
 * Imports data into an existing policy from external sources
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../../../client";

export function registerImportPolicyDataTool(server: McpServer) {
  server.tool(
    "ledger_sales_policies_documents_import",
    "Import data into an existing policy from external sources or bulk data",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      policyId: z.string().describe("ID of the policy to import data into"),
      importData: z.object({
        dataSource: z.string().describe("Source of the imported data"),
        dataType: z.string().describe("Type of data being imported"),
        importFormat: z.string().optional().describe("Format of the imported data (JSON, CSV, XML)"),
        data: z.record(z.any()).describe("The actual data to import"),
        mappingRules: z.record(z.string()).optional().describe("Field mapping rules"),
        overwriteExisting: z.boolean().optional().describe("Whether to overwrite existing data"),
        validateData: z.boolean().optional().describe("Whether to validate data before import")
      }).describe("Import configuration and data")
    },
    async ({ bearerToken, tenantId, policyId, importData }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const response = await client.post(`/api/v1/ledger/sales/policies/${policyId}/import-data`, importData);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                policyId: policyId,
                importResult: {
                  importId: response.importId,
                  recordsProcessed: response.recordsProcessed,
                  recordsSuccessful: response.recordsSuccessful,
                  recordsFailed: response.recordsFailed,
                  validationErrors: response.validationErrors || [],
                  warnings: response.warnings || []
                },
                importData: {
                  dataSource: importData.dataSource,
                  dataType: importData.dataType,
                  recordCount: Object.keys(importData.data).length
                }
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
                error: "Failed to import policy data",
                details: error.message,
                statusCode: error.status,
                policyId: policyId
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}