/**
 * List Audit Logs Tool
 * Gets paginated list of audit logs with filtering options
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../client";

export function registerListAuditLogsTool(server: McpServer) {
  server.tool(
    "ledger_list_audit_logs",
    "Get paginated list of audit logs for compliance monitoring and security tracking",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      eventType: z.array(z.string()).optional().describe("Filter by event types (e.g., ['login', 'policy_create', 'claim_approve'])"),
      userId: z.string().optional().describe("Filter by specific user ID"),
      entityType: z.enum(['policy', 'claim', 'quote', 'user', 'binder', 'endorsement']).optional().describe("Filter by entity type"),
      entityId: z.string().optional().describe("Filter by specific entity ID"),
      action: z.array(z.string()).optional().describe("Filter by actions (e.g., ['create', 'update', 'delete', 'approve'])"),
      severity: z.enum(['low', 'medium', 'high', 'critical']).optional().describe("Filter by severity level"),
      dateFrom: z.string().optional().describe("Filter by date from (ISO date)"),
      dateTo: z.string().optional().describe("Filter by date to (ISO date)"),
      ipAddress: z.string().optional().describe("Filter by IP address"),
      userAgent: z.string().optional().describe("Filter by user agent"),
      search: z.string().optional().describe("Search term for event description or details"),
      includeSystemEvents: z.boolean().optional().describe("Whether to include system-generated events"),
      includeFailedAttempts: z.boolean().optional().describe("Whether to include failed operation attempts"),
      page: z.number().optional().describe("Page number for pagination (default: 1)"),
      limit: z.number().optional().describe("Number of results per page (default: 50, max: 500)"),
      sortBy: z.enum(['timestamp', 'userId', 'eventType', 'severity']).optional().describe("Field to sort by"),
      sortOrder: z.enum(['asc', 'desc']).optional().describe("Sort order (default: desc)"),
    },
    async ({ 
      bearerToken, 
      tenantId, 
      eventType,
      userId,
      entityType,
      entityId,
      action,
      severity,
      dateFrom,
      dateTo,
      ipAddress,
      userAgent,
      search,
      includeSystemEvents,
      includeFailedAttempts,
      page,
      limit,
      sortBy,
      sortOrder 
    }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const queryParams = new URLSearchParams();
        if (eventType) eventType.forEach(type => queryParams.append('event_type[]', type));
        if (userId) queryParams.append('user_id', userId);
        if (entityType) queryParams.append('entity_type', entityType);
        if (entityId) queryParams.append('entity_id', entityId);
        if (action) action.forEach(act => queryParams.append('action[]', act));
        if (severity) queryParams.append('severity', severity);
        if (dateFrom) queryParams.append('date_from', dateFrom);
        if (dateTo) queryParams.append('date_to', dateTo);
        if (ipAddress) queryParams.append('ip_address', ipAddress);
        if (userAgent) queryParams.append('user_agent', userAgent);
        if (search) queryParams.append('search', search);
        if (includeSystemEvents) queryParams.append('include_system_events', 'true');
        if (includeFailedAttempts) queryParams.append('include_failed_attempts', 'true');
        if (page) queryParams.append('page', page.toString());
        if (limit) queryParams.append('limit', limit.toString());
        if (sortBy) queryParams.append('sort_by', sortBy);
        if (sortOrder) queryParams.append('sort_order', sortOrder);
        
        const response = await client.get(
          `/audit/logs?${queryParams.toString()}`
        );

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                auditLogs: response.data.map((log: any) => ({
                  id: log.id,
                  timestamp: log.timestamp,
                  eventType: log.eventType,
                  action: log.action,
                  userId: log.userId,
                  userName: log.userName,
                  entityType: log.entityType,
                  entityId: log.entityId,
                  entityDescription: log.entityDescription,
                  severity: log.severity,
                  description: log.description,
                  changes: log.changes,
                  oldValues: log.oldValues,
                  newValues: log.newValues,
                  ipAddress: log.ipAddress,
                  userAgent: log.userAgent,
                  sessionId: log.sessionId,
                  success: log.success,
                  errorMessage: log.errorMessage,
                  metadata: log.metadata
                })),
                pagination: {
                  currentPage: response.pagination.currentPage,
                  totalPages: response.pagination.totalPages,
                  totalItems: response.pagination.totalItems,
                  itemsPerPage: response.pagination.itemsPerPage,
                  hasNext: response.pagination.hasNext,
                  hasPrevious: response.pagination.hasPrevious
                },
                filters: {
                  eventType,
                  userId,
                  entityType,
                  entityId,
                  action,
                  severity,
                  dateFrom,
                  dateTo,
                  ipAddress,
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
                error: "Failed to retrieve audit logs",
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