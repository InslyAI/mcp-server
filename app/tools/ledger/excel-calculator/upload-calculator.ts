/**
 * Upload Excel Calculator Tool
 * Uploads and manages Excel-based calculation tools
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../client";

export function registerUploadExcelCalculatorTool(server: McpServer) {
  server.tool(
    "ledger_excel_calculator_upload",
    "Upload and configure Excel-based calculation tools for insurance pricing and underwriting",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      calculatorData: z.object({
        name: z.string().describe("Name of the calculator"),
        description: z.string().describe("Description of the calculator purpose"),
        productType: z.string().describe("Insurance product type this calculator is for"),
        version: z.string().describe("Version of the calculator"),
        excelFile: z.string().describe("Base64 encoded Excel file content"),
        fileName: z.string().describe("Original Excel file name"),
        configuration: z.object({
          inputCells: z.array(z.string()).describe("Excel cell references for inputs"),
          outputCells: z.array(z.string()).describe("Excel cell references for outputs"),
          validationRules: z.record(z.any()).optional().describe("Input validation rules"),
          defaultValues: z.record(z.any()).optional().describe("Default input values")
        }).describe("Calculator configuration"),
        isActive: z.boolean().optional().describe("Whether calculator is active"),
        accessPermissions: z.array(z.string()).optional().describe("User roles with access")
      }).describe("Excel calculator configuration")
    },
    async ({ bearerToken, tenantId, calculatorData }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const response = await client.post(`/api/v1/ledger/excel-calculator`, calculatorData);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                message: "Excel calculator uploaded successfully",
                calculatorId: response.calculatorId || response.data?.id,
                name: calculatorData.name,
                productType: calculatorData.productType,
                version: calculatorData.version,
                status: response.status || "uploaded",
                validationResult: {
                  isValid: response.validationResult?.isValid || true,
                  errors: response.validationResult?.errors || [],
                  warnings: response.validationResult?.warnings || []
                },
                uploadedAt: new Date().toISOString()
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
                error: "Failed to upload Excel calculator",
                details: error.message,
                statusCode: error.status,
                calculatorName: calculatorData.name
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}