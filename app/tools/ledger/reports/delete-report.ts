/**
 * Delete Report Tool
 * Deletes a generated report or cancels a scheduled report
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../client";

export function registerDeleteReportTool(server: McpServer) {
  server.tool(
    "ledger_reports_delete",
    "Delete a generated report file or cancel/delete a scheduled report configuration",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      targetType: z.enum(['generated_report', 'scheduled_report']).describe("Type of deletion: generated report file or scheduled report"),
      targetId: z.string().describe("ID of the generated report or scheduled report to delete"),
      deleteOptions: z.object({
        reason: z.string().optional().describe("Reason for deletion"),
        confirmDeletion: z.boolean().describe("Confirmation that deletion is intended"),
        deleteRelatedFiles: z.boolean().optional().describe("Whether to delete all related files (for generated reports)"),
        notifyRecipients: z.boolean().optional().describe("Whether to notify recipients of deletion (for scheduled reports)"),
        archiveBeforeDelete: z.boolean().optional().describe("Whether to archive before permanent deletion"),
        forceDelete: z.boolean().optional().describe("Force deletion even if report is referenced elsewhere")
      }).describe("Deletion configuration and options"),
    },
    async ({ bearerToken, tenantId, targetType, targetId, deleteOptions }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const endpoint = targetType === 'generated_report' 
          ? `/reports/${targetId}` 
          : `/reports/schedules/${targetId}`;
        
        const response = await client.delete(endpoint, {
          ...deleteOptions,
          targetType
        });

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                deletion: {
                  targetType: response.targetType,
                  targetId: response.targetId,
                  deletedAt: response.deletedAt,
                  deletedBy: response.deletedBy,
                  reason: response.reason,
                  filesDeleted: response.filesDeleted,
                  archived: response.archived,
                  archiveLocation: response.archiveLocation,
                  notificationsSent: response.notificationsSent,
                  ...(targetType === 'generated_report' && {
                    reportTitle: response.reportTitle,
                    fileSize: response.fileSize,
                    originalGeneratedAt: response.originalGeneratedAt
                  }),
                  ...(targetType === 'scheduled_report' && {
                    scheduleName: response.scheduleName,
                    upcomingRunsCancelled: response.upcomingRunsCancelled,
                    recipientsNotified: response.recipientsNotified
                  })
                },
                message: `${targetType === 'generated_report' ? 'Report' : 'Scheduled report'} deleted successfully`
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
                error: `Failed to delete ${targetType}`,
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