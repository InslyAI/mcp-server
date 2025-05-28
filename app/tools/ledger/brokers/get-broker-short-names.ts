/**
 * Get Broker Short Names Tool
 * Retrieves quick reference list of broker short names and identifiers
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../client";

export function registerGetBrokerShortNamesTool(server: McpServer) {
  server.tool(
    "ledger_brokers_get_short_names",
    "Get quick reference list of broker short names and identifiers for lookups and integrations",
    {
      bearerToken: z.string().min(1).describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      filters: z.object({
        activeOnly: z.boolean().optional().describe("Include only active brokers"),
        region: z.string().optional().describe("Filter by geographic region"),
        productType: z.string().optional().describe("Filter by insurance product type"),
        hasActivePolicies: z.boolean().optional().describe("Filter brokers with active policies"),
        searchTerm: z.string().optional().describe("Search in broker names")
      }).optional().describe("Filtering options")
    },
    async ({ bearerToken, tenantId, filters }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const queryParams = new URLSearchParams();
        if (filters) {
          Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              queryParams.append(key, value.toString());
            }
          });
        }
        
        const endpoint = `/api/v1/ledger/brokers/short-names${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        
        const response = await client.get(endpoint);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                brokers: response.brokers || response,
                summary: {
                  totalBrokers: response.totalBrokers || 0,
                  activeBrokers: response.activeBrokers || 0,
                  filteredCount: Array.isArray(response.brokers || response) ? (response.brokers || response).length : 0
                },
                filters: filters || {},
                lastUpdated: response.lastUpdated
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
                error: "Failed to retrieve broker short names",
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