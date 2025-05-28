/**
 * Calculate Policy Debug Tool
 * Performs debug calculation for policy pricing with detailed information
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createLedgerClient } from "../../../client";

export function registerCalculatePolicyDebugTool(server: McpServer) {
  server.tool(
    "ledger_sales_policies_calculations_debug_calculate",
    "Perform debug calculation for policy pricing with detailed breakdown and debug information",
    {
      bearerToken: z.string().min(1).describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      policyId: z.string().min(1).describe("ID of the policy to debug calculate"),
      debugOptions: z.object({
        includeSteps: z.boolean().optional().describe("Include calculation steps"),
        includeFormulas: z.boolean().optional().describe("Include calculation formulas"),
        includeVariables: z.boolean().optional().describe("Include all variables used"),
        verboseOutput: z.boolean().optional().describe("Enable verbose debug output")
      }).optional().describe("Debug calculation options")
    },
    async ({ bearerToken, tenantId, policyId, debugOptions }) => {
      try {
        const client = createLedgerClient(bearerToken, tenantId);
        
        const requestBody = debugOptions || {};
        
        const response = await client.post(`/api/v1/ledger/sales/policies/${policyId}/calculate-debug`, requestBody);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                policyId: policyId,
                debugCalculation: {
                  finalPremium: response.finalPremium,
                  calculationSteps: response.calculationSteps,
                  formulas: response.formulas,
                  variables: response.variables,
                  debugInfo: response.debugInfo,
                  warnings: response.warnings || [],
                  errors: response.errors || []
                },
                debugOptions: debugOptions || {}
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
                error: "Failed to perform debug calculation",
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