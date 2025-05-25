/**
 * Create Customer Tool
 * Creates a new customer in the system
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../client";

export function registerCreateCustomerTool(server: McpServer) {
  server.tool(
    "ledger_create_customer",
    "Create a new customer with the provided information",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      customerData: z.object({
        firstName: z.string().optional().describe("Customer's first name"),
        lastName: z.string().optional().describe("Customer's last name"),
        email: z.string().email().optional().describe("Customer's email address"),
        phone: z.string().optional().describe("Customer's phone number"),
        address: z.string().optional().describe("Customer's address"),
        dateOfBirth: z.string().optional().describe("Customer's date of birth (YYYY-MM-DD)"),
        companyName: z.string().optional().describe("Company name for business customers"),
        customerType: z.string().optional().describe("Type of customer (individual, business, etc.)"),
        notes: z.string().optional().describe("Additional notes about the customer")
      }).describe("Customer information to create")
    },
    async ({ bearerToken, tenantId, customerData }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const response = await client.post("/api/v1/ledger/customers", customerData);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                message: "Customer created successfully",
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
                error: "Failed to create customer",
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