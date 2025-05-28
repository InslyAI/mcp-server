/**
 * Manage Policy Referrals Tool
 * Handles policy referrals including acceptance and decline
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createLedgerClient } from "../../../client";

export function registerManagePolicyReferralsTool(server: McpServer) {
  server.tool(
    "ledger_sales_policies_referrals_manage",
    "Manage policy referrals including listing, accepting, and declining referrals",
    {
      bearerToken: z.string().min(1).describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      policyId: z.string().min(1).describe("ID of the policy to manage referrals for"),
      action: z.enum(["list", "accept", "decline"]).describe("Action to perform on policy referrals"),
      referralData: z.object({
        reason: z.string().optional().describe("Reason for acceptance or decline"),
        notes: z.string().optional().describe("Additional notes"),
        assignedTo: z.string().optional().describe("User ID to assign referral to"),
        priority: z.string().optional().describe("Referral priority level"),
        dueDate: z.string().optional().describe("Due date for referral resolution")
      }).optional().describe("Referral action data")
    },
    async ({ bearerToken, tenantId, policyId, action, referralData }) => {
      try {
        const client = createLedgerClient(bearerToken, tenantId);
        
        let endpoint;
        let response;

        switch (action) {
          case "list":
            endpoint = `/api/v1/ledger/sales/policies/${policyId}/referrals`;
            response = await client.get(endpoint);
            break;
          case "accept":
            endpoint = `/api/v1/ledger/sales/policies/${policyId}/referrals/accept`;
            response = await client.post(endpoint, referralData || {});
            break;
          case "decline":
            endpoint = `/api/v1/ledger/sales/policies/${policyId}/referrals/decline`;
            response = await client.post(endpoint, referralData || {});
            break;
        }

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                policyId: policyId,
                action: action,
                result: response,
                referralData: referralData
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
                error: "Failed to manage policy referrals",
                details: error.message,
                statusCode: error.status,
                policyId: policyId,
                action: action
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}