/**
 * Manage High-Risk Data Tool
 * Handles bulk high-risk case data operations
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../client";

export function registerManageHighRiskDataTool(server: McpServer) {
  server.tool(
    "ledger_manage_high_risk_data",
    "Manage bulk high-risk case data including export, import, and querying operations",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      operation: z.enum(["export", "import", "get", "import_log"]).describe("Operation to perform"),
      operationData: z.object({
        criteria: z.record(z.any()).optional().describe("Query criteria for get/export operations"),
        data: z.array(z.record(z.any())).optional().describe("Data for import operation"),
        format: z.string().optional().describe("Data format (json, csv, excel)"),
        importId: z.string().optional().describe("Import ID for checking logs")
      }).optional().describe("Operation-specific data")
    },
    async ({ bearerToken, tenantId, operation, operationData }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        let endpoint;
        let response;
        
        switch (operation) {
          case "export":
            endpoint = `/api/v1/ledger/sales/risks/high-risk/export`;
            response = await client.get(endpoint);
            break;
          case "import":
            endpoint = `/api/v1/ledger/sales/risks/high-risk/import`;
            response = await client.post(endpoint, operationData?.data || []);
            break;
          case "get":
            endpoint = `/api/v1/ledger/sales/risks/high-risk/get`;
            response = await client.post(endpoint, operationData?.criteria || {});
            break;
          case "import_log":
            endpoint = `/api/v1/ledger/sales/risks/high-risk/import/log`;
            response = await client.get(endpoint);
            break;
        }

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                operation: operation,
                result: response,
                operationData: operationData
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
                error: "Failed to manage high-risk data",
                details: error.message,
                statusCode: error.status,
                operation: operation
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}