import { createLedgerClient } from "../client";
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerGenerateQuoteDocumentTools(server: McpServer) {
  server.tool(
    "ledger_generate_quote_document",
    "Generate the main quote document or a specific document type for a quote. Returns binary document content",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header (e.g., 'accelerate')"),
      quoteId: z.number().int().positive().describe("Unique identifier of the quote"),
      documentType: z.string().optional().describe("Specific document type to generate (e.g., 'wording'). If not provided, generates main document"),
    },
    async ({ bearerToken, tenantId, quoteId, documentType }) => {
      try {
        // Build endpoint based on whether specific document type is requested
        const endpoint = documentType 
          ? `/api/v1/ledger/sales/policies/${quoteId}/generated-documents/${documentType}`
          : `/api/v1/ledger/sales/policies/${quoteId}/generated-documents`;
          
        const url = `https://${tenantId}.app.beta.insly.training${endpoint}`;
        
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${bearerToken}`,
            'X-Tenant-ID': tenantId,
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }

        // Check if response is binary or JSON
        const contentType = response.headers.get('content-type') || '';
        
        if (contentType.includes('application/json')) {
          // JSON response
          const data = await response.json();
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  success: true,
                  document: data,
                  quoteId,
                  documentType: documentType || 'main',
                  contentType,
                  meta: {
                    quoteId,
                    documentType: documentType || 'main',
                    generatedAt: new Date().toISOString(),
                    contentType,
                  }
                }, null, 2)
              }
            ]
          };
        } else {
          // Binary response - convert to base64
          const arrayBuffer = await response.arrayBuffer();
          const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
          
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  success: true,
                  documentBase64: base64,
                  quoteId,
                  documentType: documentType || 'main',
                  contentType,
                  size: arrayBuffer.byteLength,
                  meta: {
                    quoteId,
                    documentType: documentType || 'main',
                    generatedAt: new Date().toISOString(),
                    contentType,
                    sizeBytes: arrayBuffer.byteLength,
                  },
                  usage: "Quote document generated successfully. The documentBase64 field contains the binary document encoded in base64.",
                  relatedTools: {
                    policy: "Use ledger_generate_policy_document for policy documents",
                    upload: "Use ledger_upload_quote_files to add additional documents",
                    issue: "Use ledger_issue_quote to convert quote to policy"
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
                quoteId,
                documentType: documentType || 'main',
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}