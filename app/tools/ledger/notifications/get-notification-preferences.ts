/**
 * Get Notification Preferences Tool
 * Retrieves and manages user notification preferences
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../client";

export function registerGetNotificationPreferencesTool(server: McpServer) {
  server.tool(
    "ledger_get_notification_preferences",
    "Get and manage user notification preferences including channels, frequency, and content settings",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      action: z.enum(['get', 'update', 'reset']).describe("Action to perform on preferences"),
      userId: z.string().optional().describe("User ID to get preferences for (defaults to current user)"),
      preferenceUpdates: z.object({
        channels: z.object({
          email: z.object({
            enabled: z.boolean().optional(),
            address: z.string().optional(),
            frequency: z.enum(['immediate', 'hourly', 'daily', 'weekly']).optional(),
            quietHours: z.object({
              enabled: z.boolean().optional(),
              startTime: z.string().optional().describe("Start time in HH:MM format"),
              endTime: z.string().optional().describe("End time in HH:MM format"),
              timezone: z.string().optional()
            }).optional()
          }).optional(),
          sms: z.object({
            enabled: z.boolean().optional(),
            phoneNumber: z.string().optional(),
            frequency: z.enum(['immediate', 'urgent_only', 'daily_digest']).optional(),
            quietHours: z.object({
              enabled: z.boolean().optional(),
              startTime: z.string().optional(),
              endTime: z.string().optional()
            }).optional()
          }).optional(),
          push: z.object({
            enabled: z.boolean().optional(),
            devices: z.array(z.string()).optional().describe("Device tokens for push notifications"),
            frequency: z.enum(['immediate', 'hourly', 'daily']).optional(),
            showPreview: z.boolean().optional().describe("Show notification preview on lock screen")
          }).optional(),
          inApp: z.object({
            enabled: z.boolean().optional(),
            showDesktop: z.boolean().optional(),
            playSound: z.boolean().optional(),
            autoMarkRead: z.boolean().optional().describe("Auto-mark as read after viewing")
          }).optional()
        }).optional().describe("Channel-specific preferences"),
        notificationTypes: z.object({
          policy_renewal: z.object({
            enabled: z.boolean().optional(),
            channels: z.array(z.string()).optional(),
            advanceNotice: z.number().optional().describe("Days before renewal to notify")
          }).optional(),
          claim_update: z.object({
            enabled: z.boolean().optional(),
            channels: z.array(z.string()).optional(),
            includeDetails: z.boolean().optional()
          }).optional(),
          payment_due: z.object({
            enabled: z.boolean().optional(),
            channels: z.array(z.string()).optional(),
            reminderFrequency: z.enum(['once', 'daily', 'weekly']).optional()
          }).optional(),
          approval_required: z.object({
            enabled: z.boolean().optional(),
            channels: z.array(z.string()).optional(),
            escalationTime: z.number().optional().describe("Hours before escalation")
          }).optional(),
          system_alert: z.object({
            enabled: z.boolean().optional(),
            channels: z.array(z.string()).optional(),
            severityThreshold: z.enum(['low', 'medium', 'high', 'critical']).optional()
          }).optional(),
          compliance_reminder: z.object({
            enabled: z.boolean().optional(),
            channels: z.array(z.string()).optional(),
            leadTime: z.number().optional().describe("Days before deadline to notify")
          }).optional(),
          deadline_approaching: z.object({
            enabled: z.boolean().optional(),
            channels: z.array(z.string()).optional(),
            thresholds: z.array(z.number()).optional().describe("Days before deadline to send reminders")
          }).optional(),
          document_required: z.object({
            enabled: z.boolean().optional(),
            channels: z.array(z.string()).optional(),
            followUpFrequency: z.enum(['daily', 'weekly', 'biweekly']).optional()
          }).optional(),
          quote_expiring: z.object({
            enabled: z.boolean().optional(),
            channels: z.array(z.string()).optional(),
            warningPeriod: z.number().optional().describe("Days before expiration to warn")
          }).optional()
        }).optional().describe("Notification type preferences"),
        general: z.object({
          language: z.string().optional().describe("Preferred language for notifications"),
          timezone: z.string().optional().describe("User timezone"),
          digestFrequency: z.enum(['none', 'daily', 'weekly']).optional().describe("Frequency for digest emails"),
          digestTime: z.string().optional().describe("Time to send digest (HH:MM format)"),
          unsubscribeAll: z.boolean().optional().describe("Unsubscribe from all non-essential notifications"),
          marketingOptIn: z.boolean().optional().describe("Opt-in for marketing communications"),
          thirdPartySharing: z.boolean().optional().describe("Allow sharing with third parties"),
          dataProcessingConsent: z.boolean().optional().describe("Consent for data processing")
        }).optional().describe("General preferences"),
        filters: z.object({
          entityTypes: z.array(z.string()).optional().describe("Only notify for specific entity types"),
          priorities: z.array(z.string()).optional().describe("Only notify for specific priorities"),
          excludeKeywords: z.array(z.string()).optional().describe("Keywords to exclude from notifications"),
          includeKeywords: z.array(z.string()).optional().describe("Keywords that must be present"),
          senderWhitelist: z.array(z.string()).optional().describe("Approved senders"),
          senderBlacklist: z.array(z.string()).optional().describe("Blocked senders")
        }).optional().describe("Notification filters")
      }).optional().describe("Preference updates (required for update action)"),
    },
    async ({ bearerToken, tenantId, action, userId, preferenceUpdates }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        let endpoint = `/notifications/preferences`;
        if (userId) {
          endpoint += `/${userId}`;
        }
        
        let response;
        switch (action) {
          case 'get':
            response = await client.get(endpoint);
            break;
          case 'update':
            response = await client.put(endpoint, preferenceUpdates);
            break;
          case 'reset':
            response = await client.post(`${endpoint}/reset`, {});
            break;
        }

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                preferences: {
                  userId: response.userId,
                  lastUpdated: response.lastUpdated,
                  channels: {
                    email: {
                      enabled: response.channels.email.enabled,
                      address: response.channels.email.address,
                      verified: response.channels.email.verified,
                      frequency: response.channels.email.frequency,
                      quietHours: response.channels.email.quietHours
                    },
                    sms: {
                      enabled: response.channels.sms.enabled,
                      phoneNumber: response.channels.sms.phoneNumber,
                      verified: response.channels.sms.verified,
                      frequency: response.channels.sms.frequency,
                      quietHours: response.channels.sms.quietHours
                    },
                    push: {
                      enabled: response.channels.push.enabled,
                      deviceCount: response.channels.push.deviceCount,
                      frequency: response.channels.push.frequency,
                      showPreview: response.channels.push.showPreview
                    },
                    inApp: {
                      enabled: response.channels.inApp.enabled,
                      showDesktop: response.channels.inApp.showDesktop,
                      playSound: response.channels.inApp.playSound,
                      autoMarkRead: response.channels.inApp.autoMarkRead
                    }
                  },
                  notificationTypes: response.notificationTypes,
                  general: {
                    language: response.general.language,
                    timezone: response.general.timezone,
                    digestFrequency: response.general.digestFrequency,
                    digestTime: response.general.digestTime,
                    unsubscribeAll: response.general.unsubscribeAll,
                    marketingOptIn: response.general.marketingOptIn,
                    thirdPartySharing: response.general.thirdPartySharing,
                    dataProcessingConsent: response.general.dataProcessingConsent
                  },
                  filters: response.filters,
                  statistics: {
                    totalNotificationsReceived: response.statistics.totalNotificationsReceived,
                    notificationsThisMonth: response.statistics.notificationsThisMonth,
                    averagePerDay: response.statistics.averagePerDay,
                    mostActiveChannel: response.statistics.mostActiveChannel,
                    openRate: response.statistics.openRate
                  },
                  complianceStatus: {
                    gdprCompliant: response.complianceStatus.gdprCompliant,
                    canSpamCompliant: response.complianceStatus.canSpamCompliant,
                    consentRecorded: response.complianceStatus.consentRecorded,
                    consentDate: response.complianceStatus.consentDate
                  }
                },
                message: `Notification preferences ${action}d successfully`
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
                error: `Failed to ${action} notification preferences`,
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