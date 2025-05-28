/**
 * Calculate Endorsement Tool
 * Calculates premium adjustments and pricing for an endorsement
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../../client";

export function registerCalculateEndorsementTool(server: McpServer) {
  server.tool(
    "ledger_sales_endorsements_calculate",
    "Calculate premium adjustments and pricing impact for a policy endorsement",
    {
      bearerToken: z.string().min(1).describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      endorsementId: z.string().min(1).describe("ID of the endorsement to calculate"),
      calculationOptions: z.object({
        effectiveDate: z.string().optional().describe("Override effective date for calculation (ISO date)"),
        proRata: z.boolean().optional().describe("Whether to apply pro-rata calculation"),
        includeFeesAndTaxes: z.boolean().optional().describe("Whether to include fees and taxes in calculation"),
        roundingMethod: z.enum(['round', 'floor', 'ceil']).optional().describe("Method for rounding calculations"),
      }).optional().describe("Options for the premium calculation"),
    },
    async ({ bearerToken, tenantId, endorsementId, calculationOptions }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const payload = {
          ...(calculationOptions && calculationOptions)
        };
        
        const response = await client.post(
          `/endorsements/${endorsementId}/calculate`,
          payload,
          {
            "Accept-Language": "en"
          }
        );

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                calculation: {
                  endorsementId: response.endorsementId,
                  effectiveDate: response.effectiveDate,
                  premiumAdjustment: {
                    basePremium: response.premiumAdjustment.basePremium,
                    taxes: response.premiumAdjustment.taxes,
                    fees: response.premiumAdjustment.fees,
                    total: response.premiumAdjustment.total,
                    currency: response.premiumAdjustment.currency
                  },
                  proRataFactor: response.proRataFactor,
                  calculationMethod: response.calculationMethod,
                  breakdown: response.breakdown,
                  validFrom: response.validFrom,
                  validTo: response.validTo
                },
                message: "Endorsement calculation completed successfully"
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
                error: "Failed to calculate endorsement",
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