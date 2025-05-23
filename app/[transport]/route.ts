import { createMcpHandler } from "@vercel/mcp-adapter";
import { registerAllTools } from "../tools";

const handler = createMcpHandler(
  (server) => {
    registerAllTools(server);
  },
  {
    capabilities: {
      tools: {
        echo: {
          description: "Echo a message",
        },
        calculator: {
          description: "Perform basic mathematical calculations",
        },
        formflow_exchange_token: {
          description: "Exchange FormFlow credentials for a JWT bearer token",
        },
        formflow_list_submissions: {
          description: "List FormFlow submissions with optional filtering and pagination",
        },
        formflow_create_submission: {
          description: "Create a new FormFlow submission",
        },
        formflow_get_submission: {
          description: "Get a specific FormFlow submission by ID",
        },
        formflow_update_submission: {
          description: "Update FormFlow submission details and metadata",
        },
        formflow_get_submission_references: {
          description: "Get AI-generated references linking answers to source documents",
        },
        formflow_get_submission_events: {
          description: "Get processing lifecycle events for a FormFlow submission",
        },
        formflow_get_upload_url: {
          description: "Get temporary S3 upload URL for FormFlow submission files",
        },
        formflow_list_templates: {
          description: "List FormFlow templates with optional pagination",
        },
        formflow_get_template: {
          description: "Get detailed information about a specific FormFlow template",
        },
        formflow_create_template: {
          description: "Create a new FormFlow template with schema definition",
        },
        formflow_update_template: {
          description: "Update existing FormFlow template configuration",
        },
        formflow_delete_template: {
          description: "Soft delete a FormFlow template",
        },
        formflow_get_file: {
          description: "Get detailed information about a FormFlow file",
        },
        formflow_delete_file: {
          description: "Permanently delete a FormFlow file",
        },
        formflow_ai_extract_data: {
          description: "Use AI to extract data from FormFlow submission documents",
        },
        formflow_ai_generate_metadata: {
          description: "Generate metadata for FormFlow submission using AI",
        },
        formflow_create_webhook: {
          description: "Create webhook subscription for FormFlow event notifications",
        },
        formflow_list_webhooks: {
          description: "List all FormFlow webhook subscriptions",
        },
        formflow_get_webhook: {
          description: "Get detailed information about a FormFlow webhook subscription",
        },
        formflow_update_webhook: {
          description: "Update FormFlow webhook subscription configuration",
        },
        formflow_delete_webhook: {
          description: "Delete FormFlow webhook subscription",
        },
      },
    },
  },
  {
    redisUrl: process.env.REDIS_URL,
    basePath: "",
    verboseLogs: true,
    maxDuration: 800,
  }
);

export { handler as GET, handler as POST, handler as DELETE };
