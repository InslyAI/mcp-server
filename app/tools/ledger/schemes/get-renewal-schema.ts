/**
 * Get Renewal Schema Tool
 * Retrieves JSON schema for policy renewal products
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../client";

export function registerGetRenewalSchemaTool(server: McpServer) {
  server.tool(
    "ledger_get_renewal_schema",
    "Get JSON schema for policy renewal products - use with React JSON Schema Form to create renewal payloads",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      schemaType: z.string().describe("Type of schema (policy for main product scheme)"),
      schemaName: z.string().describe("Name of schema (product name for policy type)"),
    },
    async ({ bearerToken, tenantId, schemaType, schemaName }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const response = await client.get(`/api/v1/ledger/schemes/${schemaType}/regular-renewal/${schemaName}`);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                schemaType: schemaType,
                schemaName: schemaName,
                schema: response,
                schemaCategory: "renewal",
                description: "JSON schema for policy renewal configuration",
                usage: "Use with React JSON Schema Form builder to create renewal quote payloads",
                documentation: "https://json-schema.org/learn/getting-started-step-by-step.html"
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
                error: "Failed to retrieve renewal schema",
                details: error.message,
                statusCode: error.status,
                schemaType: schemaType,
                schemaName: schemaName
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}