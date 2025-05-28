import { createLedgerClient } from "../client";
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerGetDocumentTypesTools(server: McpServer) {
  server.tool(
    "ledger_documents_get_types",
    "Get list of available document types that can be generated for a specific policy based on its configuration and current state",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header (e.g., 'accelerate')"),
      policyId: z.number().int().positive().describe("Unique identifier of the policy"),
    },
    async ({ bearerToken, tenantId, policyId }) => {
      try {
        const client = createLedgerClient(bearerToken, tenantId);
        
        const documentTypes = await client.get(`/api/v1/ledger/policies/${policyId}/document-types`);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                documentTypes: Array.isArray(documentTypes) ? documentTypes : [],
                policyId,
                meta: {
                  policyId,
                  count: Array.isArray(documentTypes) ? documentTypes.length : 0,
                  retrievedAt: new Date().toISOString(),
                },
                usage: "These document types are available for generation based on the policy's current configuration and state. Use the type names with document generation tools.",
                relatedTools: {
                  generate: "Use ledger_generate_policy_document with these document types",
                  quote: "Use ledger_generate_quote_document for quote-specific documents"
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
                policyId,
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}