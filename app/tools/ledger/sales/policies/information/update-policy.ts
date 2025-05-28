/**
 * Update Policy Tool
 * Updates an existing policy/quote data
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../../../client";

export function registerUpdatePolicyTool(server: McpServer) {
  server.tool(
    "ledger_sales_policies_information_update",
    "Update an existing policy/quote with new data - follows JSON schema validation",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      policyId: z.string().describe("ID of the policy/quote to update"),
      policyData: z.object({
        data: z.record(z.any()).describe("Updated policy data conforming to the JSON schema"),
        schema: z.string().optional().describe("Schema path if changed"),
        customerId: z.string().optional().describe("Customer ID for the policy"),
        brokerId: z.string().optional().describe("Broker ID handling the policy"),
        effectiveDate: z.string().optional().describe("Policy effective date (YYYY-MM-DD)"),
        expiryDate: z.string().optional().describe("Policy expiry date (YYYY-MM-DD)"),
        currency: z.string().optional().describe("Policy currency code"),
        premium: z.number().optional().describe("Policy premium amount"),
        status: z.string().optional().describe("Policy status")
      }).describe("Updated policy/quote data"),
      withNotifications: z.boolean().optional().describe("Include notifications and validation warnings in response"),
      language: z.string().optional().describe("Language preference for response (Accept-Language header)")
    },
    async ({ bearerToken, tenantId, policyId, policyData, withNotifications, language }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const headers: Record<string, string> = {};
        if (language) headers['Accept-Language'] = language;
        
        const queryParams = new URLSearchParams();
        if (withNotifications) queryParams.append('withNotifications', withNotifications.toString());
        
        const endpoint = `/api/v1/ledger/sales/policies/${policyId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        
        const response = await client.put(endpoint, policyData, headers);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                message: "Policy/quote updated successfully",
                policyId: policyId,
                schemaPath: response.meta?.schemaPath,
                data: response.data,
                meta: response.meta,
                warnings: response.meta?.warnings || [],
                errors: response.meta?.errors || []
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
                error: "Failed to update policy",
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