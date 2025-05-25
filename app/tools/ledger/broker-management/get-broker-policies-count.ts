/**
 * Get Broker Policies Count Tool
 * Gets policy count for broker merge validation
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../client";

export function registerGetBrokerPoliciesCountTool(server: McpServer) {
  server.tool(
    "ledger_get_broker_policies_count",
    "Get policy count for a broker to validate merge operations and assess impact",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      brokerId: z.string().describe("ID of the broker to get policy count for"),
      includeInactive: z.boolean().optional().describe("Include inactive/terminated policies"),
      groupByStatus: z.boolean().optional().describe("Group results by policy status"),
      dateRange: z.object({
        from: z.string().optional(),
        to: z.string().optional()
      }).optional().describe("Date range for policy filtering")
    },
    async ({ bearerToken, tenantId, brokerId, includeInactive, groupByStatus, dateRange }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const queryParams = new URLSearchParams();
        if (includeInactive) queryParams.append('includeInactive', includeInactive.toString());
        if (groupByStatus) queryParams.append('groupByStatus', groupByStatus.toString());
        if (dateRange?.from) queryParams.append('dateFrom', dateRange.from);
        if (dateRange?.to) queryParams.append('dateTo', dateRange.to);
        
        const endpoint = `/api/v1/ledger/brokers/merge/${brokerId}/policies-count${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        
        const response = await client.get(endpoint);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                brokerId: brokerId,
                policyCounts: {
                  total: response.total || 0,
                  active: response.active || 0,
                  inactive: response.inactive || 0,
                  pending: response.pending || 0,
                  expired: response.expired || 0,
                  byStatus: response.byStatus || {},
                  byProduct: response.byProduct || {},
                  totalPremium: response.totalPremium || 0,
                  averagePremium: response.averagePremium || 0
                },
                mergeImpact: {
                  estimatedMergeTime: response.estimatedMergeTime,
                  complexityScore: response.complexityScore,
                  warnings: response.warnings || []
                },
                dateRange: dateRange || null
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
                error: "Failed to retrieve broker policies count",
                details: error.message,
                statusCode: error.status,
                brokerId: brokerId
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}