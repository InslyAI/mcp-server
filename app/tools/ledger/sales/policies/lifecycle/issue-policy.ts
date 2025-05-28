/**
 * Issue Policy Tool
 * Issues a final policy from a quote or draft
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../../../client";

export function registerIssuePolicyTool(server: McpServer) {
  server.tool(
    "ledger_sales_policies_lifecycle_issue",
    "Issue a final policy from a quote or draft, making it active and binding",
    {
      bearerToken: z.string().min(1).describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      policyId: z.string().min(1).describe("ID of the policy to issue"),
      issuanceData: z.object({
        effectiveDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe("Policy effective date (YYYY-MM-DD)"),
        issueDate: z.string().optional().describe("Date of issuance (defaults to current date)"),
        finalPremium: z.number().positive().optional().describe("Final confirmed premium amount"),
        paymentTerms: z.string().optional().describe("Payment terms for the policy"),
        policyNumber: z.string().optional().describe("Specific policy number to assign"),
        issuedBy: z.string().optional().describe("User ID of who issued the policy"),
        notes: z.string().optional().describe("Issuance notes"),
        sendNotifications: z.boolean().optional().describe("Whether to send issuance notifications"),
        generateDocuments: z.boolean().optional().describe("Whether to generate policy documents")
      }).describe("Policy issuance data")
    },
    async ({ bearerToken, tenantId, policyId, issuanceData }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const response = await client.post(`/api/v1/ledger/sales/policies/${policyId}/issue`, issuanceData);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                message: "Policy issued successfully",
                policyId: policyId,
                policyNumber: response.policyNumber || response.data?.policyNumber,
                effectiveDate: issuanceData.effectiveDate,
                issueDate: response.issueDate || issuanceData.issueDate || new Date().toISOString().split('T')[0],
                status: "issued",
                issuanceData: issuanceData,
                response: response
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
                error: "Failed to issue policy",
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