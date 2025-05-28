/**
 * Issue Endorsement Tool
 * Issues an approved endorsement to apply changes to the policy
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../../client";

export function registerIssueEndorsementTool(server: McpServer) {
  server.tool(
    "ledger_issue_endorsement",
    "Issue an approved endorsement to officially apply the changes to the policy",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      endorsementId: z.string().describe("ID of the endorsement to issue"),
      issuanceOptions: z.object({
        issueDate: z.string().optional().describe("Date to issue the endorsement (ISO date, defaults to current date)"),
        generateDocuments: z.boolean().optional().describe("Whether to automatically generate endorsement documents"),
        notifyBroker: z.boolean().optional().describe("Whether to send notification to the broker"),
        notifyInsured: z.boolean().optional().describe("Whether to send notification to the insured party"),
        reference: z.string().optional().describe("Reference number or identifier for this issuance"),
        notes: z.string().optional().describe("Additional notes for the issuance"),
      }).optional().describe("Options for issuing the endorsement"),
    },
    async ({ bearerToken, tenantId, endorsementId, issuanceOptions }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const payload = {
          ...(issuanceOptions && issuanceOptions)
        };
        
        const response = await client.post(
          `/endorsements/${endorsementId}/issue`,
          payload,
          {
            "Accept-Language": "en"
          }
        );

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                issuedEndorsement: {
                  id: response.id,
                  policyId: response.policyId,
                  endorsementNumber: response.endorsementNumber,
                  status: response.status,
                  issuedDate: response.issuedDate,
                  effectiveDate: response.effectiveDate,
                  premiumAdjustment: response.premiumAdjustment,
                  documentsGenerated: response.documentsGenerated,
                  notificationsSent: response.notificationsSent,
                  reference: response.reference,
                  updatedPolicy: {
                    id: response.updatedPolicy.id,
                    version: response.updatedPolicy.version,
                    lastModified: response.updatedPolicy.lastModified
                  }
                },
                message: "Endorsement issued successfully and policy updated"
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
                error: "Failed to issue endorsement",
                details: error.message,
                statusCode: error.status
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}