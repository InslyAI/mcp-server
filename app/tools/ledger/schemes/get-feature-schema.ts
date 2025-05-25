/**
 * Get Feature Schema Tool
 * Retrieves JSON schema for a specific product feature
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../client";

export function registerGetFeatureSchemaTool(server: McpServer) {
  server.tool(
    "ledger_get_feature_schema",
    "Get JSON schema for a specific product feature",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      featureName: z.string().describe("Name of the feature to get schema for"),
    },
    async ({ bearerToken, tenantId, featureName }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const response = await client.get(`/api/v1/ledger/schemes/feature/${featureName}/scheme`);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                featureName: featureName,
                schema: response,
                schemaType: "feature",
                description: "JSON schema for feature configuration and validation"
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
                error: "Failed to retrieve feature schema",
                details: error.message,
                statusCode: error.status,
                featureName: featureName
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}