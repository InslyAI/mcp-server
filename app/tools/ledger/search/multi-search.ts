/**
 * Multi-Search Tool
 * Universal search across all platform entities
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../client";

export function registerMultiSearchTool(server: McpServer) {
  server.tool(
    "ledger_search_multi_search",
    "Universal search across all platform entities including policies, customers, quotes, brokers, and more",
    {
      bearerToken: z.string().min(1).describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      query: z.string().describe("Search query string"),
      searchOptions: z.object({
        entities: z.array(z.string()).optional().describe("Specific entities to search (policies, customers, quotes, brokers, etc.)"),
        limit: z.number().optional().describe("Maximum results per entity type"),
        includeInactive: z.boolean().optional().describe("Include inactive/archived records"),
        exactMatch: z.boolean().optional().describe("Require exact match vs fuzzy search"),
        fields: z.array(z.string()).optional().describe("Specific fields to search in"),
        sortBy: z.string().optional().describe("Sort results by field"),
        dateRange: z.object({
          from: z.string().optional(),
          to: z.string().optional()
        }).optional().describe("Date range filter")
      }).optional().describe("Search configuration options")
    },
    async ({ bearerToken, tenantId, query, searchOptions }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const queryParams = new URLSearchParams();
        queryParams.append('q', query);
        
        if (searchOptions) {
          if (searchOptions.entities) {
            searchOptions.entities.forEach(entity => queryParams.append('entities[]', entity));
          }
          if (searchOptions.limit) queryParams.append('limit', searchOptions.limit.toString());
          if (searchOptions.includeInactive) queryParams.append('includeInactive', searchOptions.includeInactive.toString());
          if (searchOptions.exactMatch) queryParams.append('exactMatch', searchOptions.exactMatch.toString());
          if (searchOptions.fields) {
            searchOptions.fields.forEach(field => queryParams.append('fields[]', field));
          }
          if (searchOptions.sortBy) queryParams.append('sortBy', searchOptions.sortBy);
          if (searchOptions.dateRange?.from) queryParams.append('dateFrom', searchOptions.dateRange.from);
          if (searchOptions.dateRange?.to) queryParams.append('dateTo', searchOptions.dateRange.to);
        }
        
        const response = await client.get(`/api/v1/ledger/msearch?${queryParams.toString()}`);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                query: query,
                searchResults: {
                  policies: response.policies || [],
                  customers: response.customers || [],
                  quotes: response.quotes || [],
                  brokers: response.brokers || [],
                  claims: response.claims || [],
                  invoices: response.invoices || [],
                  total: response.total || 0,
                  entityCounts: response.entityCounts || {}
                },
                searchOptions: searchOptions || {},
                executionTime: response.executionTime,
                suggestions: response.suggestions || []
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
                error: "Failed to perform multi-search",
                details: error.message,
                statusCode: error.status,
                query: query
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}