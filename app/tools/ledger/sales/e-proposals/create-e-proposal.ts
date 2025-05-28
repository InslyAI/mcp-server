/**
 * Create E-proposal Tool
 * Creates a new electronic proposal for streamlined underwriting workflow
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../../client";

export function registerCreateEProposalTool(server: McpServer) {
  server.tool(
    "ledger_sales_e_proposals_create",
    "Create a new electronic proposal for streamlined underwriting and approval workflow",
    {
      bearerToken: z.string().min(1).describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      proposalData: z.object({
        productId: z.string().min(1).describe("ID of the insurance product"),
        brokerId: z.string().min(1).describe("ID of the broker submitting the proposal"),
        clientData: z.object({
          name: z.string().describe("Client company or individual name"),
          email: z.string().describe("Primary contact email"),
          phone: z.string().regex(/^[\+]?[0-9\s\-\(\)]{7,15}$/).optional().describe("Contact phone number (international format)"),
          address: z.object({
            street: z.string(),
            city: z.string(),
            state: z.string().optional(),
            postalCode: z.string(),
            country: z.string()
          }).describe("Client address information")
        }).describe("Client information"),
        riskData: z.record(z.any()).describe("Risk assessment data based on product schema"),
        coverageRequirements: z.object({
          limits: z.record(z.any()).describe("Coverage limits requested"),
          deductibles: z.record(z.any()).optional().describe("Deductible preferences"),
          policyTerm: z.string().describe("Policy term (e.g., '12 months', '1 year')"),
          effectiveDate: z.string().describe("Requested policy effective date (ISO date)")
        }).describe("Coverage requirements"),
        submissionNotes: z.string().optional().describe("Additional notes from broker"),
        attachments: z.array(z.object({
          filename: z.string(),
          contentType: z.string(),
          size: z.number()
        })).optional().describe("Supporting documents attached"),
        priority: z.enum(['normal', 'urgent', 'rush']).optional().describe("Processing priority")
      }).describe("Electronic proposal data"),
    },
    async ({ bearerToken, tenantId, proposalData }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const response = await client.post(
          `/e-proposals`,
          proposalData,
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
                  productId: response.productId,
                  brokerId: response.brokerId,
                  clientName: response.clientData.name,
                  submittedAt: response.submittedAt,
                  priority: response.priority,
                  workflow: response.workflow
                },
                message: "E-proposal created successfully"
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
                error: "Failed to create e-proposal",
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