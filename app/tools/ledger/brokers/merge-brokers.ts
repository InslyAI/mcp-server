/**
 * Merge Brokers Tool
 * Merges duplicate broker accounts and consolidates their data
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createLedgerClient } from "../client";

export function registerMergeBrokersTool(server: McpServer) {
  server.tool(
    "ledger_brokers_merge_brokers",
    "Merge duplicate broker accounts and consolidate their policies, commissions, and data",
    {
      bearerToken: z.string().min(1).describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      mergeData: z.object({
        primaryBrokerId: z.string().min(1).describe("ID of the broker to keep as primary"),
        duplicateBrokerIds: z.array(z.string()).describe("IDs of duplicate brokers to merge into primary"),
        mergeOptions: z.object({
          mergePolicies: z.boolean().optional().describe("Merge all policies to primary broker"),
          mergeCommissions: z.boolean().optional().describe("Merge commission history"),
          mergeCustomers: z.boolean().optional().describe("Merge customer relationships"),
          mergeDocuments: z.boolean().optional().describe("Merge associated documents"),
          deleteAfterMerge: z.boolean().optional().describe("Delete duplicate accounts after merge"),
          preserveHistory: z.boolean().optional().describe("Preserve audit history")
        }).optional().describe("Merge configuration options"),
        reason: z.string().describe("Reason for merging brokers"),
        notes: z.string().optional().describe("Additional merge notes")
      }).describe("Broker merge configuration")
    },
    async ({ bearerToken, tenantId, mergeData }) => {
      try {
        const client = createLedgerClient(bearerToken, tenantId);
        
        const response = await client.post(`/api/v1/ledger/brokers/merge`, mergeData);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                message: "Broker merge initiated successfully",
                mergeId: response.mergeId || response.data?.id,
                primaryBrokerId: mergeData.primaryBrokerId,
                duplicateBrokerIds: mergeData.duplicateBrokerIds,
                mergeStatus: response.status || "processing",
                estimatedCompletion: response.estimatedCompletion,
                mergeResult: {
                  policiesMerged: response.policiesMerged || 0,
                  commissionsMerged: response.commissionsMerged || 0,
                  customersMerged: response.customersMerged || 0,
                  documentsMerged: response.documentsMerged || 0
                },
                reason: mergeData.reason
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
                error: "Failed to merge brokers",
                details: error.message,
                statusCode: error.status,
                primaryBrokerId: mergeData.primaryBrokerId
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}