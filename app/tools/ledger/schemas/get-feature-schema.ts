import { createLedgerClient } from "../client";
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerGetFeatureSchemaTools(server: McpServer) {
  server.tool(
    "ledger_get_feature_schema",
    "Get JSON schema structure for a specific product feature. Features are modular components that can be added to products",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header (e.g., 'accelerate')"),
      featureName: z.string().describe("Name of the feature to get schema for"),
    },
    async ({ bearerToken, tenantId, featureName }) => {
      try {
        const client = createLedgerClient(bearerToken, tenantId);
        
        const featureSchema = await client.get(`/api/v1/ledger/schemes/feature/${featureName}/scheme`);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                featureSchema,
                meta: {
                  featureName,
                  retrievedAt: new Date().toISOString(),
                  schemaType: "feature",
                },
                usage: "Use this schema to understand the structure and validation rules for this specific product feature. Features are modular and can be combined.",
                relatedTools: {
                  ui: "Use ledger_get_feature_ui_schema for form rendering schema",
                  product: "Use ledger_get_schema for full product schema that may include this feature"
                }
              }, null, 2)
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred',
                featureName,
              }, null, 2)
            }
          ]
        };
      }
    }
  );

  server.tool(
    "ledger_get_feature_ui_schema",
    "Get UI schema for form rendering of a specific product feature",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header (e.g., 'accelerate')"),
      featureName: z.string().describe("Name of the feature to get UI schema for"),
    },
    async ({ bearerToken, tenantId, featureName }) => {
      try {
        const client = createLedgerClient(bearerToken, tenantId);
        
        const featureUISchema = await client.get(`/api/v1/ledger/schemes/feature/${featureName}/ui`);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                featureUISchema,
                meta: {
                  featureName,
                  retrievedAt: new Date().toISOString(),
                  schemaType: "feature-ui",
                },
                usage: "Use this UI schema with React JSON Schema Form to render form interfaces for this specific feature.",
                relatedTools: {
                  schema: "Use ledger_get_feature_schema for data validation schema",
                  productUI: "Use ledger_get_schema_ui for full product UI schema"
                },
                links: {
                  reactFormBuilder: "https://rjsf-team.github.io/react-jsonschema-form/"
                }
              }, null, 2)
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred',
                featureName,
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}