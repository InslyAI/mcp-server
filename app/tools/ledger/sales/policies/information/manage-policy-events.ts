/**
 * Manage Policy Events Tool
 * Handles policy events and event management
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createLedgerClient } from "../../../client";

export function registerManagePolicyEventsTool(server: McpServer) {
  server.tool(
    "ledger_sales_policies_information_manage",
    "Manage policy events including listing, creating, and retrieving specific events",
    {
      bearerToken: z.string().min(1).describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      policyId: z.string().min(1).describe("ID of the policy to manage events for"),
      action: z.enum(["list", "get", "create"]).describe("Action to perform on policy events"),
      eventId: z.string().optional().describe("Event ID for get action"),
      eventData: z.object({
        eventType: z.string().optional().describe("Type of event to create"),
        eventDescription: z.string().optional().describe("Description of the event"),
        eventDate: z.string().optional().describe("Date of the event (YYYY-MM-DD)"),
        eventDetails: z.record(z.any()).optional().describe("Additional event details"),
        severity: z.string().optional().describe("Event severity level"),
        category: z.string().optional().describe("Event category")
      }).optional().describe("Event data for create action")
    },
    async ({ bearerToken, tenantId, policyId, action, eventId, eventData }) => {
      try {
        const client = createLedgerClient(bearerToken, tenantId);
        
        let endpoint;
        let response;

        switch (action) {
          case "list":
            endpoint = `/api/v1/ledger/sales/policies/${policyId}/events`;
            response = await client.get(endpoint);
            break;
          case "get":
            if (!eventId) throw new Error("eventId is required for get action");
            endpoint = `/api/v1/ledger/sales/policies/${policyId}/events/${eventId}`;
            response = await client.get(endpoint);
            break;
          case "create":
            endpoint = `/api/v1/ledger/sales/policies/${policyId}/events`;
            response = await client.post(endpoint, eventData || {});
            break;
        }

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                policyId: policyId,
                action: action,
                eventId: eventId,
                result: response,
                eventData: eventData
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
                error: "Failed to manage policy events",
                details: error.message,
                statusCode: error.status,
                policyId: policyId,
                action: action
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}