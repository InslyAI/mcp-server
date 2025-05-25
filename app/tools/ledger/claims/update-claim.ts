/**
 * Update Claim Tool
 * Updates an existing insurance claim with new information or status changes
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../client";

export function registerUpdateClaimTool(server: McpServer) {
  server.tool(
    "ledger_update_claim",
    "Update an existing insurance claim with new information, status changes, or additional details",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      claimId: z.string().describe("ID of the claim to update"),
      updateData: z.object({
        status: z.enum(['reported', 'under_investigation', 'approved', 'denied', 'closed', 'reopened', 'settled']).optional().describe("Updated claim status"),
        severity: z.enum(['minor', 'moderate', 'major', 'catastrophic']).optional().describe("Updated severity classification"),
        priority: z.enum(['low', 'normal', 'high', 'urgent']).optional().describe("Updated processing priority"),
        assignedAdjuster: z.string().optional().describe("Reassign to different adjuster ID"),
        lossDetails: z.object({
          lossDescription: z.string().optional().describe("Updated loss description"),
          causeOfLoss: z.string().optional().describe("Updated cause of loss"),
          weatherConditions: z.string().optional().describe("Updated weather conditions"),
          additionalWitnesses: z.array(z.object({
            name: z.string(),
            phone: z.string().optional(),
            email: z.string().optional(),
            statement: z.string().optional()
          })).optional().describe("Additional witnesses to add")
        }).optional().describe("Updated loss details"),
        claimantInformation: z.object({
          contactInfo: z.object({
            email: z.string().optional(),
            phone: z.string().optional(),
            alternatePhone: z.string().optional(),
            address: z.object({
              street: z.string().optional(),
              city: z.string().optional(),
              state: z.string().optional(),
              postalCode: z.string().optional(),
              country: z.string().optional()
            }).optional()
          }).optional().describe("Updated contact information")
        }).optional().describe("Updated claimant information"),
        damageAssessment: z.object({
          estimatedAmount: z.number().optional().describe("Updated estimated amount"),
          additionalDamagedItems: z.array(z.object({
            item: z.string(),
            estimatedValue: z.number(),
            damageDescription: z.string()
          })).optional().describe("Additional damaged items to add"),
          additionalRepairEstimates: z.array(z.object({
            vendor: z.string(),
            amount: z.number(),
            description: z.string(),
            estimateDate: z.string()
          })).optional().describe("Additional repair estimates")
        }).optional().describe("Updated damage assessment"),
        investigationStatus: z.object({
          status: z.enum(['not_started', 'in_progress', 'completed', 'on_hold']).optional(),
          investigatorId: z.string().optional(),
          findings: z.string().optional(),
          recommendedAction: z.string().optional()
        }).optional().describe("Investigation status updates"),
        settlementInfo: z.object({
          settlementAmount: z.number().optional(),
          settlementDate: z.string().optional(),
          settlementMethod: z.enum(['check', 'bank_transfer', 'repair_direct', 'replacement']).optional(),
          settlementNotes: z.string().optional()
        }).optional().describe("Settlement information"),
        specialInstructions: z.string().optional().describe("Updated special instructions"),
        internalNotes: z.string().optional().describe("Internal notes to add"),
        adjusterNotes: z.string().optional().describe("Adjuster notes to add")
      }).describe("Data to update in the claim"),
      reason: z.string().optional().describe("Reason for the update"),
      notifyStakeholders: z.boolean().optional().describe("Whether to notify relevant stakeholders"),
    },
    async ({ bearerToken, tenantId, claimId, updateData, reason, notifyStakeholders }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const payload = {
          ...updateData,
          ...(reason && { updateReason: reason }),
          ...(notifyStakeholders !== undefined && { notifyStakeholders })
        };
        
        const response = await client.put(
          `/claims/${claimId}`,
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
                claim: {
                  id: response.id,
                  claimNumber: response.claimNumber,
                  status: response.status,
                  severity: response.severity,
                  priority: response.priority,
                  assignedAdjuster: response.assignedAdjuster,
                  adjusterName: response.adjusterName,
                  estimatedAmount: response.damageAssessment.estimatedAmount,
                  reserveAmount: response.financials.reserveAmount,
                  updatedAt: response.updatedAt,
                  updatedBy: response.updatedBy,
                  changesApplied: response.changesApplied,
                  workflow: response.workflow,
                  notificationsSent: response.notificationsSent
                },
                message: "Claim updated successfully"
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
                error: "Failed to update claim",
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