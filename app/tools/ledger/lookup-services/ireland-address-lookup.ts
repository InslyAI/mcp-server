/**
 * Ireland Address Lookup Tool
 * Address validation and lookup services for Ireland
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../client";

export function registerIrelandAddressLookupTool(server: McpServer) {
  server.tool(
    "ledger_ireland_address_lookup",
    "Look up and validate addresses in Ireland using official postal services",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      query: z.string().describe("Address search query (partial address, postcode, etc.)"),
      options: z.object({
        maxResults: z.number().optional().describe("Maximum number of results to return"),
        includeCoordinates: z.boolean().optional().describe("Include GPS coordinates in results"),
        validateOnly: z.boolean().optional().describe("Only validate, don't return suggestions")
      }).optional().describe("Search options")
    },
    async ({ bearerToken, tenantId, query, options = {} }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const endpoint = `/api/v1/ledger/lookup/ireland/address`;
        const searchParams = {
          query,
          ...options
        };
        
        const response = await client.post(endpoint, searchParams);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                query: query,
                addresses: response,
                options: options
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
                error: "Failed to lookup Ireland address",
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

export function registerIrelandPostcodeLookupTool(server: McpServer) {
  server.tool(
    "ledger_ireland_postcode_lookup",
    "Look up postcodes and Eircode information for Ireland addresses",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      addressData: z.object({
        addressLine1: z.string().optional(),
        addressLine2: z.string().optional(),
        city: z.string().optional(),
        county: z.string().optional(),
        eircode: z.string().optional()
      }).describe("Address components to lookup postcode for"),
      lookupType: z.enum(["postcode", "eircode", "validate"]).describe("Type of lookup to perform")
    },
    async ({ bearerToken, tenantId, addressData, lookupType }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const endpoint = `/api/v1/ledger/lookup/ireland/postcode`;
        const requestData = {
          addressData,
          lookupType
        };
        
        const response = await client.post(endpoint, requestData);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                lookupType: lookupType,
                addressData: addressData,
                result: response
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
                error: "Failed to lookup Ireland postcode",
                details: error.message,
                statusCode: error.status,
                lookupType: lookupType
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}