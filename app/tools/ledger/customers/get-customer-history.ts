/**
 * Get Customer History Tool
 * Retrieves historical activity and interaction history for a customer
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../client";

export function registerGetCustomerHistoryTool(server: McpServer) {
  server.tool(
    "ledger_customers_get",
    "Get historical activity and interaction history for a customer including policy changes, payments, claims, and communications",
    {
      bearerToken: z.string().min(1).describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      customerId: z.string().min(1).describe("ID of the customer to get history for"),
      limit: z.number().optional().describe("Maximum number of history records to return"),
      offset: z.number().optional().describe("Number of records to skip for pagination"),
      activityType: z.string().optional().describe("Filter by specific activity type (policy, payment, claim, communication, etc.)"),
      dateFrom: z.string().optional().describe("Start date for filtering history (YYYY-MM-DD)"),
      dateTo: z.string().optional().describe("End date for filtering history (YYYY-MM-DD)")
    },
    async ({ bearerToken, tenantId, customerId, limit, offset, activityType, dateFrom, dateTo }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const queryParams = new URLSearchParams();
        if (limit) queryParams.append('limit', limit.toString());
        if (offset) queryParams.append('offset', offset.toString());
        if (activityType) queryParams.append('activity_type', activityType);
        if (dateFrom) queryParams.append('date_from', dateFrom);
        if (dateTo) queryParams.append('date_to', dateTo);
        
        const endpoint = `/api/v1/ledger/customers/${customerId}/history${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        
        const response = await client.get(endpoint);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                customerId: customerId,
                filters: {
                  activityType: activityType || "all",
                  dateFrom: dateFrom || null,
                  dateTo: dateTo || null,
                  limit: limit || null,
                  offset: offset || 0
                },
                history: {
                  activities: response.activities || response.data || [],
                  totalCount: response.totalCount || 0,
                  hasMore: response.hasMore || false,
                  summary: {
                    policyChanges: response.summary?.policyChanges || 0,
                    payments: response.summary?.payments || 0,
                    claims: response.summary?.claims || 0,
                    communications: response.summary?.communications || 0,
                    systemUpdates: response.summary?.systemUpdates || 0
                  },
                  timeline: response.timeline || [],
                  recentActivity: response.recentActivity || []
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
                error: "Failed to retrieve customer history",
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