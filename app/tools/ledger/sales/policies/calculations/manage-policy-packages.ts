/**
 * Manage Policy Packages Tool
 * Handles policy packages and aggregated calculations
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createLedgerClient } from "../../../client";

export function registerManagePolicyPackagesTool(server: McpServer) {
  server.tool(
    "ledger_sales_policies_calculations_packages_manage",
    "Manage policy packages and perform aggregated calculations",
    {
      bearerToken: z.string().min(1).describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      policyId: z.string().min(1).describe("ID of the policy to manage packages for"),
      action: z.enum(["get_calculation", "set_packages"]).describe("Action to perform"),
      packageData: z.object({
        packages: z.array(z.record(z.any())).optional().describe("Package data for set action"),
        calculationOptions: z.record(z.any()).optional().describe("Options for calculation")
      }).optional().describe("Package data for the action")
    },
    async ({ bearerToken, tenantId, policyId, action, packageData }) => {
      try {
        const client = createLedgerClient(bearerToken, tenantId);
        
        let endpoint;
        let response;

        switch (action) {
          case "get_calculation":
            endpoint = `/api/v1/ledger/sales/policies/${policyId}/packages/aggregated-calculation`;
            response = await client.get(endpoint);
            break;
          case "set_packages":
            endpoint = `/api/v1/ledger/sales/policies/${policyId}/packages/set`;
            response = await client.post(endpoint, packageData?.packages || []);
            break;
        }

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                policyId: policyId,
                action: action,
                result: response,
                packageData: packageData
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
                error: "Failed to manage policy packages",
                details: error.message,
                statusCode: error.status,
                policyId: policyId,
                action: action
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}