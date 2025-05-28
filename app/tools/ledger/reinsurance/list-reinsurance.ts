/**
 * List Reinsurance Tool
 * Retrieves reinsurance information and payments
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../client";

export function registerListReinsuranceTool(server: McpServer) {
  server.tool(
    "ledger_reinsurance_list",
    "Retrieve list of reinsurance arrangements and related details",
    {
      bearerToken: z.string().min(1).describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      filters: z.object({
        reinsurerId: z.string().optional().describe("Filter by reinsurer ID"),
        product: z.string().optional().describe("Filter by insurance product"),
        dateFrom: z.string().optional().describe("Start date filter (YYYY-MM-DD)"),
        dateTo: z.string().optional().describe("End date filter (YYYY-MM-DD)")
      }).optional().describe("Filter parameters")
    },
    async ({ bearerToken, tenantId, filters }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const queryParams = new URLSearchParams();
        if (filters) {
          Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              queryParams.append(key, value.toString());
            }
          });
        }
        
        const response = await client.get(`/api/v1/ledger/reinsurance?${queryParams.toString()}`);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                reinsurance: response.data || response,
                filters: filters || {}
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
                error: "Failed to retrieve reinsurance information",
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