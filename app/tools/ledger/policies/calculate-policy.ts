/**
 * Calculate Policy Tool
 * Calculates premium and pricing for a policy/quote
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../client";

export function registerCalculatePolicyTool(server: McpServer) {
  server.tool(
    "ledger_calculate_policy",
    "Calculate premium and pricing for a policy/quote based on current data",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      policyId: z.string().describe("ID of the policy/quote to calculate"),
      calculationOptions: z.object({
        forceRecalculation: z.boolean().optional().describe("Force recalculation even if cached"),
        includeBreakdown: z.boolean().optional().describe("Include detailed premium breakdown"),
        includeTaxes: z.boolean().optional().describe("Include tax calculations"),
        includeCommissions: z.boolean().optional().describe("Include commission calculations"),
        effectiveDate: z.string().optional().describe("Effective date for calculation (YYYY-MM-DD)")
      }).optional().describe("Calculation options and parameters"),
      language: z.string().optional().describe("Language preference for response (Accept-Language header)")
    },
    async ({ bearerToken, tenantId, policyId, calculationOptions, language }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const headers: Record<string, string> = {};
        if (language) headers['Accept-Language'] = language;
        
        const requestBody = calculationOptions || {};
        
        const response = await client.post(`/api/v1/ledger/sales/policies/${policyId}/calculate`, requestBody, headers);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                policyId: policyId,
                calculation: {
                  totalPremium: response.totalPremium,
                  basePremium: response.basePremium,
                  taxes: response.taxes,
                  fees: response.fees,
                  commissions: response.commissions,
                  discounts: response.discounts,
                  breakdown: response.breakdown,
                  currency: response.currency,
                  effectiveDate: response.effectiveDate,
                  calculatedAt: response.calculatedAt || new Date().toISOString()
                },
                warnings: response.warnings || [],
                errors: response.errors || []
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
                error: "Failed to calculate policy",
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