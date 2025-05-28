/**
 * Manage Policy Calculations Tool
 * Handles various policy calculation operations
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../../../client";

export function registerManagePolicyCalculationsTool(server: McpServer) {
  server.tool(
    "ledger_sales_policies_calculations_manage",
    "Manage various policy calculation operations including specific and batch calculations",
    {
      bearerToken: z.string().min(1).describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      calculationType: z.enum(["specific", "batch"]).describe("Type of calculation to perform"),
      policyId: z.string().optional().describe("Policy ID for specific calculations"),
      calculationData: z.object({
        policies: z.array(z.string()).optional().describe("Array of policy IDs for batch calculation"),
        parameters: z.record(z.any()).optional().describe("Calculation parameters"),
        forceRecalculation: z.boolean().optional().describe("Force recalculation"),
        includeBreakdown: z.boolean().optional().describe("Include detailed breakdown")
      }).optional().describe("Calculation configuration")
    },
    async ({ bearerToken, tenantId, calculationType, policyId, calculationData }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        let endpoint;
        let requestBody = calculationData || {};

        switch (calculationType) {
          case "specific":
            if (!policyId) throw new Error("policyId is required for specific calculations");
            endpoint = `/api/v1/ledger/sales/policies/${policyId}/calculation`;
            break;
          case "batch":
            endpoint = `/api/v1/ledger/sales/policies/calculation`;
            break;
        }
        
        const response = await client.post(endpoint, requestBody);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                calculationType: calculationType,
                policyId: policyId,
                calculationResult: response,
                calculationData: calculationData
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
                error: "Failed to manage policy calculations",
                details: error.message,
                statusCode: error.status,
                calculationType: calculationType,
                policyId: policyId
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}