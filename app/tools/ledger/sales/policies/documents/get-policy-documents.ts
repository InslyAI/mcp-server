/**
 * Get Policy Documents Tool
 * Retrieves generated documents for a policy
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../../../client";

export function registerGetPolicyDocumentsTool(server: McpServer) {
  server.tool(
    "ledger_get_policy_documents",
    "Get list of generated documents for a specific policy",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      policyId: z.string().describe("ID of the policy to get documents for"),
      documentType: z.string().optional().describe("Optional filter by document type"),
    },
    async ({ bearerToken, tenantId, policyId, documentType }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        let endpoint = `/api/v1/ledger/sales/policies/${policyId}/generated-documents`;
        if (documentType) {
          endpoint += `/${documentType}`;
        }
        
        const response = await client.get(endpoint);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                policyId: policyId,
                documentType: documentType || "all",
                documents: response.documents || response,
                totalCount: Array.isArray(response.documents || response) ? (response.documents || response).length : 0
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
                error: "Failed to retrieve policy documents",
                details: error.message,
                statusCode: error.status,
                policyId: policyId
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}