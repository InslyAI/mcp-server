/**
 * Get Feature UI Schema Tool
 * Retrieves UI schema for rendering a specific product feature
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createLedgerClient } from "../../client";

export function registerGetFeatureUiSchemaTool(server: McpServer) {
  server.tool(
    "ledger_schemes_features_get",
    "Get UI schema for rendering a specific product feature interface",
    {
      bearerToken: z.string().min(1).describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      featureName: z.string().describe("Name of the feature to get UI schema for"),
    },
    async ({ bearerToken, tenantId, featureName }) => {
      try {
        const client = createLedgerClient(bearerToken, tenantId);
        
        const response = await client.get(`/api/v1/ledger/schemes/feature/${featureName}/ui`);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                featureName: featureName,
                uiSchema: response,
                schemaType: "feature-ui",
                description: "UI schema for rendering feature forms and interfaces",
                usage: "Use with React JSON Schema Form or similar form builders"
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
                error: "Failed to retrieve feature UI schema",
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