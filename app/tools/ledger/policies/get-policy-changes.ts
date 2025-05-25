/**
 * Get Policy Changes Tool
 * Retrieves change history and modifications for a policy
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../client";

export function registerGetPolicyChangesTool(server: McpServer) {
  server.tool(
    "ledger_get_policy_changes",
    "Get detailed change history and modifications for a specific policy",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      policyId: z.string().describe("ID of the policy to get changes for"),
      changeFilters: z.object({
        changeType: z.string().optional().describe("Filter by type of change"),
        dateFrom: z.string().optional().describe("Start date for changes (YYYY-MM-DD)"),
        dateTo: z.string().optional().describe("End date for changes (YYYY-MM-DD)"),
        userId: z.string().optional().describe("Filter by user who made changes"),
        includeSystemChanges: z.boolean().optional().describe("Include system-generated changes")
      }).optional().describe("Change filtering options")
    },
    async ({ bearerToken, tenantId, policyId, changeFilters }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const queryParams = new URLSearchParams();
        if (changeFilters) {
          Object.entries(changeFilters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              queryParams.append(key, value.toString());
            }
          });
        }
        
        const endpoint = `/api/v1/ledger/sales/policies/${policyId}/changes${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        
        const response = await client.get(endpoint);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                policyId: policyId,
                changes: {
                  changeHistory: response.changes || response,
                  totalChanges: response.totalChanges || 0,
                  latestChange: response.latestChange,
                  changesSummary: response.changesSummary
                },
                changeFilters: changeFilters || {}
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
                error: "Failed to retrieve policy changes",
                details: error.message,
                statusCode: error.status,
                policyId: policyId
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}