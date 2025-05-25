/**
 * Update User Tool
 * Updates an existing user's profile, roles, and settings
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../client";

export function registerUpdateUserTool(server: McpServer) {
  server.tool(
    "ledger_update_user",
    "Update an existing user's profile information, roles, permissions, and settings",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      userId: z.string().describe("ID of the user to update"),
      updateData: z.object({
        firstName: z.string().optional().describe("Updated first name"),
        lastName: z.string().optional().describe("Updated last name"),
        email: z.string().email().optional().describe("Updated email address"),
        title: z.string().optional().describe("Updated job title"),
        department: z.string().optional().describe("Updated department"),
        location: z.string().optional().describe("Updated office location"),
        phoneNumber: z.string().optional().describe("Updated phone number"),
        mobileNumber: z.string().optional().describe("Updated mobile number"),
        managerId: z.string().optional().describe("Updated manager ID"),
        status: z.enum(['active', 'inactive', 'suspended', 'pending_activation']).optional().describe("Updated user status"),
        roles: z.array(z.string()).optional().describe("Updated roles array"),
        primaryRole: z.string().optional().describe("Updated primary role"),
        officeAddress: z.object({
          street: z.string().optional(),
          city: z.string().optional(),
          state: z.string().optional(),
          postalCode: z.string().optional(),
          country: z.string().optional()
        }).optional().describe("Updated office address"),
        timezone: z.string().optional().describe("Updated timezone"),
        language: z.string().optional().describe("Updated preferred language"),
        licenseInfo: z.object({
          licenseNumber: z.string().optional(),
          licenseType: z.string().optional(),
          issuingState: z.string().optional(),
          expirationDate: z.string().optional()
        }).optional().describe("Updated license information"),
        contractType: z.enum(['full_time', 'part_time', 'contractor', 'intern']).optional().describe("Updated employment type"),
        securitySettings: z.object({
          requireMFA: z.boolean().optional(),
          passwordExpiration: z.number().optional(),
          allowedIPs: z.array(z.string()).optional(),
          sessionTimeout: z.number().optional(),
          forcePasswordReset: z.boolean().optional().describe("Force user to reset password on next login")
        }).optional().describe("Updated security settings"),
        preferences: z.record(z.any()).optional().describe("Updated user preferences"),
        notes: z.string().optional().describe("Administrative notes about the user")
      }).describe("Data to update for the user"),
      reason: z.string().optional().describe("Reason for the update"),
      notifyUser: z.boolean().optional().describe("Whether to notify user of changes"),
    },
    async ({ bearerToken, tenantId, userId, updateData, reason, notifyUser }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const payload = {
          ...updateData,
          ...(reason && { updateReason: reason }),
          ...(notifyUser !== undefined && { notifyUser })
        };
        
        const response = await client.put(
          `/users/${userId}`,
          payload,
          {
            "Accept-Language": "en"
          }
        );

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
                  updatedAt: response.updatedAt,
                  updatedBy: response.updatedBy,
                  changesApplied: response.changesApplied,
                  notificationSent: response.notificationSent,
                  requiresReactivation: response.requiresReactivation
                },
                message: "User updated successfully"
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
                error: "Failed to update user",
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