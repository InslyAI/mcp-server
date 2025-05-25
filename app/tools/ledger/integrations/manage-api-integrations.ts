/**
 * Manage API Integrations Tool
 * Manages external API integrations and connections
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../client";

export function registerManageApiIntegrationsTool(server: McpServer) {
  server.tool(
    "ledger_manage_api_integrations",
    "Create, configure, and manage external API integrations for third-party services and data sources",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      action: z.enum(['create', 'update', 'delete', 'test', 'activate', 'deactivate', 'regenerate_keys']).describe("Action to perform on the integration"),
      integrationData: z.object({
        id: z.string().optional().describe("Integration ID (required for update, delete, test actions)"),
        name: z.string().optional().describe("Integration name"),
        description: z.string().optional().describe("Integration description"),
        provider: z.enum([
          'salesforce',
          'microsoft_dynamics',
          'sage',
          'quickbooks',
          'stripe',
          'paypal',
          'docusign',
          'mailchimp',
          'twilio',
          'slack',
          'teams',
          'zapier',
          'aws',
          'azure',
          'gcp',
          'custom'
        ]).optional().describe("Integration provider/platform"),
        type: z.enum(['crm', 'accounting', 'payment', 'document', 'communication', 'analytics', 'storage', 'workflow', 'custom']).describe("Integration type"),
        configuration: z.object({
          baseUrl: z.string().optional().describe("Base URL for the API"),
          version: z.string().optional().describe("API version"),
          authentication: z.object({
            type: z.enum(['api_key', 'oauth2', 'basic_auth', 'bearer_token', 'custom']).describe("Authentication type"),
            apiKey: z.string().optional().describe("API key (if using api_key auth)"),
            username: z.string().optional().describe("Username (if using basic_auth)"),
            password: z.string().optional().describe("Password (if using basic_auth)"),
            clientId: z.string().optional().describe("Client ID (if using oauth2)"),
            clientSecret: z.string().optional().describe("Client secret (if using oauth2)"),
            scope: z.array(z.string()).optional().describe("OAuth2 scopes"),
            redirectUri: z.string().optional().describe("OAuth2 redirect URI"),
            tokenEndpoint: z.string().optional().describe("OAuth2 token endpoint"),
            refreshToken: z.string().optional().describe("OAuth2 refresh token"),
            customHeaders: z.record(z.string()).optional().describe("Custom authentication headers")
          }).describe("Authentication configuration"),
          endpoints: z.array(z.object({
            name: z.string().describe("Endpoint name"),
            path: z.string().describe("Endpoint path"),
            method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']).describe("HTTP method"),
            description: z.string().optional().describe("Endpoint description"),
            rateLimits: z.object({
              requestsPerSecond: z.number().optional(),
              requestsPerMinute: z.number().optional(),
              requestsPerHour: z.number().optional(),
              requestsPerDay: z.number().optional()
            }).optional()
          })).optional().describe("Available endpoints"),
          retryPolicy: z.object({
            maxRetries: z.number().optional().describe("Maximum retry attempts"),
            backoffStrategy: z.enum(['linear', 'exponential', 'fixed']).optional(),
            baseDelay: z.number().optional().describe("Base delay in milliseconds"),
            maxDelay: z.number().optional().describe("Maximum delay in milliseconds")
          }).optional(),
          timeout: z.number().optional().describe("Request timeout in milliseconds"),
          rateLimit: z.object({
            enabled: z.boolean().optional(),
            requestsPerMinute: z.number().optional(),
            burstLimit: z.number().optional()
          }).optional()
        }).describe("Integration configuration"),
        dataMapping: z.object({
          inbound: z.array(z.object({
            sourceField: z.string().describe("Source field from external API"),
            targetField: z.string().describe("Target field in Ledger system"),
            transformation: z.string().optional().describe("Data transformation rules"),
            required: z.boolean().optional().describe("Whether field is required")
          })).optional().describe("Inbound data mapping"),
          outbound: z.array(z.object({
            sourceField: z.string().describe("Source field from Ledger system"),
            targetField: z.string().describe("Target field in external API"),
            transformation: z.string().optional().describe("Data transformation rules"),
            required: z.boolean().optional().describe("Whether field is required")
          })).optional().describe("Outbound data mapping")
        }).optional().describe("Data field mapping configuration"),
        sync: z.object({
          enabled: z.boolean().optional().describe("Enable automatic synchronization"),
          direction: z.enum(['bidirectional', 'inbound_only', 'outbound_only']).optional(),
          frequency: z.enum(['real_time', 'hourly', 'daily', 'weekly', 'manual']).optional(),
          batchSize: z.number().optional().describe("Number of records to sync per batch"),
          conflictResolution: z.enum(['ledger_wins', 'external_wins', 'manual_review', 'merge']).optional(),
          lastSyncTime: z.string().optional().describe("Last synchronization timestamp")
        }).optional().describe("Synchronization settings"),
        monitoring: z.object({
          healthCheck: z.object({
            enabled: z.boolean().optional(),
            interval: z.number().optional().describe("Health check interval in minutes"),
            endpoint: z.string().optional().describe("Health check endpoint")
          }).optional(),
          alerts: z.object({
            onFailure: z.boolean().optional(),
            onSlowResponse: z.boolean().optional(),
            slowResponseThreshold: z.number().optional().describe("Slow response threshold in milliseconds"),
            recipients: z.array(z.string()).optional().describe("Alert recipients")
          }).optional(),
          logging: z.object({
            enabled: z.boolean().optional(),
            logLevel: z.enum(['error', 'warn', 'info', 'debug']).optional(),
            logRequests: z.boolean().optional(),
            logResponses: z.boolean().optional(),
            retentionDays: z.number().optional()
          }).optional()
        }).optional().describe("Monitoring configuration"),
        security: z.object({
          allowedIPs: z.array(z.string()).optional().describe("Allowed IP addresses"),
          encryptData: z.boolean().optional().describe("Encrypt data in transit"),
          validateSSL: z.boolean().optional().describe("Validate SSL certificates"),
          dataRetention: z.number().optional().describe("Data retention period in days"),
          auditTrail: z.boolean().optional().describe("Enable audit trail")
        }).optional().describe("Security settings"),
        active: z.boolean().optional().describe("Whether integration is active"),
        tags: z.array(z.string()).optional().describe("Tags for categorization")
      }).describe("Integration configuration data"),
    },
    async ({ bearerToken, tenantId, action, integrationData }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        let endpoint = `/integrations/api`;
        let method = 'POST';
        
        switch (action) {
          case 'update':
            endpoint = `/integrations/api/${integrationData.id}`;
            method = 'PUT';
            break;
          case 'delete':
            endpoint = `/integrations/api/${integrationData.id}`;
            method = 'DELETE';
            break;
          case 'test':
            endpoint = `/integrations/api/${integrationData.id}/test`;
            method = 'POST';
            break;
          case 'activate':
          case 'deactivate':
            endpoint = `/integrations/api/${integrationData.id}/${action}`;
            method = 'PATCH';
            break;
          case 'regenerate_keys':
            endpoint = `/integrations/api/${integrationData.id}/regenerate-keys`;
            method = 'POST';
            break;
        }
        
        const payload = {
          action,
          ...integrationData
        };
        
        const response = await (method === 'PUT' ? client.put(endpoint, payload) :
                              method === 'DELETE' ? client.delete(endpoint, payload) :
                              method === 'PATCH' ? client.patch(endpoint, payload) :
                              client.post(endpoint, payload));

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                integration: {
                  id: response.id,
                  name: response.name,
                  description: response.description,
                  provider: response.provider,
                  type: response.type,
                  status: response.status,
                  active: response.active,
                  version: response.version,
                  createdAt: response.createdAt,
                  updatedAt: response.updatedAt,
                  lastTestedAt: response.lastTestedAt,
                  lastSyncAt: response.lastSyncAt,
                  healthStatus: response.healthStatus,
                  connectionStatus: response.connectionStatus,
                  configuration: {
                    baseUrl: response.configuration.baseUrl,
                    version: response.configuration.version,
                    endpointCount: response.configuration.endpointCount,
                    hasAuthentication: response.configuration.hasAuthentication,
                    rateLimitEnabled: response.configuration.rateLimitEnabled
                  },
                  statistics: {
                    totalRequests: response.statistics.totalRequests,
                    successfulRequests: response.statistics.successfulRequests,
                    failedRequests: response.statistics.failedRequests,
                    averageResponseTime: response.statistics.averageResponseTime,
                    lastRequestAt: response.statistics.lastRequestAt
                  },
                  ...(action === 'test' && {
                    testResults: {
                      success: response.testResults.success,
                      responseTime: response.testResults.responseTime,
                      statusCode: response.testResults.statusCode,
                      message: response.testResults.message,
                      testedEndpoints: response.testResults.testedEndpoints
                    }
                  }),
                  ...(action === 'regenerate_keys' && {
                    newCredentials: {
                      apiKey: response.newCredentials.apiKey,
                      clientId: response.newCredentials.clientId,
                      regeneratedAt: response.newCredentials.regeneratedAt
                    }
                  })
                },
                message: `API integration ${action}d successfully`
              }, null, 2)
            }
          ]
        };
      } catch (error: any) {
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: false,
                error: `Failed to ${action} API integration`,
                details: error.message,
                statusCode: error.status
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}