/**
 * List Payments By Payer Tool
 * Retrieves broker payments filtered by payer
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../client";

export function registerListPaymentsByPayerTool(server: McpServer) {
  server.tool(
    "ledger_broker_payments_list",
    "Get broker payments filtered by a specific payer (broker or insurer)",
    {
      bearerToken: z.string().min(1).describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      payer: z.string().min(1).describe("Payer identifier (broker ID or insurer ID)"),
      filters: z.object({
        dateFrom: z.string().optional().describe("Start date filter (YYYY-MM-DD)"),
        dateTo: z.string().optional().describe("End date filter (YYYY-MM-DD)"),
        status: z.array(z.string()).optional().describe("Filter by payment status"),
        paymentType: z.string().optional().describe("Type of payment (commission, fee, etc.)"),
        minAmount: z.number().positive().optional().describe("Minimum payment amount"),
        maxAmount: z.number().positive().optional().describe("Maximum payment amount"),
        currency: z.string().optional().describe("Filter by currency")
      }).optional().describe("Additional filter parameters")
    },
    async ({ bearerToken, tenantId, payer, filters }) => {
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
        
        const endpoint = `/api/v1/ledger/brokerpayments/${payer}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        
        const response = await client.get(endpoint);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                payer: payer,
                payments: response.data || response.payments || response,
                summary: {
                  totalAmount: response.totalAmount || 0,
                  paymentCount: response.paymentCount || (Array.isArray(response.data) ? response.data.length : 0),
                  currency: response.currency,
                  periodCovered: {
                    from: filters?.dateFrom,
                    to: filters?.dateTo
                  }
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
                error: "Failed to retrieve payments by payer",
                details: error.message,
                statusCode: error.status,
                payer: payer
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}