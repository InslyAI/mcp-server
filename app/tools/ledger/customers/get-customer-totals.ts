/**
 * Get Customer Totals Tool
 * Retrieves financial totals and statistics for a customer
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createLedgerClient } from "../client";

export function registerGetCustomerTotalsTool(server: McpServer) {
  server.tool(
    "ledger_customers_get",
    "Get financial totals and statistics for a specific customer including premium amounts, policy counts, and overdue payments",
    {
      bearerToken: z.string().min(1).describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      customerId: z.string().min(1).describe("ID of the customer to get totals for"),
    },
    async ({ bearerToken, tenantId, customerId }) => {
      try {
        const client = createLedgerClient(bearerToken, tenantId);
        
        const response = await client.get(`/api/v1/ledger/customers/${customerId}/totals`);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                customerId: customerId,
                totals: {
                  overduePayment: response.data?.overduePayment || 0,
                  policiesPremium: response.data?.policiesPremium || 0,
                  policiesCount: response.data?.policiesCount || 0,
                  totalOutstanding: response.data?.totalOutstanding || 0,
                  yearToDatePremium: response.data?.yearToDatePremium || 0,
                  lifetimeValue: response.data?.lifetimeValue || 0,
                  averagePolicyValue: response.data?.averagePolicyValue || 0,
                  paymentStatus: response.data?.paymentStatus || "unknown",
                  lastPaymentDate: response.data?.lastPaymentDate || null,
                  nextPaymentDue: response.data?.nextPaymentDue || null
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
                error: "Failed to retrieve customer totals",
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