/**
 * Debug Calculation API Tool
 * Debugs calculation API issues and provides diagnostic information
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../client";

export function registerDebugCalculationApiTool(server: McpServer) {
  server.tool(
    "ledger_debug_calculation_api",
    "Debug calculation API issues and get diagnostic information for troubleshooting",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      debugOptions: z.object({
        calculatorId: z.string().optional().describe("Specific calculator to debug"),
        testInputs: z.record(z.any()).optional().describe("Test input values"),
        includeTrace: z.boolean().optional().describe("Include execution trace"),
        includePerformance: z.boolean().optional().describe("Include performance metrics"),
        logLevel: z.string().optional().describe("Debug log level (error, warn, info, debug)")
      }).optional().describe("Debug configuration options")
    },
    async ({ bearerToken, tenantId, debugOptions }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const queryParams = new URLSearchParams();
        if (debugOptions) {
          Object.entries(debugOptions).forEach(([key, value]) => {
            if (value !== undefined && value !== null && typeof value !== 'object') {
              queryParams.append(key, value.toString());
            }
          });
        }
        
        const endpoint = `/api/v1/sales/calc-api/debug${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        
        const requestBody = debugOptions?.testInputs ? { testInputs: debugOptions.testInputs } : {};
        
        const response = await client.post(endpoint, requestBody);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                debugResult: {
                  apiStatus: response.apiStatus || "operational",
                  calculatorStatus: response.calculatorStatus || {},
                  executionTrace: response.executionTrace || [],
                  performance: response.performance || {},
                  errors: response.errors || [],
                  warnings: response.warnings || [],
                  systemInfo: response.systemInfo || {},
                  testResults: response.testResults || {}
                },
                debugOptions: debugOptions || {},
                timestamp: new Date().toISOString()
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
                error: "Failed to debug calculation API",
                details: error.message,
                statusCode: error.status,
                debugInfo: {
                  errorType: error.name,
                  timestamp: new Date().toISOString(),
                  debugOptions: debugOptions
                }
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}