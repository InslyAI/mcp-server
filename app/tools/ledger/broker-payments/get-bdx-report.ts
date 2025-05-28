/**
 * Get BDX Report Tool
 * Retrieves the generated BDX broker payment report data
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createLedgerClient } from "../client";

export function registerGetBdxReportTool(server: McpServer) {
  server.tool(
    "ledger_broker_payments_get",
    "Get the generated BDX broker payment report data using the event ID",
    {
      bearerToken: z.string().min(1).describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      eventId: z.string().describe("Event ID from the BDX report creation"),
    },
    async ({ bearerToken, tenantId, eventId }) => {
      try {
        const client = createLedgerClient(bearerToken, tenantId);
        
        const response = await client.get(`/api/v1/ledger/broker-payments/bdx/${eventId}`);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                eventId: eventId,
                reportData: response,
                generatedAt: new Date().toISOString()
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
                error: "Failed to retrieve BDX report",
                details: error.message,
                statusCode: error.status,
                eventId: eventId
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}