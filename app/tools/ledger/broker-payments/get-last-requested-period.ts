/**
 * Get Last Requested Period Tool
 * Retrieves the last requested payment period information
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../client";

export function registerGetLastRequestedPeriodTool(server: McpServer) {
  server.tool(
    "ledger_get_last_requested_period",
    "Get information about the last requested payment period for broker payments",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      brokerId: z.string().optional().describe("Optional broker ID to filter by specific broker"),
    },
    async ({ bearerToken, tenantId, brokerId }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const queryParams = new URLSearchParams();
        if (brokerId) queryParams.append('brokerId', brokerId);
        
        const endpoint = `/api/v1/ledger/brokerpayments/last-requested-period${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        
        const response = await client.get(endpoint);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                lastRequestedPeriod: {
                  periodStart: response.periodStart,
                  periodEnd: response.periodEnd,
                  requestedDate: response.requestedDate,
                  status: response.status,
                  requestedBy: response.requestedBy,
                  totalAmount: response.totalAmount,
                  paymentCount: response.paymentCount,
                  currency: response.currency,
                  broker: response.broker,
                  processingStatus: response.processingStatus,
                  estimatedCompletion: response.estimatedCompletion
                },
                brokerId: brokerId || "all"
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
                error: "Failed to retrieve last requested period",
                details: error.message,
                statusCode: error.status,
                brokerId: brokerId || "all"
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}