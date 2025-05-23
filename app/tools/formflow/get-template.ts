import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createFormFlowClient } from "./index";

const GetTemplateSchema = z.object({
  bearerToken: z.string().optional(),
  clientId: z.string().optional(),
  clientSecret: z.string().optional(),
  organizationId: z.string().optional(),
  templateId: z.number().positive("Template ID must be a positive number"),
});

export function registerFormFlowGetTemplateTool(server: McpServer) {
  server.tool(
    "formflow_get_template",
    "Retrieve detailed information about a specific FormFlow template by its ID. Returns the complete template definition including schema, extraction strategy, reference strategy, and metadata. This is useful for understanding template structure before creating submissions or for template management workflows.",
    {
      bearerToken: {
        type: "string",
        description: "JWT bearer token (valid for 1 hour). Use this OR the credential trio below.",
      },
      clientId: {
        type: "string", 
        description: "FormFlow API client ID. Required if bearerToken is not provided.",
      },
      clientSecret: {
        type: "string",
        description: "FormFlow API client secret. Required if bearerToken is not provided.",
      },
      organizationId: {
        type: "string",
        description: "FormFlow organization ID. Required if bearerToken is not provided.",
      },
      templateId: {
        type: "number",
        description: "Unique numeric identifier of the template to retrieve.",
      },
    },
    async (request) => {
      try {
        const params = GetTemplateSchema.parse(request.params);
        const client = createFormFlowClient(params);

        const template = await client.getTemplate(params.templateId);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                isError: false,
                data: {
                  id: template.id,
                  templateId: template.templateId,
                  name: template.name,
                  description: template.description,
                  version: template.version,
                  state: template.state,
                  schema: template.schema,
                  vendorSchemaName: template.vendorSchemaName,
                  vendorSchemaVersion: template.vendorSchemaVersion,
                  vendorSchema: template.vendorSchema,
                  aiGenerated: template.aiGenerated,
                  emailAlias: template.emailAlias,
                  extractionStrategyId: template.extractionStrategyId,
                  extractionStrategy: template.extractionStrategy,
                  referenceStrategy: template.referenceStrategy,
                },
                message: `Template "${template.name}" (ID: ${template.id}) retrieved successfully`,
                usage: "Use this template data to understand structure for creating submissions or for template management",
              }, null, 2),
            },
          ],
        };

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        
        return {
          content: [
            {
              type: "text", 
              text: JSON.stringify({
                isError: true,
                error: errorMessage,
                troubleshooting: {
                  authentication: "Verify your bearerToken is valid or provide all three credentials (clientId, clientSecret, organizationId)",
                  templateId: "Ensure the template ID exists and is accessible to your organization",
                  permissions: "Check that your account has permission to view this template",
                },
              }, null, 2),
            },
          ],
        };
      }
    }
  );
}