/**
 * Get Installments Schedule Tool
 * Retrieves payment installment schedule for a policy
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../../../client";

export function registerGetInstallmentsScheduleTool(server: McpServer) {
  server.tool(
    "ledger_get_installments_schedule",
    "Get payment installment schedule for a specific policy",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      policyId: z.string().describe("ID of the policy to get installment schedule for"),
      scheduleOptions: z.object({
        includeHistory: z.boolean().optional().describe("Include payment history"),
        includeUpcoming: z.boolean().optional().describe("Include upcoming payments"),
        dateFrom: z.string().optional().describe("Start date for schedule (YYYY-MM-DD)"),
        dateTo: z.string().optional().describe("End date for schedule (YYYY-MM-DD)")
      }).optional().describe("Schedule retrieval options")
    },
    async ({ bearerToken, tenantId, policyId, scheduleOptions }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const queryParams = new URLSearchParams();
        if (scheduleOptions) {
          Object.entries(scheduleOptions).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              queryParams.append(key, value.toString());
            }
          });
        }
        
        const endpoint = `/api/v1/ledger/sales/policies/${policyId}/installments-schedule${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        
        const response = await client.get(endpoint);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                policyId: policyId,
                installmentSchedule: {
                  schedule: response.schedule || response,
                  totalAmount: response.totalAmount,
                  remainingAmount: response.remainingAmount,
                  paidAmount: response.paidAmount,
                  installmentCount: response.installmentCount,
                  frequency: response.frequency,
                  nextPaymentDate: response.nextPaymentDate,
                  lastPaymentDate: response.lastPaymentDate
                },
                scheduleOptions: scheduleOptions || {}
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
                error: "Failed to retrieve installments schedule",
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