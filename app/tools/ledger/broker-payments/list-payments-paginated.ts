/**
 * List Payments Paginated Tool
 * Retrieves paginated list of broker payments with cursor-based pagination
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../client";

export function registerListPaymentsPaginatedTool(server: McpServer) {
  server.tool(
    "ledger_list_payments_paginated",
    "Get paginated list of broker payments with cursor-based navigation",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      pagination: z.object({
        cursor: z.string().optional().describe("Cursor for pagination navigation"),
        limit: z.number().optional().describe("Number of records per page (default: 20)"),
        direction: z.enum(["forward", "backward"]).optional().describe("Pagination direction")
      }).optional().describe("Pagination parameters"),
      filters: z.object({
        brokerId: z.string().optional().describe("Filter by broker ID"),
        insurerId: z.string().optional().describe("Filter by insurer ID"),
        status: z.array(z.string()).optional().describe("Filter by payment status"),
        dateFrom: z.string().optional().describe("Start date filter (YYYY-MM-DD)"),
        dateTo: z.string().optional().describe("End date filter (YYYY-MM-DD)"),
        minAmount: z.number().optional().describe("Minimum payment amount"),
        maxAmount: z.number().optional().describe("Maximum payment amount")
      }).optional().describe("Filter parameters")
    },
    async ({ bearerToken, tenantId, pagination, filters }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const queryParams = new URLSearchParams();
        
        if (pagination?.cursor) queryParams.append('cursor', pagination.cursor);
        if (pagination?.limit) queryParams.append('limit', pagination.limit.toString());
        if (pagination?.direction) queryParams.append('direction', pagination.direction);
        
        if (filters) {
          Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              if (Array.isArray(value)) {
                value.forEach(v => queryParams.append(`${key}[]`, v.toString()));
              } else {
                queryParams.append(key, value.toString());
              }
            }
          });
        }
        
        const response = await client.get(`/api/v1/ledger/brokerpayments-paginated?${queryParams.toString()}`);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                payments: response.data || response.payments,
                pagination: {
                  cursor: response.cursor,
                  nextCursor: response.nextCursor,
                  previousCursor: response.previousCursor,
                  hasNext: response.hasNext,
                  hasPrevious: response.hasPrevious,
                  limit: pagination?.limit || 20
                },
                filters: filters || {},
                totalEstimate: response.totalEstimate
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
                error: "Failed to retrieve paginated payments",
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