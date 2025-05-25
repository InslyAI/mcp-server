import { createLedgerClient } from "../client";
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerGetSchemaTools(server: McpServer) {
  server.tool(
    "ledger_get_schema",
    "Get JSON schema structure for a specific product type. This provides the validation rules and data structure for creating quotes and policies",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header (e.g., 'accelerate')"),
      type: z.string().describe("Type of schema (e.g., 'policy' for main product schema)"),
      name: z.string().describe("Product name (e.g., 'casco', 'liability', 'property')"),
    },
    async ({ bearerToken, tenantId, type, name }) => {
      try {
        const client = createLedgerClient(bearerToken, tenantId);
        
        const schema = await client.get(`/api/v1/ledger/schemes/${type}/regular/${name}`);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                schema,
                meta: {
                  type,
                  name,
                  retrievedAt: new Date().toISOString(),
                  schemaType: "regular",
                },
                usage: "Use this schema to validate data structure when creating or updating quotes and policies. Compatible with React JSON Schema Form builder.",
                relatedTools: {
                  renewal: "Use ledger_get_renewal_schema for renewal-specific schema",
                  ui: "Use ledger_get_schema_ui for form rendering schema",
                  feature: "Use ledger_get_feature_schema for individual feature schemas"
                },
                links: {
                  jsonSchemaSpec: "https://json-schema.org/learn/getting-started-step-by-step.html",
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
                type,
                name,
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}