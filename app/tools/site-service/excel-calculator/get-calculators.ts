import { createSiteServiceClient } from "../client";
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerGetExcelCalculatorsTool(server: McpServer) {
  server.tool(
    "site_service_excel_calculator_list",
    "Get list of excel calculators for preloading",
    {
      bearerToken: z.string().min(1).describe("JWT bearer token from identifier_login"),
      tenantId: z.string().min(1).describe("Tenant identifier for API access")
    },
    async ({ bearerToken, tenantId }) => {
      try {
        const client = createSiteServiceClient(bearerToken, tenantId);
        const data = await client.get(`/api/v1/sites/preload-excel-calc-api`);
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({ 
              success: true, 
              data,
              message: "Retrieved list of excel calculators"
            }, null, 2)
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: JSON.stringify({ 
              success: false, 
              error: error instanceof Error ? error.message : 'Unknown error',
              details: "Failed to get excel calculators list"
            }, null, 2)
          }]
        };
      }
    }
  );
}