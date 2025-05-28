/**
 * Get MTA Renewal Schema Tool
 * Retrieves JSON schema for MTA (Mid-Term Adjustment) renewal processing
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../../client";

export function registerGetMtaRenewalSchemaTool(server: McpServer) {
  server.tool(
    "ledger_schemes_mta_renewal_get",
    "Get JSON schema for MTA (Mid-Term Adjustment) renewal processing with specific version",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      schemaType: z.string().describe("Type of schema (policy for main product scheme)"),
      schemaName: z.string().describe("Name of schema (product name for policy type)"),
      version: z.string().describe("Version of the schema to retrieve"),
    },
    async ({ bearerToken, tenantId, schemaType, schemaName, version }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const response = await client.get(`/api/v1/ledger/schemes/${schemaType}/mta-renewal/${schemaName}/${version}/scheme`);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                schemaType: schemaType,
                schemaName: schemaName,
                version: version,
                schema: response,
                schemaCategory: "mta-renewal",
                description: "JSON schema for MTA (Mid-Term Adjustment) renewal processing",
                usage: "Use for processing policy changes and adjustments during the policy term"
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
                error: "Failed to retrieve MTA renewal schema",
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