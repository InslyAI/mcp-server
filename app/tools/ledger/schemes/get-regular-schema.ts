/**
 * Get Regular Schema Tool
 * Retrieves JSON schema for regular policy products
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../client";

export function registerGetRegularSchemaTool(server: McpServer) {
  server.tool(
    "ledger_get_regular_schema",
    "Get JSON schema for regular policy products - use with React JSON Schema Form to create quote payloads",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      schemaType: z.string().describe("Type of schema (policy for main product scheme)"),
      schemaName: z.string().describe("Name of schema (product name for policy type)"),
    },
    async ({ bearerToken, tenantId, schemaType, schemaName }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const response = await client.get(`/api/v1/ledger/schemes/${schemaType}/regular/${schemaName}`);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                schemaType: schemaType,
                schemaName: schemaName,
                schema: response,
                schemaCategory: "regular",
                description: "JSON schema for regular policy product configuration",
                usage: "Use with React JSON Schema Form builder to create quote payloads",
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
                error: "Failed to retrieve regular schema",
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