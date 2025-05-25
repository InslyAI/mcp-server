import { createLedgerClient } from "../client";
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerGetRenewalSchemaTools(server: McpServer) {
  server.tool(
    "ledger_get_renewal_schema",
    "Get JSON schema structure specifically for renewal quotes of a product type. Renewal schemas may have different validation rules than regular schemas",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header (e.g., 'accelerate')"),
      type: z.string().describe("Type of schema (e.g., 'policy' for main product schema)"),
      name: z.string().describe("Product name (e.g., 'casco', 'liability', 'property')"),
    },
    async ({ bearerToken, tenantId, type, name }) => {
      try {
        const client = createLedgerClient(bearerToken, tenantId);
        
        const schema = await client.get(`/api/v1/ledger/schemes/${type}/regular-renewal/${name}`);
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
                  schemaType: "regular-renewal",
                },
                usage: "Use this schema specifically for renewal quote validation. It may have different required fields and validation rules compared to new business.",
                relatedTools: {
                  regular: "Use ledger_get_schema for new business schema",
                  ui: "Use ledger_get_schema_ui for form rendering schema",
                  prepare: "Use ledger_renew_policy to prepare renewal data"
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