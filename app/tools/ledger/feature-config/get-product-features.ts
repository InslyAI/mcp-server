/**
 * Get Product Features Tool
 * Retrieves feature configuration for specific products
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../client";

export function registerGetProductFeaturesTool(server: McpServer) {
  server.tool(
    "ledger_get_product_features",
    "Get feature configuration settings for a specific insurance product schema",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      schemaName: z.string().describe("Name of the product schema to get features for"),
      includeDefaults: z.boolean().optional().describe("Include default feature values"),
      includeDescriptions: z.boolean().optional().describe("Include feature descriptions")
    },
    async ({ bearerToken, tenantId, schemaName, includeDefaults, includeDescriptions }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const queryParams = new URLSearchParams();
        if (includeDefaults) queryParams.append('includeDefaults', includeDefaults.toString());
        if (includeDescriptions) queryParams.append('includeDescriptions', includeDescriptions.toString());
        
        const endpoint = `/api/v1/ledger/sales/features-configuration/product-features/${schemaName}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        
        const response = await client.get(endpoint);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                schemaName: schemaName,
                productFeatures: response.features || response,
                featureCategories: response.categories || [],
                enabledFeatures: response.enabledFeatures || [],
                disabledFeatures: response.disabledFeatures || [],
                customizations: response.customizations || {}
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
                error: "Failed to retrieve product features",
                details: error.message,
                statusCode: error.status,
                schemaName: schemaName
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}