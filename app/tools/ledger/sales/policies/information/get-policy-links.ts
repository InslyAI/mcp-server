/**
 * Get Policy Links Tool
 * Retrieves related links and resources for a policy
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createLedgerClient } from "../../../client";

export function registerGetPolicyLinksTool(server: McpServer) {
  server.tool(
    "ledger_sales_policies_get_links",
    "Get related links and resources for a policy including actions, documents, and related policies",
    {
      bearerToken: z.string().min(1).describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      policyId: z.string().min(1).describe("ID of the policy to get links for"),
      linkTypes: z.array(z.string()).optional().describe("Specific types of links to retrieve (actions, documents, related_policies, etc.)")
    },
    async ({ bearerToken, tenantId, policyId, linkTypes }) => {
      try {
        const client = createLedgerClient(bearerToken, tenantId);
        
        const queryParams = new URLSearchParams();
        if (linkTypes && linkTypes.length > 0) {
          linkTypes.forEach(type => queryParams.append('link_types[]', type));
        }
        
        const endpoint = `/api/v1/ledger/sales/policies/${policyId}/links${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        
        const response = await client.get(endpoint);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                policyId: policyId,
                links: {
                  actions: response.actions || [],
                  documents: response.documents || [],
                  relatedPolicies: response.relatedPolicies || [],
                  claims: response.claims || [],
                  endorsements: response.endorsements || [],
                  renewals: response.renewals || [],
                  mtas: response.mtas || [],
                  payments: response.payments || []
                },
                metadata: {
                  totalLinks: response.totalLinks || 0,
                  lastUpdated: response.lastUpdated,
                  linkTypes: linkTypes || ["all"]
                }
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
                error: "Failed to retrieve policy links",
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