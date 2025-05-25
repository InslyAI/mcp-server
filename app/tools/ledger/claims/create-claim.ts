/**
 * Create Claim Tool
 * Creates a new insurance claim with comprehensive details
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../client";

export function registerCreateClaimTool(server: McpServer) {
  server.tool(
    "ledger_create_claim",
    "Create a new insurance claim with comprehensive claimant, loss, and processing details",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      claimData: z.object({
        policyId: z.string().describe("ID of the policy under which the claim is made"),
        claimType: z.string().describe("Type of claim (e.g., 'property', 'liability', 'auto', 'health')"),
        severity: z.enum(['minor', 'moderate', 'major', 'catastrophic']).describe("Claim severity classification"),
        lossDetails: z.object({
          lossDate: z.string().describe("Date when the loss occurred (ISO date)"),
          lossTime: z.string().optional().describe("Time when the loss occurred (HH:MM format)"),
          lossLocation: z.object({
            address: z.string().describe("Address where loss occurred"),
            city: z.string(),
            state: z.string().optional(),
            postalCode: z.string().optional(),
            country: z.string(),
            coordinates: z.object({
              latitude: z.number(),
              longitude: z.number()
            }).optional()
          }).describe("Location where the loss occurred"),
          lossDescription: z.string().describe("Detailed description of what happened"),
          causeOfLoss: z.string().describe("Primary cause of the loss"),
          weatherConditions: z.string().optional().describe("Weather conditions at time of loss"),
          witnesses: z.array(z.object({
            name: z.string(),
            phone: z.string().optional(),
            email: z.string().optional(),
            statement: z.string().optional()
          })).optional().describe("Witnesses to the loss event")
        }).describe("Details about the loss event"),
        claimantInformation: z.object({
          isPolicyHolder: z.boolean().describe("Whether claimant is the policy holder"),
          name: z.string().describe("Claimant's full name"),
          relationship: z.string().optional().describe("Relationship to policy holder if not the same person"),
          contactInfo: z.object({
            email: z.string(),
            phone: z.string(),
            alternatePhone: z.string().optional(),
            address: z.object({
              street: z.string(),
              city: z.string(),
              state: z.string().optional(),
              postalCode: z.string(),
              country: z.string()
            })
          }).describe("Claimant contact information"),
          dateOfBirth: z.string().optional().describe("Claimant date of birth (ISO date)")
        }).describe("Information about the person making the claim"),
        damageAssessment: z.object({
          estimatedAmount: z.number().describe("Initial estimated claim amount"),
          currency: z.string().describe("Currency code (e.g., 'USD', 'EUR')"),
          damagedItems: z.array(z.object({
            item: z.string().describe("Description of damaged item"),
            estimatedValue: z.number().describe("Estimated value of damaged item"),
            damageDescription: z.string().describe("Description of damage to this item")
          })).optional().describe("List of damaged items"),
          photos: z.array(z.object({
            filename: z.string(),
            description: z.string(),
            contentType: z.string(),
            size: z.number()
          })).optional().describe("Photos of damage"),
          repairEstimates: z.array(z.object({
            vendor: z.string(),
            amount: z.number(),
            description: z.string(),
            estimateDate: z.string()
          })).optional().describe("Repair estimates obtained")
        }).describe("Assessment of damages"),
        reportingDetails: z.object({
          reportedBy: z.string().describe("Name of person reporting the claim"),
          reportedDate: z.string().describe("Date claim was reported (ISO date)"),
          reportingMethod: z.enum(['phone', 'online', 'email', 'in_person', 'mobile_app']).describe("How the claim was reported"),
          initialNotes: z.string().optional().describe("Initial notes from the reporting call/interaction")
        }).describe("Details about how and when the claim was reported"),
        assignedAdjuster: z.string().optional().describe("ID of adjuster to assign to this claim"),
        priority: z.enum(['low', 'normal', 'high', 'urgent']).optional().describe("Processing priority"),
        specialInstructions: z.string().optional().describe("Special handling instructions"),
        relatedClaims: z.array(z.string()).optional().describe("IDs of related claims"),
        thirdPartyInformation: z.object({
          isThirdPartyInvolved: z.boolean().describe("Whether third parties are involved"),
          thirdParties: z.array(z.object({
            name: z.string(),
            insuranceCompany: z.string().optional(),
            policyNumber: z.string().optional(),
            contactInfo: z.object({
              phone: z.string().optional(),
              email: z.string().optional()
            }).optional()
          })).optional().describe("Third party information if applicable")
        }).optional().describe("Third party involvement details")
      }).describe("Comprehensive claim data"),
    },
    async ({ bearerToken, tenantId, claimData }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const response = await client.post(
          `/claims`,
          claimData,
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
                  claimType: response.claimType,
                  severity: response.severity,
                  policyId: response.policyId,
                  policyNumber: response.policyNumber,
                  claimantName: response.claimantInformation.name,
                  estimatedAmount: response.damageAssessment.estimatedAmount,
                  currency: response.damageAssessment.currency,
                  lossDate: response.lossDetails.lossDate,
                  reportedAt: response.reportingDetails.reportedDate,
                  assignedAdjuster: response.assignedAdjuster,
                  adjusterName: response.adjusterName,
                  reserveAmount: response.reserveAmount,
                  createdAt: response.createdAt,
                  workflow: response.workflow,
                  trackingNumber: response.trackingNumber
                },
                message: "Claim created successfully"
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
                error: "Failed to create claim",
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