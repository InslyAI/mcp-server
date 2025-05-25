/**
 * Get Payment Detail Tool
 * Retrieves detailed information about a specific broker payment
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../client";

export function registerGetPaymentDetailTool(server: McpServer) {
  server.tool(
    "ledger_get_payment_detail",
    "Get detailed information about a specific broker payment including commissions and breakdowns",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      paymentId: z.string().describe("ID of the payment to get details for"),
    },
    async ({ bearerToken, tenantId, paymentId }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const response = await client.get(`/api/v1/ledger/brokerpayments/detail/${paymentId}`);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                paymentId: paymentId,
                paymentDetail: {
                  amount: response.amount,
                  currency: response.currency,
                  paymentDate: response.paymentDate,
                  dueDate: response.dueDate,
                  status: response.status,
                  broker: response.broker,
                  insurer: response.insurer,
                  commissionBreakdown: response.commissionBreakdown,
                  policies: response.policies,
                  taxDetails: response.taxDetails,
                  paymentMethod: response.paymentMethod,
                  reference: response.reference,
                  notes: response.notes
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
                error: "Failed to retrieve payment detail",
                details: error.message,
                statusCode: error.status,
                paymentId: paymentId
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}