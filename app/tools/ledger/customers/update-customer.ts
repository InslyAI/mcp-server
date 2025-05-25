/**
 * Update Customer Tool
 * Updates an existing customer's information
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../client";

export function registerUpdateCustomerTool(server: McpServer) {
  server.tool(
    "ledger_update_customer",
    "Update an existing customer's information",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      customerId: z.string().describe("ID of the customer to update"),
      customerData: z.object({
        firstName: z.string().optional().describe("Customer's first name"),
        lastName: z.string().optional().describe("Customer's last name"),
        email: z.string().email().optional().describe("Customer's email address"),
        phone: z.string().optional().describe("Customer's phone number"),
        mobilePhone: z.string().optional().describe("Customer's mobile phone number"),
        address: z.string().optional().describe("Customer's street address"),
        city: z.string().optional().describe("Customer's city"),
        state: z.string().optional().describe("Customer's state/province"),
        zipCode: z.string().optional().describe("Customer's ZIP/postal code"),
        country: z.string().optional().describe("Customer's country"),
        dateOfBirth: z.string().optional().describe("Customer's date of birth (YYYY-MM-DD)"),
        companyName: z.string().optional().describe("Company name for business customers"),
        customerType: z.string().optional().describe("Type of customer (individual, business, etc.)"),
        status: z.string().optional().describe("Customer status (active, inactive, etc.)"),
        taxId: z.string().optional().describe("Customer's tax identification number"),
        notes: z.string().optional().describe("Additional notes about the customer"),
        preferredCommunication: z.string().optional().describe("Preferred communication method"),
        languagePreference: z.string().optional().describe("Customer's language preference"),
        riskProfile: z.string().optional().describe("Customer's risk assessment profile")
      }).describe("Customer information to update")
    },
    async ({ bearerToken, tenantId, customerId, customerData }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const response = await client.put(`/api/v1/ledger/customers/${customerId}`, customerData);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                message: "Customer updated successfully",
                customer: response.data
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
                error: "Failed to update customer",
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