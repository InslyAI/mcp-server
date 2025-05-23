import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerFormFlowListSubmissionsTool } from "./list-submissions";
import { registerFormFlowCreateSubmissionTool } from "./create-submission";
import { registerFormFlowGetSubmissionTool } from "./get-submission";
import { registerFormFlowListTemplatesTool } from "./list-templates";
import { registerFormFlowAIExtractDataTool } from "./ai-extract-data";
import { registerFormFlowAIGenerateMetadataTool } from "./ai-generate-metadata";
import { registerFormFlowExchangeTokenTool } from "./exchange-token";
import { registerFormFlowUpdateSubmissionTool } from "./update-submission";
import { registerFormFlowGetSubmissionReferencesTool } from "./get-submission-references";
import { registerFormFlowGetSubmissionEventsTool } from "./get-submission-events";
import { registerFormFlowCreateTemplateTool } from "./create-template";
import { registerFormFlowCreateWebhookTool } from "./create-webhook";
import { registerFormFlowListWebhooksTool } from "./list-webhooks";
import { registerFormFlowGetUploadUrlTool } from "./get-upload-url";
import { registerFormFlowGetTemplateTool } from "./get-template";
import { registerFormFlowUpdateTemplateTool } from "./update-template";
import { registerFormFlowDeleteTemplateTool } from "./delete-template";
import { registerFormFlowGetFileTool } from "./get-file";
import { registerFormFlowDeleteFileTool } from "./delete-file";
import { registerFormFlowGetWebhookTool } from "./get-webhook";
import { registerFormFlowUpdateWebhookTool } from "./update-webhook";
import { registerFormFlowDeleteWebhookTool } from "./delete-webhook";
import { registerFormFlowStartProcessingTool } from "./start-processing";
import { registerFormFlowAIGenerateReferencesTool } from "./ai-generate-references";
import { registerFormFlowAIGenerateSchemaForSubmissionTool } from "./ai-generate-schema";
import { registerFormFlowGetTemplateSubmissionsTool } from "./get-template-submissions";
import { registerFormFlowFileViewTool } from "./file-view";
import type { FormFlowCredentials } from "../../lib/formflow-client";
import { FormFlowClient } from "../../lib/formflow-client";

/**
 * Register all FormFlow MCP tools
 */
export function registerFormFlowTools(server: McpServer) {
  registerFormFlowExchangeTokenTool(server);
  registerFormFlowListSubmissionsTool(server);
  registerFormFlowCreateSubmissionTool(server);
  registerFormFlowGetSubmissionTool(server);
  registerFormFlowUpdateSubmissionTool(server);
  registerFormFlowGetSubmissionReferencesTool(server);
  registerFormFlowGetSubmissionEventsTool(server);
  registerFormFlowGetUploadUrlTool(server);
  registerFormFlowListTemplatesTool(server);
  registerFormFlowGetTemplateTool(server);
  registerFormFlowCreateTemplateTool(server);
  registerFormFlowUpdateTemplateTool(server);
  registerFormFlowDeleteTemplateTool(server);
  registerFormFlowGetFileTool(server);
  registerFormFlowDeleteFileTool(server);
  registerFormFlowAIExtractDataTool(server);
  registerFormFlowAIGenerateMetadataTool(server);
  registerFormFlowCreateWebhookTool(server);
  registerFormFlowListWebhooksTool(server);
  registerFormFlowGetWebhookTool(server);
  registerFormFlowUpdateWebhookTool(server);
  registerFormFlowDeleteWebhookTool(server);
  registerFormFlowStartProcessingTool(server);
  registerFormFlowAIGenerateReferencesTool(server);
  registerFormFlowAIGenerateSchemaForSubmissionTool(server);
  registerFormFlowGetTemplateSubmissionsTool(server);
  registerFormFlowFileViewTool(server);
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

/**
 * Validate bearer token from MCP client
 */
export function validateBearerToken(token: unknown): string {
  if (typeof token !== 'string' || !token.trim()) {
    throw new Error('bearerToken is required and must be a non-empty string');
  }
  return token.trim();
}

/**
 * Create FormFlow client with either credentials or bearer token
 */
export function createFormFlowClient(params: {
  bearerToken?: unknown;
  clientId?: unknown;
  clientSecret?: unknown;
  organizationId?: unknown;
}): FormFlowClient {
  const { bearerToken, clientId, clientSecret, organizationId } = params;

  // Check if bearer token is provided
  if (bearerToken !== undefined) {
    const validToken = validateBearerToken(bearerToken);
    return new FormFlowClient(validToken);
  }

  // Check if credentials are provided
  if (clientId !== undefined || clientSecret !== undefined || organizationId !== undefined) {
    const validCredentials = validateCredentials({ clientId, clientSecret, organizationId });
    return new FormFlowClient(validCredentials);
  }

  throw new Error(
    'Either bearerToken or all three credentials (clientId, clientSecret, organizationId) must be provided'
  );
}