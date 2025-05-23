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
        formflow_list_submissions: {
          description: "List FormFlow submissions with optional filtering and pagination",
        },
        formflow_create_submission: {
          description: "Create a new FormFlow submission",
        },
        formflow_get_submission: {
          description: "Get a specific FormFlow submission by ID",
        },
        formflow_list_templates: {
          description: "List FormFlow templates with optional pagination",
        },
        formflow_ai_extract_data: {
          description: "Use AI to extract data from FormFlow submission documents",
        },
        formflow_ai_generate_metadata: {
          description: "Generate metadata for FormFlow submission using AI",
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
