/**
 * Get Policy Products Tool
 * Retrieves available products for object type in policy schema
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../../client";

export function registerGetPolicyProductsTool(server: McpServer) {
  server.tool(
    "ledger_schemes_policy_get_products",
    "Retrieve available products for a specific object type in policy schema definitions for validation and integration",
    {
      bearerToken: z.string().min(1).describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      schemaName: z.string().describe("Name of the policy schema"),
      objectType: z.string().describe("Object type to get products for (e.g., building, vehicle)"),
    },
    async ({ bearerToken, tenantId, schemaName, objectType }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const queryParams = new URLSearchParams();
        queryParams.append('name', schemaName);
        queryParams.append('objectType', objectType);
        
        const response = await client.get(`/api/v1/ledger/schemes/policy/products?${queryParams.toString()}`);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                schemaName: schemaName,
                objectType: objectType,
                products: response,
                description: "Available products for the specified object type in policy schema",
                usage: "Use these products when creating quotes or policies for the object type"
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
                error: "Failed to retrieve policy products",
                details: error.message,
                statusCode: error.status,
                schemaName: schemaName,
                objectType: objectType
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}