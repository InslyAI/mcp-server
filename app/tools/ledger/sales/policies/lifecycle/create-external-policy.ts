/**
 * Create External Policy Tool
 * Creates policies from external product sources
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createLedgerClient } from "../../../client";

export function registerCreateExternalPolicyTool(server: McpServer) {
  server.tool(
    "ledger_sales_policies_lifecycle_create",
    "Create a policy from external product sources and integrations",
    {
      bearerToken: z.string().min(1).describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      product: z.string().min(1).describe("External product identifier"),
      policyData: z.object({
        externalReference: z.string().describe("External system reference"),
        customerData: z.record(z.any()).describe("Customer information"),
        policyDetails: z.record(z.any()).describe("Policy details from external system"),
        effectiveDate: z.string().optional().describe("Policy effective date"),
        premium: z.number().positive().optional().describe("Policy premium amount"),
        currency: z.string().optional().describe("Policy currency")
      }).describe("External policy data")
    },
    async ({ bearerToken, tenantId, product, policyData }) => {
      try {
        const client = createLedgerClient(bearerToken, tenantId);
        
        const response = await client.post(`/api/v1/ledger/sales/policies/external/${product}`, policyData);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                product: product,
                externalPolicyId: response.id || response.data?.id,
                externalReference: policyData.externalReference,
                response: response
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
                error: "Failed to create external policy",
                details: error.message,
                statusCode: error.status,
                product: product
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}