import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerFormFlowListSubmissionsTool } from "./list-submissions";
import { registerFormFlowCreateSubmissionTool } from "./create-submission";
import { registerFormFlowGetSubmissionTool } from "./get-submission";
import { registerFormFlowListTemplatesTool } from "./list-templates";
import { registerFormFlowAIExtractDataTool } from "./ai-extract-data";
import { registerFormFlowAIGenerateMetadataTool } from "./ai-generate-metadata";
import type { FormFlowCredentials } from "../../lib/formflow-client";

/**
 * Register all FormFlow MCP tools
 */
export function registerFormFlowTools(server: McpServer) {
  registerFormFlowListSubmissionsTool(server);
  registerFormFlowCreateSubmissionTool(server);
  registerFormFlowGetSubmissionTool(server);
  registerFormFlowListTemplatesTool(server);
  registerFormFlowAIExtractDataTool(server);
  registerFormFlowAIGenerateMetadataTool(server);
}

/**
 * Validate FormFlow credentials from MCP client
 */
export function validateCredentials(credentials: {
  clientId: unknown;
  clientSecret: unknown;
  organizationId: unknown;
}): FormFlowCredentials {
  if (typeof credentials.clientId !== 'string' || !credentials.clientId.trim()) {
    throw new Error('clientId is required and must be a non-empty string');
  }
  if (typeof credentials.clientSecret !== 'string' || !credentials.clientSecret.trim()) {
    throw new Error('clientSecret is required and must be a non-empty string');
  }
  if (typeof credentials.organizationId !== 'string' || !credentials.organizationId.trim()) {
    throw new Error('organizationId is required and must be a non-empty string');
  }

  return {
    clientId: credentials.clientId.trim(),
    clientSecret: credentials.clientSecret.trim(),
    organizationId: credentials.organizationId.trim(),
  };
}