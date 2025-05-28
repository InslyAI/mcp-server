/**
 * List Users Tool
 * Gets simple list of users with filtering options
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../client";

export function registerListUsersTool(server: McpServer) {
  server.tool(
    "ledger_users_list",
    "Get simple list of system users with filtering and search options",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      broker: z.string().optional().describe("Get users which have this broker"),
      userSub: z.string().optional().describe("User with this sub will be added to response"),
      search: z.string().optional().describe("User name search term"),
      group: z.string().optional().describe("User group (e.g., 'Underwriter')"),
      inactive: z.boolean().optional().describe("Include inactive users"),
    },
    async ({ 
      bearerToken, 
      tenantId, 
      broker,
      userSub,
      search,
      group,
      inactive
    }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const queryParams = new URLSearchParams();
        if (broker) queryParams.append('broker', broker);
        if (userSub) queryParams.append('userSub', userSub);
        if (search) queryParams.append('search', search);
        if (group) queryParams.append('group', group);
        if (inactive !== undefined) queryParams.append('inactive', inactive.toString());
        
        const response = await client.get(
          `/api/v1/ledger/users/simple-list?${queryParams.toString()}`
        );

        // API returns array of {value, label} objects
        const userData = Array.isArray(response) ? response : (response.data || []);
        
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                users: userData.map((user: any) => ({
                  id: user.value,
                  name: user.label,
                  // Include any additional fields that might be present
                  ...user
                })),
                totalCount: userData.length
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
                error: "Failed to retrieve users",
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