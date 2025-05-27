/**
 * List Users Tool
 * Gets paginated list of system users with filtering options
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../client";

export function registerListUsersTool(server: McpServer) {
  server.tool(
    "ledger_list_users",
    "Get paginated list of system users with filtering, search, and role-based options",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      status: z.enum(['active', 'inactive', 'suspended', 'pending_activation']).optional().describe("Filter by user status"),
      role: z.array(z.string()).optional().describe("Filter by user roles (e.g., ['underwriter', 'broker', 'admin'])"),
      department: z.string().optional().describe("Filter by department"),
      location: z.string().optional().describe("Filter by office location"),
      search: z.string().optional().describe("Search term for name, email, or employee ID"),
      includePermissions: z.boolean().optional().describe("Whether to include user permissions summary"),
      includeLastActivity: z.boolean().optional().describe("Whether to include last activity information"),
      createdFrom: z.string().optional().describe("Filter by user creation date from (ISO date)"),
      createdTo: z.string().optional().describe("Filter by user creation date to (ISO date)"),
      lastLoginFrom: z.string().optional().describe("Filter by last login date from (ISO date)"),
      lastLoginTo: z.string().optional().describe("Filter by last login date to (ISO date)"),
      page: z.number().optional().describe("Page number for pagination (default: 1)"),
      limit: z.number().optional().describe("Number of results per page (default: 20, max: 100)"),
      sortBy: z.enum(['name', 'email', 'createdAt', 'lastLogin', 'status', 'role']).optional().describe("Field to sort by"),
      sortOrder: z.enum(['asc', 'desc']).optional().describe("Sort order (default: asc)"),
    },
    async ({ 
      bearerToken, 
      tenantId, 
      status,
      role,
      department,
      location,
      search,
      includePermissions,
      includeLastActivity,
      createdFrom,
      createdTo,
      lastLoginFrom,
      lastLoginTo,
      page,
      limit,
      sortBy,
      sortOrder 
    }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const queryParams = new URLSearchParams();
        if (status) queryParams.append('status', status);
        if (role) role.forEach(r => queryParams.append('role[]', r));
        if (department) queryParams.append('department', department);
        if (location) queryParams.append('location', location);
        if (search) queryParams.append('search', search);
        if (includePermissions) queryParams.append('include_permissions', 'true');
        if (includeLastActivity) queryParams.append('include_last_activity', 'true');
        if (createdFrom) queryParams.append('created_from', createdFrom);
        if (createdTo) queryParams.append('created_to', createdTo);
        if (lastLoginFrom) queryParams.append('last_login_from', lastLoginFrom);
        if (lastLoginTo) queryParams.append('last_login_to', lastLoginTo);
        if (page) queryParams.append('page', page.toString());
        if (limit) queryParams.append('limit', limit.toString());
        if (sortBy) queryParams.append('sort_by', sortBy);
        if (sortOrder) queryParams.append('sort_order', sortOrder);
        
        const response = await client.get(
          `/api/v1/ledger/users/simple-list?${queryParams.toString()}`
        );

        // Handle different response structures
        const userData = Array.isArray(response) ? response : (response.data || response);
        
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                users: Array.isArray(userData) ? userData.map((user: any) => ({
                  // Map based on simple-list API structure
                  id: user.value || user.id,
                  name: user.label || user.name || user.fullName,
                  email: user.email,
                  sub: user.sub,
                  group: user.group,
                  // Include any other available fields
                  ...user
                })) : [],
                totalCount: Array.isArray(userData) ? userData.length : 0,
                rawResponse: response // For debugging
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