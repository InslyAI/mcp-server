/**
 * Send Notification Tool
 * Sends notifications via various channels (email, SMS, push, etc.)
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../client";

export function registerSendNotificationTool(server: McpServer) {
  server.tool(
    "ledger_send_notification",
    "Send notifications via multiple channels including email, SMS, push notifications, and in-app alerts",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      notificationData: z.object({
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
          'custom'
        ]).describe("Type of notification"),
        priority: z.enum(['low', 'normal', 'high', 'urgent', 'critical']).describe("Notification priority level"),
        channels: z.array(z.enum(['email', 'sms', 'push', 'in_app', 'webhook', 'slack', 'teams'])).describe("Delivery channels to use"),
        recipients: z.array(z.object({
          type: z.enum(['user', 'role', 'department', 'external', 'group']).describe("Type of recipient"),
          identifier: z.string().describe("User ID, email, phone, or role name"),
          name: z.string().optional().describe("Display name"),
          preferences: z.object({
            channels: z.array(z.string()).optional().describe("Preferred channels for this recipient"),
            timezone: z.string().optional().describe("Recipient timezone"),
            language: z.string().optional().describe("Preferred language")
          }).optional()
        })).describe("List of notification recipients"),
        content: z.object({
          subject: z.string().describe("Notification subject/title"),
          message: z.string().describe("Main notification message"),
          shortMessage: z.string().optional().describe("Short version for SMS/push"),
          htmlContent: z.string().optional().describe("HTML formatted content for email"),
          templateId: z.string().optional().describe("Template ID to use instead of custom content"),
          templateVariables: z.record(z.any()).optional().describe("Variables to populate in template"),
          attachments: z.array(z.object({
            filename: z.string(),
            contentType: z.string(),
            content: z.string().describe("Base64 encoded content"),
            size: z.number()
          })).optional().describe("File attachments")
        }).describe("Notification content"),
        contextData: z.object({
          entityType: z.string().optional().describe("Related entity type"),
          entityId: z.string().optional().describe("Related entity ID"),
          policyId: z.string().optional().describe("Related policy ID"),
          claimId: z.string().optional().describe("Related claim ID"),
          quoteId: z.string().optional().describe("Related quote ID"),
          workflowId: z.string().optional().describe("Related workflow ID"),
          customData: z.record(z.any()).optional().describe("Custom context data")
        }).optional().describe("Context information for the notification"),
        scheduling: z.object({
          sendImmediately: z.boolean().optional().describe("Send immediately (default: true)"),
          scheduledFor: z.string().optional().describe("Scheduled send time (ISO date)"),
          timezone: z.string().optional().describe("Timezone for scheduling"),
          recurrence: z.object({
            pattern: z.enum(['daily', 'weekly', 'monthly', 'custom']).describe("Recurrence pattern"),
            interval: z.number().optional().describe("Interval for custom recurrence"),
            endDate: z.string().optional().describe("End date for recurrence")
          }).optional().describe("Recurrence configuration")
        }).optional().describe("Scheduling options"),
        deliveryOptions: z.object({
          retryAttempts: z.number().optional().describe("Number of retry attempts for failed deliveries"),
          retryInterval: z.number().optional().describe("Interval between retries in minutes"),
          batchSize: z.number().optional().describe("Batch size for bulk sending"),
          rateLimitPerMinute: z.number().optional().describe("Rate limit for sending"),
          trackOpens: z.boolean().optional().describe("Track email opens"),
          trackClicks: z.boolean().optional().describe("Track link clicks"),
          requireConfirmation: z.boolean().optional().describe("Require delivery confirmation")
        }).optional().describe("Delivery configuration"),
        complianceSettings: z.object({
          gdprCompliant: z.boolean().optional().describe("Ensure GDPR compliance"),
          canSpamCompliant: z.boolean().optional().describe("Ensure CAN-SPAM compliance"),
          unsubscribeLink: z.boolean().optional().describe("Include unsubscribe link"),
          privacyNotice: z.boolean().optional().describe("Include privacy notice"),
          auditTrail: z.boolean().optional().describe("Create audit trail entry")
        }).optional().describe("Compliance settings")
      }).describe("Notification configuration and content"),
    },
    async ({ bearerToken, tenantId, notificationData }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const response = await client.post(
          `/notifications/send`,
          notificationData,
          {
            "Accept-Language": "en"
          }
        );

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                notification: {
                  id: response.id,
                  type: response.type,
                  priority: response.priority,
                  status: response.status,
                  createdAt: response.createdAt,
                  scheduledFor: response.scheduledFor,
                  sentAt: response.sentAt,
                  channels: response.channels,
                  recipients: response.recipients,
                  deliveryStatus: {
                    total: response.deliveryStatus.total,
                    sent: response.deliveryStatus.sent,
                    delivered: response.deliveryStatus.delivered,
                    failed: response.deliveryStatus.failed,
                    pending: response.deliveryStatus.pending
                  },
                  channelResults: response.channelResults.map((result: any) => ({
                    channel: result.channel,
                    status: result.status,
                    deliveredCount: result.deliveredCount,
                    failedCount: result.failedCount,
                    errors: result.errors
                  })),
                  trackingId: response.trackingId,
                  batchId: response.batchId,
                  estimatedDeliveryTime: response.estimatedDeliveryTime,
                  complianceStatus: response.complianceStatus
                },
                message: "Notification sent successfully"
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
                error: "Failed to send notification",
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