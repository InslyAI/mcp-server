/**
 * List Notifications Tool
 * Gets paginated list of sent notifications with filtering options
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../client";

export function registerListNotificationsTool(server: McpServer) {
  server.tool(
    "ledger_list_notifications",
    "Get paginated list of sent notifications with comprehensive filtering and delivery tracking",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
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
      ]).optional().describe("Filter by notification type"),
      status: z.enum(['pending', 'sent', 'delivered', 'failed', 'cancelled']).optional().describe("Filter by delivery status"),
      priority: z.enum(['low', 'normal', 'high', 'urgent', 'critical']).optional().describe("Filter by priority level"),
      channel: z.enum(['email', 'sms', 'push', 'in_app', 'webhook', 'slack', 'teams']).optional().describe("Filter by delivery channel"),
      recipientId: z.string().optional().describe("Filter by specific recipient user ID"),
      recipientEmail: z.string().optional().describe("Filter by recipient email address"),
      sentFrom: z.string().optional().describe("Filter by sent date from (ISO date)"),
      sentTo: z.string().optional().describe("Filter by sent date to (ISO date)"),
      entityType: z.string().optional().describe("Filter by related entity type"),
      entityId: z.string().optional().describe("Filter by related entity ID"),
      templateId: z.string().optional().describe("Filter by template used"),
      batchId: z.string().optional().describe("Filter by batch ID"),
      search: z.string().optional().describe("Search term for subject or message content"),
      includeContent: z.boolean().optional().describe("Whether to include notification content"),
      includeDeliveryDetails: z.boolean().optional().describe("Whether to include detailed delivery information"),
      includeMetrics: z.boolean().optional().describe("Whether to include engagement metrics"),
      page: z.number().optional().describe("Page number for pagination (default: 1)"),
      limit: z.number().optional().describe("Number of results per page (default: 20, max: 100)"),
      sortBy: z.enum(['createdAt', 'sentAt', 'priority', 'status', 'type']).optional().describe("Field to sort by"),
      sortOrder: z.enum(['asc', 'desc']).optional().describe("Sort order (default: desc)"),
    },
    async ({ 
      bearerToken, 
      tenantId, 
      type,
      status,
      priority,
      channel,
      recipientId,
      recipientEmail,
      sentFrom,
      sentTo,
      entityType,
      entityId,
      templateId,
      batchId,
      search,
      includeContent,
      includeDeliveryDetails,
      includeMetrics,
      page,
      limit,
      sortBy,
      sortOrder 
    }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const queryParams = new URLSearchParams();
        if (type) queryParams.append('type', type);
        if (status) queryParams.append('status', status);
        if (priority) queryParams.append('priority', priority);
        if (channel) queryParams.append('channel', channel);
        if (recipientId) queryParams.append('recipient_id', recipientId);
        if (recipientEmail) queryParams.append('recipient_email', recipientEmail);
        if (sentFrom) queryParams.append('sent_from', sentFrom);
        if (sentTo) queryParams.append('sent_to', sentTo);
        if (entityType) queryParams.append('entity_type', entityType);
        if (entityId) queryParams.append('entity_id', entityId);
        if (templateId) queryParams.append('template_id', templateId);
        if (batchId) queryParams.append('batch_id', batchId);
        if (search) queryParams.append('search', search);
        if (includeContent) queryParams.append('include_content', 'true');
        if (includeDeliveryDetails) queryParams.append('include_delivery_details', 'true');
        if (includeMetrics) queryParams.append('include_metrics', 'true');
        if (page) queryParams.append('page', page.toString());
        if (limit) queryParams.append('limit', limit.toString());
        if (sortBy) queryParams.append('sort_by', sortBy);
        if (sortOrder) queryParams.append('sort_order', sortOrder);
        
        const response = await client.get(
          `/notifications?${queryParams.toString()}`
        );

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                notifications: response.data.map((notification: any) => ({
                  id: notification.id,
                  type: notification.type,
                  priority: notification.priority,
                  status: notification.status,
                  subject: notification.subject,
                  channels: notification.channels,
                  recipientCount: notification.recipientCount,
                  createdAt: notification.createdAt,
                  sentAt: notification.sentAt,
                  scheduledFor: notification.scheduledFor,
                  createdBy: notification.createdBy,
                  createdByName: notification.createdByName,
                  entityType: notification.entityType,
                  entityId: notification.entityId,
                  templateId: notification.templateId,
                  batchId: notification.batchId,
                  deliveryStatus: {
                    total: notification.deliveryStatus.total,
                    sent: notification.deliveryStatus.sent,
                    delivered: notification.deliveryStatus.delivered,
                    failed: notification.deliveryStatus.failed,
                    pending: notification.deliveryStatus.pending
                  },
                  ...(includeContent && { 
                    content: notification.content 
                  }),
                  ...(includeDeliveryDetails && { 
                    deliveryDetails: notification.deliveryDetails 
                  }),
                  ...(includeMetrics && { 
                    metrics: {
                      openRate: notification.metrics.openRate,
                      clickRate: notification.metrics.clickRate,
                      bounceRate: notification.metrics.bounceRate,
                      unsubscribeRate: notification.metrics.unsubscribeRate
                    }
                  })
                })),
                pagination: {
                  currentPage: response.pagination.currentPage,
                  totalPages: response.pagination.totalPages,
                  totalItems: response.pagination.totalItems,
                  itemsPerPage: response.pagination.itemsPerPage,
                  hasNext: response.pagination.hasNext,
                  hasPrevious: response.pagination.hasPrevious
                },
                summary: {
                  totalNotifications: response.summary.totalNotifications,
                  totalRecipients: response.summary.totalRecipients,
                  deliveryRate: response.summary.deliveryRate,
                  averageDeliveryTime: response.summary.averageDeliveryTime,
                  mostUsedChannel: response.summary.mostUsedChannel,
                  mostCommonType: response.summary.mostCommonType
                },
                filters: {
                  type,
                  status,
                  priority,
                  channel,
                  recipientId,
                  recipientEmail,
                  sentFrom,
                  sentTo,
                  entityType,
                  entityId,
                  templateId,
                  batchId,
                  search
                }
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
                error: "Failed to retrieve notifications",
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