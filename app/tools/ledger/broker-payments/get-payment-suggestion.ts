/**
 * Get Payment Suggestion Tool
 * Retrieves payment suggestions for broker payments
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../client";

export function registerGetPaymentSuggestionTool(server: McpServer) {
  server.tool(
    "ledger_broker_payments_get",
    "Get payment suggestions and recommendations for broker payments",
    {
      bearerToken: z.string().min(1).describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      paymentId: z.string().min(1).describe("ID of the payment to get suggestions for"),
    },
    async ({ bearerToken, tenantId, paymentId }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const response = await client.get(`/api/v1/ledger/brokerpayments/suggestion/${paymentId}`);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                paymentId: paymentId,
                suggestions: {
                  recommendedAmount: response.recommendedAmount,
                  paymentSchedule: response.paymentSchedule,
                  optimizedDate: response.optimizedDate,
                  riskAssessment: response.riskAssessment,
                  alternatives: response.alternatives,
                  reasoning: response.reasoning,
                  impactAnalysis: response.impactAnalysis,
                  confidence: response.confidence
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
                error: "Failed to retrieve payment suggestion",
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