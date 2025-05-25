/**
 * Get Report Tool
 * Retrieves detailed information about a specific report
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../client";

export function registerGetReportTool(server: McpServer) {
  server.tool(
    "ledger_get_report",
    "Get detailed information about a specific business report including metadata and download access",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      reportId: z.string().describe("ID of the report to retrieve"),
      includeConfig: z.boolean().optional().describe("Whether to include original generation configuration"),
      includePreview: z.boolean().optional().describe("Whether to include data preview (first few rows)"),
      generateNewDownloadUrl: z.boolean().optional().describe("Whether to generate a new download URL"),
    },
    async ({ bearerToken, tenantId, reportId, includeConfig, includePreview, generateNewDownloadUrl }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const queryParams = new URLSearchParams();
        if (includeConfig) queryParams.append('include_config', 'true');
        if (includePreview) queryParams.append('include_preview', 'true');
        if (generateNewDownloadUrl) queryParams.append('generate_new_url', 'true');
        
        const endpoint = `/reports/${reportId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        
        const response = await client.get(endpoint);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                report: {
                  id: response.id,
                  reportNumber: response.reportNumber,
                  title: response.title,
                  description: response.description,
                  reportType: response.reportType,
                  status: response.status,
                  format: response.format,
                  generatedAt: response.generatedAt,
                  generatedBy: response.generatedBy,
                  generatedByName: response.generatedByName,
                  dateRange: response.dateRange,
                  recordCount: response.recordCount,
                  fileSize: response.fileSize,
                  fileSizeFormatted: response.fileSizeFormatted,
                  downloadUrl: response.downloadUrl,
                  expiresAt: response.expiresAt,
                  isExpired: response.isExpired,
                  confidentialityLevel: response.confidentialityLevel,
                  processingTime: response.processingTime,
                  checksum: response.checksum,
                  tags: response.tags,
                  accessHistory: response.accessHistory,
                  ...(includeConfig && { originalConfig: response.originalConfig }),
                  ...(includePreview && { dataPreview: response.dataPreview })
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
                error: "Failed to retrieve report",
                details: error.message,
                statusCode: error.status
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}