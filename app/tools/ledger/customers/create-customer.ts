/**
 * Create Customer Tool
 * Creates a new customer in the system
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createLedgerClient } from "../client";

export function registerCreateCustomerTool(server: McpServer) {
  server.tool(
    "ledger_customers_create",
    "Create new customer record with personal/business details, contact information, and insurance history",
    {
      bearerToken: z.string().min(1).describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      customerData: z.object({
        firstName: z.string().min(1).max(100).optional().describe("Customer's first name (1-100 characters)"),
        lastName: z.string().min(1).max(100).optional().describe("Customer's last name (1-100 characters)"),
        email: z.string().email().optional().describe("Customer's email address"),
        phone: z.string().regex(/^[\+]?[0-9\s\-\(\)]{7,15}$/).optional().describe("Customer's phone number (international format)"),
        address: z.string().optional().describe("Customer's address"),
        dateOfBirth: z.string().optional().describe("Customer's date of birth (YYYY-MM-DD)"),
        companyName: z.string().min(1).max(200).optional().describe("Company name for business customers (1-200 characters)"),
        customerType: z.string().optional().describe("Type of customer (individual, business, etc.)"),
        notes: z.string().optional().describe("Additional notes about the customer")
      }).describe("Customer information to create")
    },
    async ({ bearerToken, tenantId, customerData }) => {
      try {
        const client = createLedgerClient(bearerToken, tenantId);
        
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