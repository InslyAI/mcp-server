/**
 * Get User Permissions Tool
 * Retrieves detailed permissions and access rights for a specific user
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../client";

export function registerGetUserPermissionsTool(server: McpServer) {
  server.tool(
    "ledger_get_user_permissions",
    "Get detailed permissions, access rights, and role-based capabilities for a specific user",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      userId: z.string().describe("ID of the user to get permissions for"),
      includeInherited: z.boolean().optional().describe("Whether to include permissions inherited from roles"),
      includeEffective: z.boolean().optional().describe("Whether to include effective permissions (combination of direct + inherited)"),
      includeRestrictions: z.boolean().optional().describe("Whether to include access restrictions and limitations"),
      permissionType: z.enum(['all', 'functional', 'data', 'administrative']).optional().describe("Filter by permission type"),
      module: z.string().optional().describe("Filter by specific module/feature area"),
    },
    async ({ bearerToken, tenantId, userId, includeInherited, includeEffective, includeRestrictions, permissionType, module }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const queryParams = new URLSearchParams();
        if (includeInherited) queryParams.append('include_inherited', 'true');
        if (includeEffective) queryParams.append('include_effective', 'true');
        if (includeRestrictions) queryParams.append('include_restrictions', 'true');
        if (permissionType) queryParams.append('permission_type', permissionType);
        if (module) queryParams.append('module', module);
        
        const endpoint = `/users/${userId}/permissions${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        
        const response = await client.get(endpoint);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                userPermissions: {
                  userId: response.userId,
                  userEmail: response.userEmail,
                  userName: response.userName,
                  roles: response.roles,
                  primaryRole: response.primaryRole,
                  directPermissions: response.directPermissions,
                  ...(includeInherited && { inheritedPermissions: response.inheritedPermissions }),
                  ...(includeEffective && { effectivePermissions: response.effectivePermissions }),
                  ...(includeRestrictions && { 
                    restrictions: response.restrictions,
                    accessLimitations: response.accessLimitations 
                  }),
                  permissionsByModule: response.permissionsByModule,
                  functionalCapabilities: {
                    canCreatePolicies: response.functionalCapabilities.canCreatePolicies,
                    canApproveQuotes: response.functionalCapabilities.canApproveQuotes,
                    canProcessClaims: response.functionalCapabilities.canProcessClaims,
                    canManageUsers: response.functionalCapabilities.canManageUsers,
                    canAccessReports: response.functionalCapabilities.canAccessReports,
                    canModifySettings: response.functionalCapabilities.canModifySettings,
                    canViewAuditLogs: response.functionalCapabilities.canViewAuditLogs,
                    maxApprovalLimit: response.functionalCapabilities.maxApprovalLimit,
                    allowedProductTypes: response.functionalCapabilities.allowedProductTypes,
                    restrictedRegions: response.functionalCapabilities.restrictedRegions
                  },
                  dataAccess: {
                    ownDataOnly: response.dataAccess.ownDataOnly,
                    teamDataAccess: response.dataAccess.teamDataAccess,
                    departmentDataAccess: response.dataAccess.departmentDataAccess,
                    fullOrganizationAccess: response.dataAccess.fullOrganizationAccess,
                    sensitiveDataAccess: response.dataAccess.sensitiveDataAccess,
                    allowedBrokers: response.dataAccess.allowedBrokers,
                    allowedProducts: response.dataAccess.allowedProducts
                  },
                  lastUpdated: response.lastUpdated,
                  updatedBy: response.updatedBy
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
                error: "Failed to retrieve user permissions",
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