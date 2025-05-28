/**
 * List Reports Tool
 * Gets paginated list of generated reports with filtering options
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../client";

export function registerListReportsTool(server: McpServer) {
  server.tool(
    "ledger_reports_list",
    "Get paginated list of generated business reports with filtering and search options",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      reportType: z.enum([
        'financial_summary',
        'underwriting_performance',
        'claims_analysis',
        'broker_performance',
        'product_analysis',
        'risk_assessment',
        'compliance_audit',
        'renewal_pipeline',
        'premium_analysis',
        'loss_ratio',
        'custom'
      ]).optional().describe("Filter by report type"),
      status: z.enum(['generating', 'completed', 'failed', 'expired', 'archived']).optional().describe("Filter by report status"),
      format: z.enum(['pdf', 'excel', 'csv', 'json', 'html']).optional().describe("Filter by output format"),
      generatedBy: z.string().optional().describe("Filter by user who generated the report"),
      generatedFrom: z.string().optional().describe("Filter by generation date from (ISO date)"),
      generatedTo: z.string().optional().describe("Filter by generation date to (ISO date)"),
      confidentialityLevel: z.enum(['public', 'internal', 'restricted', 'confidential']).optional().describe("Filter by confidentiality level"),
      search: z.string().optional().describe("Search term for report title or description"),
      includeExpired: z.boolean().optional().describe("Whether to include expired reports"),
      page: z.number().optional().describe("Page number for pagination (default: 1)"),
      limit: z.number().optional().describe("Number of results per page (default: 20, max: 100)"),
      sortBy: z.enum(['generatedAt', 'title', 'reportType', 'status', 'fileSize']).optional().describe("Field to sort by"),
      sortOrder: z.enum(['asc', 'desc']).optional().describe("Sort order (default: desc)"),
    },
    async ({ 
      bearerToken, 
      tenantId, 
      reportType,
      status,
      format,
      generatedBy,
      generatedFrom,
      generatedTo,
      confidentialityLevel,
      search,
      includeExpired,
      page,
      limit,
      sortBy,
      sortOrder 
    }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const queryParams = new URLSearchParams();
        if (reportType) queryParams.append('report_type', reportType);
        if (status) queryParams.append('status', status);
        if (format) queryParams.append('format', format);
        if (generatedBy) queryParams.append('generated_by', generatedBy);
        if (generatedFrom) queryParams.append('generated_from', generatedFrom);
        if (generatedTo) queryParams.append('generated_to', generatedTo);
        if (confidentialityLevel) queryParams.append('confidentiality_level', confidentialityLevel);
        if (search) queryParams.append('search', search);
        if (includeExpired) queryParams.append('include_expired', 'true');
        if (page) queryParams.append('page', page.toString());
        if (limit) queryParams.append('limit', limit.toString());
        if (sortBy) queryParams.append('sort_by', sortBy);
        if (sortOrder) queryParams.append('sort_order', sortOrder);
        
        const response = await client.get(
          `/reports?${queryParams.toString()}`
        );

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                reports: response.data.map((report: any) => ({
                  id: report.id,
                  reportNumber: report.reportNumber,
                  title: report.title,
                  description: report.description,
                  reportType: report.reportType,
                  status: report.status,
                  format: report.format,
                  generatedAt: report.generatedAt,
                  generatedBy: report.generatedBy,
                  generatedByName: report.generatedByName,
                  dateRange: report.dateRange,
                  recordCount: report.recordCount,
                  fileSize: report.fileSize,
                  downloadUrl: report.downloadUrl,
                  expiresAt: report.expiresAt,
                  confidentialityLevel: report.confidentialityLevel,
                  isExpired: report.isExpired,
                  tags: report.tags
                })),
                pagination: {
                  currentPage: response.pagination.currentPage,
                  totalPages: response.pagination.totalPages,
                  totalItems: response.pagination.totalItems,
                  itemsPerPage: response.pagination.itemsPerPage,
                  hasNext: response.pagination.hasNext,
                  hasPrevious: response.pagination.hasPrevious
                },
                filters: {
                  reportType,
                  status,
                  format,
                  generatedBy,
                  generatedFrom,
                  generatedTo,
                  confidentialityLevel,
                  search,
                  includeExpired
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
                error: "Failed to retrieve reports",
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