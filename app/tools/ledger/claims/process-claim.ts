/**
 * Process Claim Tool
 * Processes claim actions like approval, denial, or payment authorization
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../client";

export function registerProcessClaimTool(server: McpServer) {
  server.tool(
    "ledger_process_claim",
    "Process claim actions including approval, denial, payment authorization, and settlement",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      claimId: z.string().describe("ID of the claim to process"),
      action: z.enum([
        'approve',
        'deny',
        'authorize_payment',
        'settle',
        'close',
        'reopen',
        'request_investigation',
        'escalate',
        'require_documentation'
      ]).describe("Action to take on the claim"),
      actionDetails: z.object({
        approvalDetails: z.object({
          approvedAmount: z.number().describe("Amount approved for payment"),
          approvalReason: z.string().describe("Reason for approval"),
          conditions: z.array(z.string()).optional().describe("Conditions attached to approval"),
          approvedBy: z.string().describe("User ID of approver"),
          approvalDate: z.string().optional().describe("Approval date (ISO date, defaults to current)")
        }).optional().describe("Details for approval action"),
        denialDetails: z.object({
          denialReason: z.string().describe("Primary reason for denial"),
          denialCode: z.string().optional().describe("Insurance denial code"),
          detailedExplanation: z.string().describe("Detailed explanation for policyholder"),
          appealProcess: z.string().optional().describe("Information about appeal process"),
          deniedBy: z.string().describe("User ID of denier"),
          denialDate: z.string().optional().describe("Denial date (ISO date, defaults to current)")
        }).optional().describe("Details for denial action"),
        paymentDetails: z.object({
          paymentAmount: z.number().describe("Amount to be paid"),
          paymentMethod: z.enum(['check', 'bank_transfer', 'repair_direct', 'replacement']).describe("Method of payment"),
          paymentDate: z.string().optional().describe("Scheduled payment date (ISO date)"),
          payeeInformation: z.object({
            name: z.string().describe("Name of payee"),
            address: z.object({
              street: z.string(),
              city: z.string(),
              state: z.string().optional(),
              postalCode: z.string(),
              country: z.string()
            }),
            bankDetails: z.object({
              accountNumber: z.string().optional(),
              routingNumber: z.string().optional(),
              bankName: z.string().optional()
            }).optional()
          }).describe("Payee information"),
          deductibleAmount: z.number().optional().describe("Deductible amount to subtract"),
          authorizedBy: z.string().describe("User ID of authorizer")
        }).optional().describe("Details for payment authorization"),
        settlementDetails: z.object({
          settlementType: z.enum(['full', 'partial', 'final']).describe("Type of settlement"),
          settlementAmount: z.number().describe("Total settlement amount"),
          settlementDate: z.string().describe("Settlement date (ISO date)"),
          releaseRequired: z.boolean().optional().describe("Whether release form is required"),
          settlementTerms: z.string().optional().describe("Additional settlement terms"),
          settledBy: z.string().describe("User ID of settler")
        }).optional().describe("Details for settlement action"),
        investigationRequest: z.object({
          investigationType: z.enum(['fraud', 'liability', 'coverage', 'damages']).describe("Type of investigation needed"),
          priority: z.enum(['low', 'normal', 'high', 'urgent']).describe("Investigation priority"),
          requestedBy: z.string().describe("User ID requesting investigation"),
          specialInstructions: z.string().optional().describe("Special instructions for investigator"),
          deadline: z.string().optional().describe("Investigation deadline (ISO date)")
        }).optional().describe("Details for investigation request"),
        escalationDetails: z.object({
          escalateTo: z.enum(['senior_adjuster', 'manager', 'director', 'legal']).describe("Who to escalate to"),
          escalationReason: z.string().describe("Reason for escalation"),
          urgency: z.enum(['normal', 'urgent', 'critical']).describe("Escalation urgency"),
          escalatedBy: z.string().describe("User ID of escalator"),
          deadline: z.string().optional().describe("Response deadline (ISO date)")
        }).optional().describe("Details for escalation"),
        documentationRequest: z.object({
          requiredDocuments: z.array(z.string()).describe("List of required documents"),
          requestReason: z.string().describe("Reason documents are needed"),
          deadline: z.string().optional().describe("Document submission deadline (ISO date)"),
          requestedBy: z.string().describe("User ID requesting documentation")
        }).optional().describe("Details for documentation request"),
        generalNotes: z.string().optional().describe("General notes about the action")
      }).describe("Details specific to the action being taken"),
      notificationSettings: z.object({
        notifyClaimant: z.boolean().optional().describe("Whether to notify the claimant"),
        notifyAdjuster: z.boolean().optional().describe("Whether to notify the adjuster"),
        notifyManager: z.boolean().optional().describe("Whether to notify manager"),
        customMessage: z.string().optional().describe("Custom message to include in notifications")
      }).optional().describe("Notification preferences"),
    },
    async ({ bearerToken, tenantId, claimId, action, actionDetails, notificationSettings }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const payload = {
          action,
          actionDetails,
          ...(notificationSettings && { notificationSettings })
        };
        
        const response = await client.post(
          `/claims/${claimId}/process`,
          payload,
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
                processing: {
                  claimId: response.claimId,
                  claimNumber: response.claimNumber,
                  action: response.action,
                  status: response.status,
                  processedAt: response.processedAt,
                  processedBy: response.processedBy,
                  processedByName: response.processedByName,
                  workflow: response.workflow,
                  ...(action === 'approve' && {
                    approval: response.approval
                  }),
                  ...(action === 'deny' && {
                    denial: response.denial
                  }),
                  ...(action === 'authorize_payment' && {
                    payment: response.payment,
                    paymentId: response.paymentId
                  }),
                  ...(action === 'settle' && {
                    settlement: response.settlement
                  }),
                  ...(action === 'request_investigation' && {
                    investigation: response.investigation,
                    investigationId: response.investigationId
                  }),
                  ...(action === 'escalate' && {
                    escalation: response.escalation,
                    escalationId: response.escalationId
                  }),
                  notificationsSent: response.notificationsSent,
                  nextActions: response.nextActions
                },
                message: `Claim ${action} processed successfully`
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
                error: "Failed to process claim",
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