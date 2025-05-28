/**
 * Update E-proposal Tool
 * Updates an existing electronic proposal with new data or corrections
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../../client";

export function registerUpdateEProposalTool(server: McpServer) {
  server.tool(
    "ledger_update_e_proposal",
    "Update an existing electronic proposal with new data, corrections, or additional information",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      proposalId: z.string().describe("ID of the e-proposal to update"),
      updateData: z.object({
        clientData: z.object({
          name: z.string().optional(),
          email: z.string().optional(),
          phone: z.string().optional(),
          address: z.object({
            street: z.string().optional(),
            city: z.string().optional(),
            state: z.string().optional(),
            postalCode: z.string().optional(),
            country: z.string().optional()
          }).optional()
        }).optional().describe("Updated client information"),
        riskData: z.record(z.any()).optional().describe("Updated risk assessment data"),
        coverageRequirements: z.object({
          limits: z.record(z.any()).optional(),
          deductibles: z.record(z.any()).optional(),
          policyTerm: z.string().optional(),
          effectiveDate: z.string().optional()
        }).optional().describe("Updated coverage requirements"),
        submissionNotes: z.string().optional().describe("Updated or additional broker notes"),
        priority: z.enum(['normal', 'urgent', 'rush']).optional().describe("Updated processing priority"),
        internalNotes: z.string().optional().describe("Internal notes from underwriter or processor")
      }).describe("Data to update in the e-proposal"),
      reason: z.string().optional().describe("Reason for the update"),
    },
    async ({ bearerToken, tenantId, proposalId, updateData, reason }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const payload = {
          ...updateData,
          ...(reason && { updateReason: reason })
        };
        
        const response = await client.put(
          `/e-proposals/${proposalId}`,
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
                eProposal: {
                  id: response.id,
                  proposalNumber: response.proposalNumber,
                  status: response.status,
                  lastUpdated: response.lastUpdated,
                  updatedBy: response.updatedBy,
                  clientData: response.clientData,
                  riskData: response.riskData,
                  coverageRequirements: response.coverageRequirements,
                  priority: response.priority,
                  workflow: response.workflow
                },
                message: "E-proposal updated successfully"
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
                error: "Failed to update e-proposal",
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