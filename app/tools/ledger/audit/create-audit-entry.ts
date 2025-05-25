/**
 * Create Audit Entry Tool
 * Creates a manual audit entry for compliance tracking
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../client";

export function registerCreateAuditEntryTool(server: McpServer) {
  server.tool(
    "ledger_create_audit_entry",
    "Create a manual audit entry for compliance tracking and regulatory documentation",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      auditData: z.object({
        eventType: z.string().describe("Type of event being audited"),
        action: z.string().describe("Action that was performed"),
        entityType: z.enum(['policy', 'claim', 'quote', 'user', 'binder', 'endorsement', 'system', 'other']).describe("Type of entity involved"),
        entityId: z.string().optional().describe("ID of the entity if applicable"),
        entityDescription: z.string().optional().describe("Description of the entity"),
        description: z.string().describe("Detailed description of what occurred"),
        severity: z.enum(['low', 'medium', 'high', 'critical']).describe("Severity level of the event"),
        userId: z.string().optional().describe("User ID who performed the action (if different from current user)"),
        reason: z.string().describe("Reason for creating this audit entry"),
        complianceCategory: z.enum(['regulatory', 'internal_policy', 'security', 'data_protection', 'financial', 'operational']).describe("Compliance category"),
        regulatoryReference: z.string().optional().describe("Reference to specific regulation or policy"),
        changes: z.object({
          field: z.string(),
          oldValue: z.any().optional(),
          newValue: z.any().optional()
        }).array().optional().describe("Specific changes made"),
        affectedParties: z.array(z.object({
          type: z.string().describe("Type of affected party (e.g., 'customer', 'broker', 'underwriter')"),
          id: z.string().optional(),
          name: z.string().optional()
        })).optional().describe("Parties affected by this event"),
        businessImpact: z.enum(['none', 'low', 'medium', 'high']).optional().describe("Business impact assessment"),
        riskLevel: z.enum(['none', 'low', 'medium', 'high']).optional().describe("Risk level associated with event"),
        followUpRequired: z.boolean().optional().describe("Whether follow-up action is required"),
        followUpDate: z.string().optional().describe("Date when follow-up is needed (ISO date)"),
        evidence: z.array(z.object({
          type: z.string().describe("Type of evidence (e.g., 'document', 'screenshot', 'email')"),
          description: z.string(),
          location: z.string().optional()
        })).optional().describe("Evidence supporting this audit entry"),
        reviewedBy: z.string().optional().describe("User ID of reviewer if entry was reviewed"),
        reviewDate: z.string().optional().describe("Date of review (ISO date)"),
        tags: z.array(z.string()).optional().describe("Tags for categorization"),
        customFields: z.record(z.any()).optional().describe("Custom fields for specific compliance requirements")
      }).describe("Audit entry data"),
    },
    async ({ bearerToken, tenantId, auditData }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const response = await client.post(
          `/audit/entries`,
          auditData,
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
                auditEntry: {
                  id: response.id,
                  auditNumber: response.auditNumber,
                  timestamp: response.timestamp,
                  eventType: response.eventType,
                  action: response.action,
                  entityType: response.entityType,
                  entityId: response.entityId,
                  description: response.description,
                  severity: response.severity,
                  complianceCategory: response.complianceCategory,
                  createdBy: response.createdBy,
                  createdByName: response.createdByName,
                  userId: response.userId,
                  reason: response.reason,
                  businessImpact: response.businessImpact,
                  riskLevel: response.riskLevel,
                  followUpRequired: response.followUpRequired,
                  followUpDate: response.followUpDate,
                  status: response.status,
                  reviewStatus: response.reviewStatus
                },
                message: "Audit entry created successfully"
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
                error: "Failed to create audit entry",
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