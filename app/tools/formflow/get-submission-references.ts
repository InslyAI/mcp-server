import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { createFormFlowClient } from "./index";

export function registerFormFlowGetSubmissionReferencesTool(server: McpServer) {
  server.tool(
    "formflow_get_submission_references",
    `Retrieve AI-generated references for FormFlow submission answers.

This tool fetches references that link submission answers back to source documents. References provide:
• Document citations for extracted data points
• Page/location references within documents
• Confidence scores for AI extractions
• Source validation for compliance and auditing

**Authentication Options:**
1. Use bearerToken (recommended) - Get from formflow_exchange_token tool
2. Use clientId, clientSecret, and organizationId directly

**Common Use Cases:**
• Audit AI extractions for accuracy
• Provide citations for regulatory compliance
• Validate data sources for critical information
• Debug extraction issues by reviewing source locations

**Note**: References are typically generated automatically after AI extraction, but can also be manually triggered using formflow_ai_generate_references tool.`,
    {
      bearerToken: z.string().optional().describe("JWT bearer token from formflow_exchange_token (recommended for security)"),
      clientId: z.string().optional().describe("FormFlow client identifier (alternative to bearerToken)"),
      clientSecret: z.string().optional().describe("FormFlow client secret (alternative to bearerToken)"),
      organizationId: z.string().optional().describe("FormFlow organization identifier (alternative to bearerToken)"),
      submissionId: z.string().describe("ID of the submission to get references for"),
    },
    async ({ bearerToken, clientId, clientSecret, organizationId, submissionId }) => {
      try {
        const client = createFormFlowClient({ bearerToken, clientId, clientSecret, organizationId });

        const references = await client.get(`/api/submission/${submissionId}/references`);

        return {
          content: [
            {
              type: "text",
              text: `📚 **FormFlow Submission References**\n\n` +
                `📋 **Submission ID**: ${submissionId}\n\n` +
                (Array.isArray(references) && references.length > 0
                  ? `**References Found**: ${references.length}\n\n` +
                    `${references.map((ref: any, index: number) => {
                      return `**Reference ${index + 1}**:\n` +
                        `• **Field**: ${ref.field || 'N/A'}\n` +
                        `• **Value**: ${ref.value || 'N/A'}\n` +
                        `• **Source**: ${ref.source || 'N/A'}\n` +
                        `• **Page**: ${ref.page || 'N/A'}\n` +
                        `• **Confidence**: ${ref.confidence ? Math.round(ref.confidence * 100) + '%' : 'N/A'}`;
                    }).join('\n\n')}\n\n`
                  : `**No references found**\n\n` +
                    `This could mean:\n` +
                    `• AI extraction hasn't been performed yet\n` +
                    `• References generation is still in progress\n` +
                    `• No extractable data was found in documents\n\n`
                ) +
                `💡 **Tip**: Use formflow_ai_generate_references to create references if missing`
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `❌ **Error retrieving submission references**\n\n` +
                `**Submission ID**: ${submissionId}\n` +
                `**Error**: ${error instanceof Error ? error.message : 'Unknown error occurred'}\n\n` +
                `**Troubleshooting**:\n` +
                `• Verify the submission ID exists and you have access\n` +
                `• Check if the submission has been processed with AI extraction\n` +
                `• Ensure your authentication credentials are valid\n` +
                `• Try generating references first with formflow_ai_generate_references`
            }
          ],
          isError: true
        };
      }
    }
  );
}