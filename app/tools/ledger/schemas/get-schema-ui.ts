import { createLedgerClient } from "../client";
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerGetSchemaUITools(server: McpServer) {
  server.tool(
    "ledger_get_schema_ui",
    "Get UI schema for form rendering of renewal quotes. UI schemas provide layout, widget, and display configuration for React JSON Schema Forms",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header (e.g., 'accelerate')"),
      type: z.string().describe("Type of schema (e.g., 'policy' for main product schema)"),
      name: z.string().describe("Product name (e.g., 'casco', 'liability', 'property')"),
      version: z.string().describe("Schema version identifier"),
    },
    async ({ bearerToken, tenantId, type, name, version }) => {
      try {
        const client = createLedgerClient(bearerToken, tenantId);
        
        const uiSchema = await client.get(`/api/v1/ledger/schemes/${type}/regular-renewal/${name}/${version}/ui`);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                uiSchema,
                meta: {
                  type,
                  name,
                  version,
                  retrievedAt: new Date().toISOString(),
                  schemaType: "ui-schema",
                },
                usage: "Use this UI schema with React JSON Schema Form to render form interfaces. It defines field ordering, widgets, help text, and visual layout.",
                relatedTools: {
                  schema: "Use ledger_get_schema or ledger_get_renewal_schema for data validation schema",
                  feature: "Use ledger_get_feature_schema for individual feature UI schemas"
                },
                links: {
                  reactFormBuilder: "https://rjsf-team.github.io/react-jsonschema-form/",
                  uiSchemaDoc: "https://rjsf-team.github.io/react-jsonschema-form/docs/api-reference/uiSchema"
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
                version,
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}