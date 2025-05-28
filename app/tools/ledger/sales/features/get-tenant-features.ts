/**
 * Get Tenant Features Tool
 * Retrieves tenant-wide feature configuration
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../../client";

export function registerGetTenantFeaturesTool(server: McpServer) {
  server.tool(
    "ledger_sales_features_get",
    "Get tenant-wide feature configuration settings and capabilities",
    {
      bearerToken: z.string().min(1).describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      includePermissions: z.boolean().optional().describe("Include permission settings"),
      includeLimits: z.boolean().optional().describe("Include usage limits and quotas"),
      category: z.string().optional().describe("Filter by feature category")
    },
    async ({ bearerToken, tenantId, includePermissions, includeLimits, category }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const queryParams = new URLSearchParams();
        if (includePermissions) queryParams.append('includePermissions', includePermissions.toString());
        if (includeLimits) queryParams.append('includeLimits', includeLimits.toString());
        if (category) queryParams.append('category', category);
        
        const endpoint = `/api/v1/ledger/sales/features-configuration/tenant-features${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        
        const response = await client.get(endpoint);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                tenantId: tenantId,
                tenantFeatures: {
                  enabledFeatures: response.enabledFeatures || [],
                  disabledFeatures: response.disabledFeatures || [],
                  permissions: response.permissions || {},
                  limits: response.limits || {},
                  customizations: response.customizations || {},
                  subscriptionTier: response.subscriptionTier,
                  expiryDate: response.expiryDate,
                  lastUpdated: response.lastUpdated
                },
                category: category || "all"
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
                error: "Failed to retrieve tenant features",
                details: error.message,
                statusCode: error.status,
                tenantId: tenantId
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}