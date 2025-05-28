import { createLedgerClient } from "../../client";
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerGeneratePolicyDocumentTools(server: McpServer) {
  server.tool(
    "ledger_policies_documents_generate",
    "Generate a policy document of a specific type. The document is generated based on the policy data and returns binary content",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header (e.g., 'accelerate')"),
      policyId: z.number().int().positive().describe("Unique identifier of the policy"),
      documentType: z.string().describe("Type of document to generate (e.g., 'quote', 'wording', 'certificate')"),
    },
    async ({ bearerToken, tenantId, policyId, documentType }) => {
      try {
        // For document generation, we need to handle binary responses differently
        const url = `https://${tenantId}.app.beta.insly.training/api/v1/ledger/policies/${policyId}/generate-document/${documentType}`;
        
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${bearerToken}`,
            'X-Tenant-ID': tenantId,
            'Accept': 'application/json', // We might get binary or JSON response
          },
        });

        if (!response.ok) {
          throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }

        // Check if response is binary (PDF, Word, etc.) or JSON
        const contentType = response.headers.get('content-type') || '';
        
        if (contentType.includes('application/json')) {
          // JSON response - might be error or metadata
          const data = await response.json();
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  success: true,
                  document: data,
                  policyId,
                  documentType,
                  contentType,
                  meta: {
                    policyId,
                    documentType,
                    generatedAt: new Date().toISOString(),
                    contentType,
                  }
                }, null, 2)
              }
            ]
          };
        } else {
          // Binary response - convert to base64 for transfer
          const arrayBuffer = await response.arrayBuffer();
          const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
          
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  success: true,
                  documentBase64: base64,
                  policyId,
                  documentType,
                  contentType,
                  size: arrayBuffer.byteLength,
                  meta: {
                    policyId,
                    documentType,
                    generatedAt: new Date().toISOString(),
                    contentType,
                    sizeBytes: arrayBuffer.byteLength,
                  },
                  usage: "Document generated successfully. The documentBase64 field contains the binary document encoded in base64. Decode this to get the actual document file.",
                  relatedTools: {
                    types: "Use ledger_get_document_types to see all available document types",
                    upload: "Use ledger_upload_policy_files to add additional documents"
                  }
                }, null, 2)
              }
            ]
          };
        }
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred',
                policyId,
                documentType,
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}