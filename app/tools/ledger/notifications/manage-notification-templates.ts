/**
 * Manage Notification Templates Tool
 * Creates, updates, and manages notification templates
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../client";

export function registerManageNotificationTemplatesTool(server: McpServer) {
  server.tool(
    "ledger_manage_notification_templates",
    "Create, update, and manage notification templates for standardized communications",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      action: z.enum(['create', 'update', 'delete', 'clone', 'activate', 'deactivate']).describe("Action to perform on the template"),
      templateData: z.object({
        id: z.string().optional().describe("Template ID (required for update, delete, clone actions)"),
        name: z.string().optional().describe("Template name"),
        description: z.string().optional().describe("Template description"),
        category: z.enum([
          'policy_management',
          'claims_processing',
          'underwriting',
          'billing_payments',
          'compliance',
          'system_alerts',
          'marketing',
          'customer_service',
          'internal_communications'
        ]).optional().describe("Template category"),
        type: z.enum([
          'policy_renewal',
          'claim_update',
          'payment_due',
          'approval_required',
          'system_alert',
          'compliance_reminder',
          'deadline_approaching',
          'document_required',
          'quote_expiring',
          'welcome',
          'custom'
        ]).optional().describe("Notification type this template is for"),
        channels: z.array(z.enum(['email', 'sms', 'push', 'in_app', 'webhook'])).optional().describe("Supported delivery channels"),
        content: z.object({
          subject: z.string().optional().describe("Email subject template"),
          emailHtml: z.string().optional().describe("HTML email template"),
          emailText: z.string().optional().describe("Plain text email template"),
          smsMessage: z.string().optional().describe("SMS message template"),
          pushTitle: z.string().optional().describe("Push notification title"),
          pushMessage: z.string().optional().describe("Push notification message"),
          inAppTitle: z.string().optional().describe("In-app notification title"),
          inAppMessage: z.string().optional().describe("In-app notification message"),
          webhookPayload: z.string().optional().describe("Webhook payload template (JSON)")
        }).optional().describe("Template content for different channels"),
        variables: z.array(z.object({
          name: z.string().describe("Variable name (e.g., 'policyNumber', 'claimAmount')"),
          type: z.enum(['string', 'number', 'date', 'currency', 'boolean']).describe("Variable data type"),
          required: z.boolean().describe("Whether variable is required"),
          defaultValue: z.any().optional().describe("Default value if not provided"),
          description: z.string().optional().describe("Variable description"),
          validation: z.object({
            pattern: z.string().optional().describe("Regex pattern for validation"),
            minLength: z.number().optional(),
            maxLength: z.number().optional(),
            min: z.number().optional(),
            max: z.number().optional()
          }).optional().describe("Variable validation rules")
        })).optional().describe("Template variables"),
        styling: z.object({
          theme: z.enum(['default', 'corporate', 'modern', 'minimal', 'custom']).optional().describe("Template theme"),
          primaryColor: z.string().optional().describe("Primary brand color"),
          secondaryColor: z.string().optional().describe("Secondary brand color"),
          font: z.string().optional().describe("Font family"),
          logo: z.object({
            url: z.string(),
            width: z.number().optional(),
            height: z.number().optional()
          }).optional().describe("Logo configuration"),
          customCss: z.string().optional().describe("Custom CSS styles")
        }).optional().describe("Template styling configuration"),
        triggers: z.array(z.object({
          event: z.string().describe("Event that triggers this template"),
          conditions: z.array(z.object({
            field: z.string(),
            operator: z.enum(['equals', 'not_equals', 'contains', 'greater_than', 'less_than']),
            value: z.any()
          })).optional().describe("Conditions for triggering")
        })).optional().describe("Automatic trigger configuration"),
        localization: z.array(z.object({
          language: z.string().describe("Language code (e.g., 'en', 'es', 'fr')"),
          content: z.object({
            subject: z.string().optional(),
            emailHtml: z.string().optional(),
            emailText: z.string().optional(),
            smsMessage: z.string().optional(),
            pushTitle: z.string().optional(),
            pushMessage: z.string().optional()
          }).describe("Localized content")
        })).optional().describe("Multi-language support"),
        settings: z.object({
          active: z.boolean().optional().describe("Whether template is active"),
          priority: z.enum(['low', 'normal', 'high']).optional().describe("Template priority"),
          retryAttempts: z.number().optional().describe("Default retry attempts"),
          trackingEnabled: z.boolean().optional().describe("Enable engagement tracking"),
          complianceChecks: z.array(z.string()).optional().describe("Compliance checks to perform"),
          approvalRequired: z.boolean().optional().describe("Whether template requires approval"),
          validFrom: z.string().optional().describe("Valid from date (ISO date)"),
          validTo: z.string().optional().describe("Valid to date (ISO date)")
        }).optional().describe("Template settings"),
        testData: z.record(z.any()).optional().describe("Test data for template preview")
      }).describe("Template data for the specified action"),
    },
    async ({ bearerToken, tenantId, action, templateData }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        let endpoint = `/notifications/templates`;
        let method = 'POST';
        
        switch (action) {
          case 'update':
            endpoint = `/notifications/templates/${templateData.id}`;
            method = 'PUT';
            break;
          case 'delete':
            endpoint = `/notifications/templates/${templateData.id}`;
            method = 'DELETE';
            break;
          case 'clone':
            endpoint = `/notifications/templates/${templateData.id}/clone`;
            method = 'POST';
            break;
          case 'activate':
          case 'deactivate':
            endpoint = `/notifications/templates/${templateData.id}/${action}`;
            method = 'PATCH';
            break;
        }
        
        const payload = {
          action,
          ...templateData
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
                template: {
                  id: response.id,
                  name: response.name,
                  description: response.description,
                  category: response.category,
                  type: response.type,
                  channels: response.channels,
                  active: response.active,
                  version: response.version,
                  createdAt: response.createdAt,
                  updatedAt: response.updatedAt,
                  createdBy: response.createdBy,
                  updatedBy: response.updatedBy,
                  variables: response.variables,
                  localization: response.localization,
                  usageCount: response.usageCount,
                  lastUsed: response.lastUsed,
                  approvalStatus: response.approvalStatus,
                  previewUrl: response.previewUrl,
                  ...(action === 'clone' && { 
                    originalId: response.originalId,
                    clonedAt: response.clonedAt 
                  })
                },
                message: `Template ${action}d successfully`
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
                error: `Failed to ${action} notification template`,
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