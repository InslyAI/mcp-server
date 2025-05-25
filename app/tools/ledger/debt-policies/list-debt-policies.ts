/**
 * List Debt Policies Tool
 * Retrieves policies with outstanding debt
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../client";

export function registerListDebtPoliciesTool(server: McpServer) {
  server.tool(
    "ledger_list_debt_policies",
    "Get list of policies with outstanding debt and payment issues",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      filters: z.object({
        minDebtAmount: z.number().optional().describe("Minimum debt amount filter"),
        maxDebtAmount: z.number().optional().describe("Maximum debt amount filter"),
        daysPastDue: z.number().optional().describe("Filter by days past due"),
        brokerId: z.string().optional().describe("Filter by broker ID"),
        customerId: z.string().optional().describe("Filter by customer ID"),
        debtStatus: z.array(z.string()).optional().describe("Filter by debt status")
      }).optional().describe("Filter parameters")
    },
    async ({ bearerToken, tenantId, filters }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const queryParams = new URLSearchParams();
        if (filters) {
          Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              if (Array.isArray(value)) {
                value.forEach(v => queryParams.append(`${key}[]`, v.toString()));
              } else {
                queryParams.append(key, value.toString());
              }
            }
          });
        }
        
        const response = await client.get(`/api/v1/ledger/debt-policies?${queryParams.toString()}`);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                debtPolicies: response.data || response,
                summary: {
                  totalDebtAmount: response.totalDebtAmount || 0,
                  policyCount: response.policyCount || 0,
                  averageDebt: response.averageDebt || 0
                },
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
                error: "Failed to retrieve debt policies",
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