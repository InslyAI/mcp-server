/**
 * Delete Customer Note Tool
 * Deletes a specific note associated with a customer
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LedgerClient } from "../client";

export function registerDeleteCustomerNoteTool(server: McpServer) {
  server.tool(
    "ledger_delete_customer_note",
    "Delete a specific note associated with a customer by note ID",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      customerId: z.string().describe("ID of the customer who owns the note"),
      noteId: z.string().describe("ID of the note to delete"),
      reason: z.string().optional().describe("Reason for deleting the note (for audit purposes)")
    },
    async ({ bearerToken, tenantId, customerId, noteId, reason }) => {
      try {
        const client = new LedgerClient(bearerToken, tenantId);
        
        const deleteData = reason ? { reason } : undefined;
        
        const response = await client.delete(`/api/v1/ledger/customers/${customerId}/notes/${noteId}`, deleteData);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                message: "Customer note deleted successfully",
                customerId: customerId,
                noteId: noteId,
                deletionReason: reason || null,
                deletedAt: new Date().toISOString()
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
                error: "Failed to delete customer note",
                details: error.message,
                statusCode: error.status,
                customerId: customerId,
                noteId: noteId
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}