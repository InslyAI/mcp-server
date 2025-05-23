import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { createFormFlowClient } from "./index";

export function registerFormFlowCreateTemplateTool(server: McpServer) {
  server.tool(
    "formflow_create_template",
    `Create a new FormFlow template for document processing and data extraction.

Templates define the structure and schema for extracting data from documents. They include:
• Field definitions and data types for extraction
• Validation rules and constraints
• Integration with external vendor schemas (Insly, others)
• AI extraction strategies and processing instructions
• Email aliases for form submission routing

**Template Components:**
• **Schema**: JSON schema defining fields and validation rules
• **Vendor Integration**: Optional connection to external systems (Insly)
• **Email Alias**: Unique identifier for email-based submissions
• **AI Strategy**: Extraction method (atomic, claude-3-7, gemini-2-5, etc.)
• **State**: Draft (testing) or Published (live)

**Authentication Options:**
1. Use bearerToken (recommended) - Get from formflow_exchange_token tool
2. Use clientId, clientSecret, and organizationId directly

**Common Use Cases:**
• Create templates for insurance forms (auto, home, commercial)
• Set up document processing for specific document types
• Define data extraction schemas for regulatory compliance
• Build reusable templates for common business processes`,
    {
      bearerToken: z.string().optional().describe("JWT bearer token from formflow_exchange_token (recommended for security)"),
      clientId: z.string().optional().describe("FormFlow client identifier (alternative to bearerToken)"),
      clientSecret: z.string().optional().describe("FormFlow client secret (alternative to bearerToken)"),
      organizationId: z.string().optional().describe("FormFlow organization identifier (alternative to bearerToken)"),
      name: z.string().min(1).max(255).describe("Template name (required, max 255 characters)"),
      description: z.string().optional().describe("Template description explaining its purpose and usage"),
      version: z.number().min(1).default(1).describe("Template version number (starts at 1)"),
      schema: z.object({}).passthrough().describe("JSON schema defining fields and validation rules for data extraction"),
      emailAlias: z.string().optional().describe("Unique email alias for routing submissions (e.g., 'auto-insurance-claims')"),
      vendorSchemaName: z.string().optional().describe("External vendor schema name (e.g., 'wholesale', 'home', 'commercial')"),
      vendorSchemaVersion: z.number().optional().describe("External vendor schema version number"),
      vendorSchema: z.object({}).passthrough().optional().describe("External vendor schema definition"),
      aiGenerated: z.boolean().default(false).describe("Whether this template was generated using AI"),
      state: z.enum(["draft", "published"]).default("draft").describe("Template state (draft for testing, published for production)"),
    },
    async ({ bearerToken, clientId, clientSecret, organizationId, ...templateData }) => {
      try {
        const client = createFormFlowClient({ bearerToken, clientId, clientSecret, organizationId });

        const template = await client.post('/api/template', templateData);

        return {
          content: [
            {
              type: "text",
              text: `✅ **Template created successfully**\n\n` +
                `📝 **Name**: ${template.name}\n` +
                `🆔 **Template ID**: ${template.id}\n` +
                `📋 **UUID**: ${template.templateId}\n` +
                `📊 **Version**: ${template.version}\n` +
                `🔄 **State**: ${template.state}\n` +
                `📅 **Created**: ${new Date(template.createdAt || Date.now()).toLocaleString()}\n` +
                (template.description ? `📄 **Description**: ${template.description}\n` : '') +
                (template.emailAlias ? `📧 **Email Alias**: ${template.emailAlias}\n` : '') +
                (template.vendorSchemaName ? `🔗 **Vendor Schema**: ${template.vendorSchemaName} v${template.vendorSchemaVersion}\n` : '') +
                `🤖 **AI Generated**: ${template.aiGenerated ? 'Yes' : 'No'}\n\n` +
                `**Next Steps**:\n` +
                `• Use formflow_create_submission to test with this template\n` +
                `• Update to "published" state when ready for production\n` +
                `• Configure email routing if emailAlias was provided\n\n` +
                `💡 **Tip**: Keep templates in "draft" state during development and testing`
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `❌ **Error creating FormFlow template**\n\n` +
                `**Error**: ${error instanceof Error ? error.message : 'Unknown error occurred'}\n\n` +
                `**Troubleshooting**:\n` +
                `• Verify template name is unique and under 255 characters\n` +
                `• Check that schema is valid JSON object\n` +
                `• Ensure emailAlias is unique if provided\n` +
                `• Verify vendor schema references are correct\n` +
                `• Check your authentication credentials`
            }
          ],
          isError: true
        };
      }
    }
  );
}