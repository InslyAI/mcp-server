/**
 * Update Feature Configuration Tool
 * Updates feature configuration settings
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../client";

export function registerUpdateFeatureConfigTool(server: McpServer) {
  server.tool(
    "ledger_update_feature_config",
    "Update feature configuration settings for products or tenant",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      configType: z.enum(["product", "tenant"]).describe("Type of configuration to update"),
      targetId: z.string().describe("Schema name for product or feature name for tenant"),
      configUpdates: z.object({
        enabled: z.boolean().optional().describe("Enable/disable the feature"),
        configuration: z.record(z.any()).optional().describe("Feature configuration values"),
        permissions: z.array(z.string()).optional().describe("Permission settings"),
        limits: z.record(z.number()).optional().describe("Usage limits"),
        customizations: z.record(z.any()).optional().describe("Custom settings"),
        notes: z.string().optional().describe("Update notes")
      }).describe("Configuration updates to apply")
    },
    async ({ bearerToken, tenantId, configType, targetId, configUpdates }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        let endpoint;
        switch (configType) {
          case "product":
            endpoint = `/api/v1/ledger/sales/features-configuration/product-features/${targetId}`;
            break;
          case "tenant":
            endpoint = `/api/v1/ledger/sales/features-configuration/tenant-features/${targetId}`;
            break;
        }
        
        const response = await client.put(endpoint, configUpdates);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                message: "Feature configuration updated successfully",
                configType: configType,
                targetId: targetId,
                updatedConfig: response.configuration || response,
                changesApplied: configUpdates,
                lastModified: new Date().toISOString()
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
                error: "Failed to update feature configuration",
                details: error.message,
                statusCode: error.status,
                configType: configType,
                targetId: targetId
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}