/**
 * Create User Tool
 * Creates a new system user with roles and permissions
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../client";

export function registerCreateUserTool(server: McpServer) {
  server.tool(
    "ledger_create_user",
    "Create a new system user with specified roles, permissions, and profile information",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      userData: z.object({
        email: z.string().email().describe("User's email address (must be unique)"),
        firstName: z.string().describe("User's first name"),
        lastName: z.string().describe("User's last name"),
        employeeId: z.string().optional().describe("Employee ID (if applicable)"),
        title: z.string().describe("Job title"),
        department: z.string().describe("Department name"),
        location: z.string().describe("Office location"),
        phoneNumber: z.string().optional().describe("Primary phone number"),
        mobileNumber: z.string().optional().describe("Mobile phone number"),
        managerId: z.string().optional().describe("ID of direct manager"),
        roles: z.array(z.string()).describe("Array of role names to assign"),
        primaryRole: z.string().describe("Primary role for the user"),
        officeAddress: z.object({
          street: z.string(),
          city: z.string(),
          state: z.string().optional(),
          postalCode: z.string(),
          country: z.string()
        }).optional().describe("Office address"),
        timezone: z.string().optional().describe("User's timezone (e.g., 'America/New_York')"),
        language: z.string().optional().describe("Preferred language (default: 'en')"),
        licenseInfo: z.object({
          licenseNumber: z.string().optional(),
          licenseType: z.string().optional(),
          issuingState: z.string().optional(),
          expirationDate: z.string().optional()
        }).optional().describe("Professional license information"),
        startDate: z.string().describe("Employment start date (ISO date)"),
        contractType: z.enum(['full_time', 'part_time', 'contractor', 'intern']).optional().describe("Employment type"),
        securitySettings: z.object({
          requireMFA: z.boolean().optional().describe("Whether to require multi-factor authentication"),
          passwordExpiration: z.number().optional().describe("Password expiration in days"),
          allowedIPs: z.array(z.string()).optional().describe("Allowed IP addresses for login"),
          sessionTimeout: z.number().optional().describe("Session timeout in minutes")
        }).optional().describe("Security configuration"),
        sendWelcomeEmail: z.boolean().optional().describe("Whether to send welcome email with login instructions"),
        temporaryPassword: z.string().optional().describe("Temporary password (if not auto-generated)"),
        mustChangePassword: z.boolean().optional().describe("Whether user must change password on first login")
      }).describe("User creation data"),
    },
    async ({ bearerToken, tenantId, userData }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const response = await client.post(
          `/users`,
          userData,
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
                  createdAt: response.createdAt,
                  temporaryPassword: response.temporaryPassword,
                  loginUrl: response.loginUrl,
                  welcomeEmailSent: response.welcomeEmailSent,
                  activationRequired: response.activationRequired,
                  activationToken: response.activationToken
                },
                message: "User created successfully"
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
                error: "Failed to create user",
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