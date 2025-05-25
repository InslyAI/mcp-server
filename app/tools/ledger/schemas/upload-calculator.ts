import { createLedgerClient } from "../client";
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerUploadCalculatorTools(server: McpServer) {
  server.tool(
    "ledger_upload_calculator",
    "Upload an Excel calculator file that can be used in policy schemas for premium calculations. Returns a calculator ID for use in schemas",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header (e.g., 'accelerate')"),
      fileContent: z.string().describe("Base64 encoded Excel file content"),
      fileName: z.string().describe("Name of the Excel file (e.g., 'calculator.xlsx')"),
    },
    async ({ bearerToken, tenantId, fileContent, fileName }) => {
      try {
        // Note: This is a simplified implementation. In practice, you'd need to handle
        // multipart/form-data file uploads properly with FormData
        const url = `https://${tenantId}.app.beta.insly.training/api/v1/ledger/excel-calculator`;
        
        // Convert base64 to blob for upload
        const binaryData = atob(fileContent);
        const bytes = new Uint8Array(binaryData.length);
        for (let i = 0; i < binaryData.length; i++) {
          bytes[i] = binaryData.charCodeAt(i);
        }
        const blob = new Blob([bytes], { 
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
        });
        
        const formData = new FormData();
        formData.append('file', blob, fileName);
        
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${bearerToken}`,
            'X-Tenant-ID': tenantId,
            // Note: Don't set Content-Type for FormData, let browser set it with boundary
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
                calculatorId: data.calculatorId,
                fileName,
                message: "Excel calculator uploaded successfully",
                meta: {
                  calculatorId: data.calculatorId,
                  fileName,
                  uploadedAt: new Date().toISOString(),
                },
                usage: "Use the returned calculatorId in policy schemas to enable premium calculations with this Excel file.",
                relatedTools: {
                  schema: "Reference this calculatorId in product schemas obtained with ledger_get_schema",
                  debug: "Use calculation debug tools to test the calculator with sample data"
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
                fileName,
                note: "Ensure the file is a valid Excel (.xlsx) format and contains proper calculation formulas"
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}