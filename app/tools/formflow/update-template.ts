import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createFormFlowClient } from "./index";

const UpdateTemplateSchema = z.object({
  bearerToken: z.string().optional(),
  clientId: z.string().optional(),
  clientSecret: z.string().optional(),
  organizationId: z.string().optional(),
  templateId: z.number().positive("Template ID must be a positive number"),
  name: z.string().optional(),
  description: z.string().optional(),
  version: z.number().optional(),
  schema: z.record(z.any()).optional(),
  vendorSchemaName: z.string().optional(),
  vendorSchemaVersion: z.number().optional(),
  vendorSchema: z.record(z.any()).optional(),
  emailAlias: z.string().optional(),
  extractionStrategyId: z.string().optional(),
  state: z.enum(["draft", "published"]).optional(),
});

export function registerFormFlowUpdateTemplateTool(server: McpServer) {
  server.tool(
    "formflow_update_template",
    "Update an existing FormFlow template with new information. Allows modification of template properties including name, description, schema, extraction strategy, and state. Use this for template maintenance, version updates, or configuration changes. Only provided fields will be updated.",
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
        description: "Unique numeric identifier of the template to update.",
      },
      name: {
        type: "string",
        description: "New name for the template (optional).",
      },
      description: {
        type: "string",
        description: "New description for the template (optional).",
      },
      version: {
        type: "number",
        description: "New version number for the template (optional).",
      },
      schema: {
        type: "object",
        description: "New JSON schema definition for data extraction (optional).",
      },
      vendorSchemaName: {
        type: "string",
        description: "New vendor schema name (optional).",
      },
      vendorSchemaVersion: {
        type: "number",
        description: "New vendor schema version (optional).",
      },
      vendorSchema: {
        type: "object",
        description: "New vendor-specific schema (optional).",
      },
      emailAlias: {
        type: "string",
        description: "New email alias for template submissions (optional).",
      },
      extractionStrategyId: {
        type: "string",
        description: "New extraction strategy UUID (optional).",
      },
      state: {
        type: "string",
        description: "Template state: 'draft' or 'published' (optional).",
      },
    },
    async (request) => {
      try {
        const params = UpdateTemplateSchema.parse(request.params);
        const client = createFormFlowClient(params);

        const updateData: any = {};
        if (params.name !== undefined) updateData.name = params.name;
        if (params.description !== undefined) updateData.description = params.description;
        if (params.version !== undefined) updateData.version = params.version;
        if (params.schema !== undefined) updateData.schema = params.schema;
        if (params.vendorSchemaName !== undefined) updateData.vendorSchemaName = params.vendorSchemaName;
        if (params.vendorSchemaVersion !== undefined) updateData.vendorSchemaVersion = params.vendorSchemaVersion;
        if (params.vendorSchema !== undefined) updateData.vendorSchema = params.vendorSchema;
        if (params.emailAlias !== undefined) updateData.emailAlias = params.emailAlias;
        if (params.extractionStrategyId !== undefined) updateData.extractionStrategyId = params.extractionStrategyId;
        if (params.state !== undefined) updateData.state = params.state;

        const updatedTemplate = await client.updateTemplate(params.templateId, updateData);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                isError: false,
                data: updatedTemplate,
                message: `Template ID ${params.templateId} updated successfully`,
                updatedFields: Object.keys(updateData),
                usage: "Template changes are now active. New submissions will use the updated template configuration.",
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
                  permissions: "Check that your account has permission to modify this template",
                  validation: "Verify that schema and vendorSchema are valid JSON objects",
                  state: "State must be either 'draft' or 'published'",
                  version: "Version should be incremented when making significant changes",
                },
              }, null, 2),
            },
          ],
        };
      }
    }
  );
}