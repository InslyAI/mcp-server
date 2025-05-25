/**
 * Send Policy Email Tool
 * Sends email notifications and requests related to policies
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../client";

export function registerSendPolicyEmailTool(server: McpServer) {
  server.tool(
    "ledger_send_policy_email",
    "Send email notifications and information requests related to policies",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      policyId: z.string().describe("ID of the policy for email communication"),
      emailType: z.enum(["request_information", "general_email"]).describe("Type of email to send"),
      emailData: z.object({
        recipient: z.string().optional().describe("Email recipient"),
        subject: z.string().optional().describe("Email subject"),
        message: z.string().optional().describe("Email message content"),
        template: z.string().optional().describe("Email template to use"),
        attachDocuments: z.boolean().optional().describe("Whether to attach policy documents"),
        requestType: z.string().optional().describe("Type of information being requested"),
        dueDate: z.string().optional().describe("Due date for information request")
      }).describe("Email configuration data")
    },
    async ({ bearerToken, tenantId, policyId, emailType, emailData }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        let endpoint;
        switch (emailType) {
          case "request_information":
            endpoint = `/api/v1/ledger/sales/policies/${policyId}/request-information-by-email`;
            break;
          case "general_email":
            endpoint = `/api/v1/ledger/sales/policies/${policyId}/send-email`;
            break;
        }
        
        const response = await client.post(endpoint, emailData);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                policyId: policyId,
                emailType: emailType,
                emailSent: true,
                recipient: emailData.recipient,
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
                error: "Failed to send policy email",
                details: error.message,
                statusCode: error.status,
                policyId: policyId,
                emailType: emailType
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}