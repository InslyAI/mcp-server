import { createLedgerClient } from "../../client";
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerIssueQuoteTools(server: McpServer) {
  server.tool(
    "ledger_sales_quotes_issue",
    "Issue a quote to convert it into a policy. This is an asynchronous operation that returns a request ID for status tracking",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header (e.g., 'accelerate')"),
      quoteId: z.string().describe("Unique identifier of the quote to issue"),
      issueData: z.record(z.any()).optional().describe("Additional data required for issuing (installments, effective date, etc.)"),
    },
    async ({ bearerToken, tenantId, quoteId, issueData }) => {
      try {
        const client = createLedgerClient(bearerToken, tenantId);
        
        const payload = issueData || {};
        const data = await client.post(`/api/v1/ledger/sales/policies/${quoteId}/issue`, payload);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                requestId: data.requestId,
                quoteId,
                message: `Quote ${quoteId} issue process started successfully`,
                meta: {
                  quoteId,
                  requestId: data.requestId,
                  issuedAt: new Date().toISOString(),
                  status: "processing",
                },
                usage: "Issue process is asynchronous. Use the requestId to check status with /api/v1/ledger/requests/{requestId}",
                nextSteps: [
                  "Monitor the issue process status using the returned requestId",
                  "Once completed, the quote will be converted to an active policy",
                  "The policy will have a new policy number and be available in the policies endpoints"
                ],
                relatedTools: {
                  status: "Check issue status using request monitoring tools",
                  policy: "Once issued, use policy tools to manage the resulting policy"
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
                quoteId,
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}