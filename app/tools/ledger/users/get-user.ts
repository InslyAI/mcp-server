/**
 * Get User Tool
 * Retrieves detailed information about a specific user
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../client";

export function registerGetUserTool(server: McpServer) {
  server.tool(
    "ledger_get_user",
    "Get detailed information about a specific system user including profile, roles, and permissions",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      userId: z.string().describe("ID of the user to retrieve"),
      includePermissions: z.boolean().optional().describe("Whether to include detailed permissions"),
      includeActivityHistory: z.boolean().optional().describe("Whether to include recent activity history"),
      includeTeamMembers: z.boolean().optional().describe("Whether to include team/subordinate information"),
      includeSecurityInfo: z.boolean().optional().describe("Whether to include security-related information"),
    },
    async ({ bearerToken, tenantId, userId, includePermissions, includeActivityHistory, includeTeamMembers, includeSecurityInfo }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const queryParams = new URLSearchParams();
        if (includePermissions) queryParams.append('include_permissions', 'true');
        if (includeActivityHistory) queryParams.append('include_activity_history', 'true');
        if (includeTeamMembers) queryParams.append('include_team_members', 'true');
        if (includeSecurityInfo) queryParams.append('include_security_info', 'true');
        
        const endpoint = `/users/${userId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        
        const response = await client.get(endpoint);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                user: {
                  id: response.id,
                  employeeId: response.employeeId,
                  email: response.email,
                  firstName: response.firstName,
                  lastName: response.lastName,
                  fullName: response.fullName,
                  status: response.status,
                  roles: response.roles,
                  primaryRole: response.primaryRole,
                  department: response.department,
                  title: response.title,
                  location: response.location,
                  officeAddress: response.officeAddress,
                  phoneNumber: response.phoneNumber,
                  mobileNumber: response.mobileNumber,
                  managerId: response.managerId,
                  managerName: response.managerName,
                  createdAt: response.createdAt,
                  updatedAt: response.updatedAt,
                  lastLogin: response.lastLogin,
                  isOnline: response.isOnline,
                  avatar: response.avatar,
                  timezone: response.timezone,
                  language: response.language,
                  preferences: response.preferences,
                  licenseInfo: response.licenseInfo,
                  certifications: response.certifications,
                  ...(includePermissions && { 
                    permissions: response.permissions,
                    rolePermissions: response.rolePermissions 
                  }),
                  ...(includeActivityHistory && { 
                    activityHistory: response.activityHistory,
                    recentActions: response.recentActions 
                  }),
                  ...(includeTeamMembers && { 
                    teamMembers: response.teamMembers,
                    subordinates: response.subordinates 
                  }),
                  ...(includeSecurityInfo && { 
                    securityInfo: response.securityInfo,
                    loginHistory: response.loginHistory,
                    passwordLastChanged: response.passwordLastChanged,
                    mfaEnabled: response.mfaEnabled
                  })
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
                error: "Failed to retrieve user",
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