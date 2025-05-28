/**
 * Create BDX Report Tool
 * Creates a BDX broker payment report for an insurer
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../client";

export function registerCreateBdxReportTool(server: McpServer) {
  server.tool(
    "ledger_broker_payments_create",
    "Create a BDX broker payment report for an insurer at a specific time",
    {
      bearerToken: z.string().min(1).describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      insurer: z.string().min(1).describe("Insurer identifier for the report"),
      reportTime: z.string().datetime().describe("Report time in ISO format (YYYY-MM-DDTHH:mm:ssZ)"),
    },
    async ({ bearerToken, tenantId, insurer, reportTime }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const queryParams = new URLSearchParams();
        queryParams.append('insurer', insurer);
        queryParams.append('reportTime', reportTime);
        
        const response = await client.post(`/api/v1/ledger/broker-payments/bdx?${queryParams.toString()}`, {});

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                message: "BDX report creation event initiated",
                eventId: response.eventId || response.id,
                insurer: insurer,
                reportTime: reportTime,
                status: "processing"
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
                error: "Failed to create BDX report",
                details: error.message,
                statusCode: error.status,
                insurer: insurer,
                reportTime: reportTime
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}