/**
 * Get Request Status Tool
 * Tracks status of asynchronous operations and long-running requests
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../client";

export function registerGetRequestStatusTool(server: McpServer) {
  server.tool(
    "ledger_get_request_status",
    "Get status of asynchronous operations like quote processing, policy issuance, or bulk calculations",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      requestId: z.string().describe("ID of the request to check status for"),
      includeDetails: z.boolean().optional().describe("Include detailed progress information"),
      includeLogs: z.boolean().optional().describe("Include execution logs")
    },
    async ({ bearerToken, tenantId, requestId, includeDetails, includeLogs }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const queryParams = new URLSearchParams();
        if (includeDetails) queryParams.append('includeDetails', includeDetails.toString());
        if (includeLogs) queryParams.append('includeLogs', includeLogs.toString());
        
        const endpoint = `/api/v1/ledger/requests/${requestId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        
        const response = await client.get(endpoint);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                requestId: requestId,
                status: {
                  state: response.status || response.state,
                  progress: response.progress || 0,
                  startTime: response.startTime,
                  endTime: response.endTime,
                  estimatedCompletion: response.estimatedCompletion,
                  message: response.message,
                  error: response.error,
                  result: response.result,
                  details: response.details || {},
                  logs: response.logs || []
                },
                metadata: {
                  requestType: response.requestType,
                  initiatedBy: response.initiatedBy,
                  priority: response.priority,
                  retryCount: response.retryCount || 0,
                  lastUpdated: response.lastUpdated
                }
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
                error: "Failed to retrieve request status",
                details: error.message,
                statusCode: error.status,
                requestId: requestId
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}