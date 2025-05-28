/**
 * Create Policy Tool
 * Creates a new policy/quote using JSON schema validation
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../../../client";

export function registerCreatePolicyTool(server: McpServer) {
  server.tool(
    "ledger_sales_policies_calculations_create",
    "Create a new policy/quote using JSON schema validation - get schema from schemes section first",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      policyData: z.object({
        schema: z.string().describe("Schema path (e.g., 'policy/regular/casco/1')"),
        data: z.record(z.any()).describe("Policy data conforming to the JSON schema"),
        product: z.string().optional().describe("Insurance product name"),
        customerId: z.string().optional().describe("Customer ID for the policy"),
        brokerId: z.string().optional().describe("Broker ID handling the policy"),
        effectiveDate: z.string().optional().describe("Policy effective date (YYYY-MM-DD)"),
        expiryDate: z.string().optional().describe("Policy expiry date (YYYY-MM-DD)"),
        currency: z.string().optional().describe("Policy currency code"),
        premium: z.number().optional().describe("Policy premium amount")
      }).describe("Policy/quote data to create"),
      withNotifications: z.boolean().optional().describe("Include notifications and validation warnings in response"),
      language: z.string().optional().describe("Language preference for response (Accept-Language header)")
    },
    async ({ bearerToken, tenantId, policyData, withNotifications, language }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const headers: Record<string, string> = {};
        if (language) headers['Accept-Language'] = language;
        
        const queryParams = new URLSearchParams();
        if (withNotifications) queryParams.append('withNotifications', withNotifications.toString());
        
        const endpoint = `/api/v1/ledger/sales/policies/create${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        
        const response = await client.post(endpoint, policyData, headers);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                message: "Policy/quote created successfully",
                policyId: response.data?.id || response.id,
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
                error: "Failed to create policy",
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