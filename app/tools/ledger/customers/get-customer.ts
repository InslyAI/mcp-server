/**
 * Get Customer Tool
 * Retrieves detailed information about a specific customer
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../client";

export function registerGetCustomerTool(server: McpServer) {
  server.tool(
    "ledger_get_customer",
    "Get detailed information about a specific customer by ID",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      customerId: z.string().describe("ID of the customer to retrieve"),
    },
    async ({ bearerToken, tenantId, customerId }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const response = await client.get(`/api/v1/ledger/customers/${customerId}`);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                customer: {
                  id: response.id,
                  firstName: response.firstName,
                  lastName: response.lastName,
                  fullName: response.fullName,
                  email: response.email,
                  phone: response.phone,
                  mobilePhone: response.mobilePhone,
                  address: response.address,
                  city: response.city,
                  state: response.state,
                  zipCode: response.zipCode,
                  country: response.country,
                  dateOfBirth: response.dateOfBirth,
                  companyName: response.companyName,
                  customerType: response.customerType,
                  status: response.status,
                  taxId: response.taxId,
                  notes: response.notes,
                  createdAt: response.createdAt,
                  updatedAt: response.updatedAt,
                  lastActivityDate: response.lastActivityDate,
                  preferredCommunication: response.preferredCommunication,
                  languagePreference: response.languagePreference,
                  riskProfile: response.riskProfile,
                  creditRating: response.creditRating,
                  totalPolicies: response.totalPolicies,
                  activePolicies: response.activePolicies,
                  totalPremium: response.totalPremium,
                  outstandingBalance: response.outstandingBalance
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
                error: "Failed to retrieve customer",
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