import { createLedgerClient } from "../client";
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerGetQuoteTools(server: McpServer) {
  server.tool(
    "ledger_get_quote",
    "Get detailed information about a specific quote by ID including all quote data and metadata",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header (e.g., 'accelerate')"),
      quoteId: z.string().describe("Unique identifier of the quote to retrieve"),
      withNotifications: z.boolean().optional().describe("Include warnings, errors and status notifications (default: true)"),
      acceptLanguage: z.string().optional().describe("Accept-Language header (e.g., 'en-US', 'et-EE')"),
    },
    async ({ bearerToken, tenantId, quoteId, withNotifications, acceptLanguage }) => {
      try {
        const client = createLedgerClient(bearerToken, tenantId);
        
        const params = new URLSearchParams();
        if (withNotifications !== undefined) {
          params.set('withNotifications', withNotifications.toString());
        } else {
          params.set('withNotifications', 'true'); // Default to true as per API docs
        }
        
        const queryString = params.toString();
        const endpoint = `/api/v1/ledger/sales/policies/${quoteId}${queryString ? `?${queryString}` : ''}`;
        
        // Add Accept-Language header if provided
        const headers = acceptLanguage ? { 'Accept-Language': acceptLanguage } : undefined;
        const response = await fetch(`https://${tenantId}.app.beta.insly.training${endpoint}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${bearerToken}`,
            'X-Tenant-ID': tenantId,
            'Accept': 'application/json',
            ...headers,
          }
        });

        if (!response.ok) {
          throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                quote: data,
                meta: {
                  quoteId,
                  retrievedAt: new Date().toISOString(),
                  withNotifications: withNotifications ?? true,
                  schemaPath: data.meta?.schemaPath,
                },
                relatedTools: {
                  update: "Use ledger_update_quote to modify this quote",
                  calculate: "Use ledger_calculate_quote to calculate premiums",
                  issue: "Use ledger_issue_quote to convert to policy",
                  copy: "Use ledger_copy_quote to create a copy"
                }
              }, null, 2)
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred',
                quoteId,
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}