/**
 * Get Policy Insurers Tool
 * Retrieves available insurers for policy schema
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../../client";

export function registerGetPolicyInsurersTool(server: McpServer) {
  server.tool(
    "ledger_schemes_policy_get_insurers",
    "Get available insurers for policy schema configuration",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      schemaName: z.string().describe("Name of the policy schema"),
      objectType: z.string().describe("Object type to get insurers for"),
      product: z.string().describe("Product to get insurers for"),
    },
    async ({ bearerToken, tenantId, schemaName, objectType, product }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const queryParams = new URLSearchParams();
        queryParams.append('name', schemaName);
        queryParams.append('objectType', objectType);
        queryParams.append('product', product);
        
        const response = await client.get(`/api/v1/ledger/schemes/policy/insurers?${queryParams.toString()}`);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                schemaName: schemaName,
                objectType: objectType,
                product: product,
                insurers: response,
                description: "Available insurers for the specified policy configuration",
                usage: "Use these insurers when creating quotes or policies"
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
                error: "Failed to retrieve policy insurers",
                details: error.message,
                statusCode: error.status,
                schemaName: schemaName,
                objectType: objectType,
                product: product
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}