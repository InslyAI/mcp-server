/**
 * Get Schema Products Tool
 * Retrieves available products for a specific schema version
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../../client";

export function registerGetSchemaProductsTool(server: McpServer) {
  server.tool(
    "ledger_schemes_regular_get",
    "Get available products for a specific schema version",
    {
      bearerToken: z.string().min(1).describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      schemaType: z.string().describe("Type of schema (policy for main product scheme)"),
      schemaName: z.string().describe("Name of schema (product name for policy type)"),
      version: z.string().describe("Version of the schema to get products for"),
    },
    async ({ bearerToken, tenantId, schemaType, schemaName, version }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const response = await client.get(`/api/v1/ledger/schemes/${schemaType}/regular/${schemaName}/${version}/products`);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                schemaType: schemaType,
                schemaName: schemaName,
                version: version,
                products: response,
                description: "Available products for the specified schema version"
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
                error: "Failed to retrieve schema products",
                details: error.message,
                statusCode: error.status,
                schemaType: schemaType,
                schemaName: schemaName,
                version: version
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}