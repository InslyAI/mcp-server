import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createFormFlowClient } from "./index";


export function registerFormFlowUpdateTemplateTool(server: McpServer) {
  server.tool(
    "formflow_update_template",
    "Update an existing FormFlow template with new information. Allows modification of template properties including name, description, schema, extraction strategy, and state. Use this for template maintenance, version updates, or configuration changes. Only provided fields will be updated.",
    {
      bearerToken: z.string().optional().describe("JWT bearer token (valid for 1 hour). Use this OR the credential trio below."),
      clientId: z.string().optional().describe("FormFlow API client ID. Required if bearerToken is not provided."),
      clientSecret: z.string().optional().describe("FormFlow API client secret. Required if bearerToken is not provided."),
      organizationId: z.string().optional().describe("FormFlow organization ID. Required if bearerToken is not provided."),
      templateId: z.number().describe("Unique numeric identifier of the template to update."),
      name: z.string().optional().describe("New name for the template (optional)."),
      description: z.string().optional().describe("New description for the template (optional)."),
      version: z.number().optional().describe("New version number for the template (optional)."),
      schema: z.record(z.any()).optional().describe("New JSON schema definition for data extraction (optional)."),
      vendorSchemaName: z.string().optional().describe("New vendor schema name (optional)."),
      vendorSchemaVersion: z.number().optional().describe("New vendor schema version (optional)."),
      vendorSchema: z.record(z.any()).optional().describe("New vendor-specific schema (optional)."),
      emailAlias: z.string().optional().describe("New email alias for template submissions (optional)."),
      extractionStrategyId: z.string().optional().describe("New extraction strategy UUID (optional)."),
      state: z.enum(["draft", "published"]).optional().describe("Template state: 'draft' or 'published' (optional)."),
    },
    async ({ bearerToken, clientId, clientSecret, organizationId, templateId, name, description, version, schema, vendorSchemaName, vendorSchemaVersion, vendorSchema, emailAlias, extractionStrategyId, state }) => {
      try {
        const client = createFormFlowClient({ bearerToken, clientId, clientSecret, organizationId });

        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (description !== undefined) updateData.description = description;
        if (version !== undefined) updateData.version = version;
        if (schema !== undefined) updateData.schema = schema;
        if (vendorSchemaName !== undefined) updateData.vendorSchemaName = vendorSchemaName;
        if (vendorSchemaVersion !== undefined) updateData.vendorSchemaVersion = vendorSchemaVersion;
        if (vendorSchema !== undefined) updateData.vendorSchema = vendorSchema;
        if (emailAlias !== undefined) updateData.emailAlias = emailAlias;
        if (extractionStrategyId !== undefined) updateData.extractionStrategyId = extractionStrategyId;
        if (state !== undefined) updateData.state = state;

        const updatedTemplate = await client.updateTemplate(templateId, updateData);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                isError: false,
                data: updatedTemplate,
                message: `Template ID ${templateId} updated successfully`,
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