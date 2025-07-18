/**
 * Bind Policy Tool
 * Binds/locks a policy draft to prevent further changes
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createLedgerClient } from "../../../client";

export function registerBindPolicyTool(server: McpServer) {
  server.tool(
    "ledger_sales_policies_lifecycle_bind",
    "Bind/lock a policy draft to prevent further changes and prepare for issuance",
    {
      bearerToken: z.string().min(1).describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      policyId: z.string().min(1).describe("ID of the policy draft to bind"),
      bindingData: z.object({
        bindingDate: z.string().optional().describe("Date when policy is bound (YYYY-MM-DD)"),
        bindingNotes: z.string().optional().describe("Notes for the binding process"),
        confirmedPremium: z.number().positive().optional().describe("Confirmed premium amount"),
        paymentMethod: z.string().optional().describe("Payment method for the policy"),
        paymentTerms: z.string().optional().describe("Payment terms (annual, monthly, etc.)"),
        bindingAuthorization: z.string().optional().describe("Authorization reference for binding")
      }).optional().describe("Additional binding data and parameters")
    },
    async ({ bearerToken, tenantId, policyId, bindingData }) => {
      try {
        const client = createLedgerClient(bearerToken, tenantId);
        
        const requestBody = bindingData || {};
        
        const response = await client.post(`/api/v1/ledger/sales/policies/${policyId}/bind`, requestBody);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                message: "Policy bound/locked successfully",
                policyId: policyId,
                status: "bound",
                boundAt: new Date().toISOString(),
                bindingData: bindingData
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
                error: "Failed to bind policy",
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