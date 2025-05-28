/**
 * Get MTA Renewal UI Schema Tool
 * Retrieves UI schema for rendering MTA (Mid-Term Adjustment) renewal interfaces
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createLedgerClient } from "../../client";

export function registerGetMtaRenewalUiSchemaTool(server: McpServer) {
  server.tool(
    "ledger_schemes_mta_renewal_get",
    "Get UI schema for rendering MTA (Mid-Term Adjustment) renewal interfaces with specific version",
    {
      bearerToken: z.string().min(1).describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      schemaType: z.string().describe("Type of schema (policy for main product scheme)"),
      schemaName: z.string().describe("Name of schema (product name for policy type)"),
      version: z.string().describe("Version of the schema to retrieve UI for"),
    },
    async ({ bearerToken, tenantId, schemaType, schemaName, version }) => {
      try {
        const client = createLedgerClient(bearerToken, tenantId);
        
        const response = await client.get(`/api/v1/ledger/schemes/${schemaType}/mta-renewal/${schemaName}/${version}/ui`);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                schemaType: schemaType,
                schemaName: schemaName,
                version: version,
                uiSchema: response,
                schemaCategory: "mta-renewal-ui",
                description: "UI schema for rendering MTA (Mid-Term Adjustment) renewal forms",
                usage: "Use with React JSON Schema Form for policy adjustment interfaces"
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
                error: "Failed to retrieve MTA renewal UI schema",
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