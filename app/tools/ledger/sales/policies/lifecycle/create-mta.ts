/**
 * Create MTA Tool
 * Creates a Mid-Term Adjustment (MTA) for policy changes
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../../../client";

export function registerCreateMtaTool(server: McpServer) {
  server.tool(
    "ledger_create_mta",
    "Create a Mid-Term Adjustment (MTA) for making changes to an existing policy during the policy term",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      mtaData: z.object({
        basePolicyId: z.string().describe("ID of the base policy to create MTA for"),
        mtaType: z.string().describe("Type of MTA (coverage_change, risk_change, etc.)"),
        effectiveDate: z.string().describe("Effective date for the MTA (YYYY-MM-DD)"),
        reason: z.string().describe("Reason for the MTA"),
        changes: z.record(z.any()).describe("Specific changes to be made to the policy"),
        requestedBy: z.string().optional().describe("Who requested the MTA (customer, broker, etc.)"),
        requestDate: z.string().optional().describe("Date when MTA was requested (YYYY-MM-DD)"),
        priority: z.string().optional().describe("Priority level (high, medium, low)"),
        customerImpact: z.string().optional().describe("Description of impact on customer"),
        premiumAdjustment: z.number().optional().describe("Expected premium adjustment amount")
      }).describe("MTA data and configuration")
    },
    async ({ bearerToken, tenantId, mtaData }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const response = await client.post(`/api/v1/ledger/sales/policies/mta`, mtaData);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                message: "MTA created successfully",
                basePolicyId: mtaData.basePolicyId,
                mtaId: response.id || response.data?.id,
                mtaType: mtaData.mtaType,
                effectiveDate: mtaData.effectiveDate,
                status: response.status || "pending",
                createdAt: new Date().toISOString(),
                data: response.data,
                meta: response.meta
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
                error: "Failed to create MTA",
                details: error.message,
                statusCode: error.status,
                basePolicyId: mtaData.basePolicyId
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}