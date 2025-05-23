import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createFormFlowClient } from "./index";

const DeleteTemplateSchema = z.object({
  bearerToken: z.string().optional(),
  clientId: z.string().optional(),
  clientSecret: z.string().optional(),
  organizationId: z.string().optional(),
  templateId: z.number().positive("Template ID must be a positive number"),
});

export function registerFormFlowDeleteTemplateTool(server: McpServer) {
  server.tool(
    "formflow_delete_template",
    "Soft delete a FormFlow template by marking it as deleted. This operation is reversible and does not permanently remove the template from the system. Existing submissions using this template will continue to work, but new submissions cannot be created with a deleted template. Use with caution as this affects template availability.",
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
        description: "Unique numeric identifier of the template to delete.",
      },
    },
    async (request) => {
      try {
        const params = DeleteTemplateSchema.parse(request.params);
        const client = createFormFlowClient(params);

        await client.deleteTemplate(params.templateId);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                isError: false,
                data: {
                  templateId: params.templateId,
                  status: "deleted",
                },
                message: `Template ID ${params.templateId} has been soft deleted successfully`,
                warning: "This template is now unavailable for new submissions. Existing submissions are unaffected.",
                recovery: "Contact support if you need to restore this template.",
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
                  permissions: "Check that your account has permission to delete this template",
                  dependencies: "Verify that no critical processes depend on this template before deletion",
                },
              }, null, 2),
            },
          ],
        };
      }
    }
  );
}