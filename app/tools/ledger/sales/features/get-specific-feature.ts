/**
 * Get Specific Feature Tool
 * Retrieves detailed configuration for a specific tenant feature
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../../client";

export function registerGetSpecificFeatureTool(server: McpServer) {
  server.tool(
    "ledger_get_specific_feature",
    "Get detailed configuration for a specific tenant feature",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      featureName: z.string().describe("Name of the specific feature to retrieve"),
      includeHistory: z.boolean().optional().describe("Include feature change history"),
      includeUsage: z.boolean().optional().describe("Include usage statistics")
    },
    async ({ bearerToken, tenantId, featureName, includeHistory, includeUsage }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const queryParams = new URLSearchParams();
        if (includeHistory) queryParams.append('includeHistory', includeHistory.toString());
        if (includeUsage) queryParams.append('includeUsage', includeUsage.toString());
        
        const endpoint = `/api/v1/ledger/sales/features-configuration/tenant-features/${featureName}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        
        const response = await client.get(endpoint);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                featureName: featureName,
                featureConfig: {
                  enabled: response.enabled,
                  configuration: response.configuration || {},
                  permissions: response.permissions || [],
                  limits: response.limits || {},
                  dependencies: response.dependencies || [],
                  lastModified: response.lastModified,
                  modifiedBy: response.modifiedBy,
                  history: response.history || [],
                  usage: response.usage || {}
                }
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
                error: "Failed to retrieve specific feature",
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