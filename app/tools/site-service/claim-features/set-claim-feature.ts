import { createSiteServiceClient } from "../client";
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

const SanctionsSearchConfigSchema = z.object({
  enabled: z.boolean().describe("Whether sanctions search is enabled"),
  cacheTtl: z.number().int().describe("Cache TTL in seconds (e.g., 86400 for 24 hours)"),
  selectedLists: z.array(z.string()).describe("Array of selected lists (e.g., ['ALL'])"),
  additionalParams: z.object({
    dateOfBirth: z.string().optional().describe("Path to person data parameter for date of birth"),
    reference: z.string().optional().describe("Path to person data parameter for reference"),
    country: z.string().optional().describe("Path to person data parameter for country"),
    nationality: z.string().optional().describe("Path to person data parameter for nationality"),
    address: z.string().optional().describe("Path to person data parameter for address")
  }).optional().describe("Additional parameters mapping")
}).describe("Sanctions search configuration");

export function registerSetClaimFeatureTool(server: McpServer) {
  server.tool(
    "site_service_claim_features_feature_set",
    "Set specific claim feature configuration",
    {
      bearerToken: z.string().min(1).describe("JWT bearer token from identifier_login"),
      tenantId: z.string().min(1).describe("Tenant identifier for API access"),
      tenantTag: z.string().min(1).describe("Tenant tag identifier"),
      schemaName: z.string().min(1).describe("Schema name for the claim feature"),
      featureName: z.string().min(1).describe("Name of the specific feature to set"),
      config: z.union([
        SanctionsSearchConfigSchema,
        z.record(z.any())
      ]).describe("Feature configuration object (sanctions search config or custom config)")
    },
    async ({ bearerToken, tenantId, tenantTag, schemaName, featureName, config }) => {
      try {
        const client = createSiteServiceClient(bearerToken, tenantId);
        const data = await client.post(`/api/v1/sites/claim-features/${tenantTag}/${schemaName}/${featureName}`, config);
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({ 
              success: true, 
              data,
              message: `Set claim feature '${featureName}' for schema '${schemaName}' in tenant '${tenantTag}'`
            }, null, 2)
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: JSON.stringify({ 
              success: false, 
              error: error instanceof Error ? error.message : 'Unknown error',
              details: `Failed to set claim feature '${featureName}' for schema '${schemaName}' in tenant '${tenantTag}'`
            }, null, 2)
          }]
        };
      }
    }
  );
}