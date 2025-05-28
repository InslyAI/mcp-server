import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { createLedgerClient } from "../../client";

export function registerLedgerListBinderNamesTool(server: McpServer) {
  server.tool(
    "ledger_sales_binders_list",
    "Get list of binder names and IDs for dropdown/selection purposes. Returns simplified binder data optimized for UI components.",
    {
      bearerToken: z.string().describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header (e.g., 'accelerate')"),
      filterProduct: z.string().optional().describe("Filter binders by product"),
      filterStatus: z.array(z.string()).optional().describe("Filter by binder status (e.g., ['active'])"),
      filterBroker: z.string().optional().describe("Filter binders by broker"),
      selectedBinderId: z.string().optional().describe("Binder with this ID will be added to response"),
    },
    async ({ bearerToken, tenantId, filterProduct, filterStatus, filterBroker, selectedBinderId }) => {
      try {
        const client = createLedgerClient(bearerToken, tenantId);
        
        // Build query parameters
        const params = new URLSearchParams();
        if (filterProduct) params.set('filter[product]', filterProduct);
        if (filterStatus && filterStatus.length > 0) {
          filterStatus.forEach(status => params.append('filter[status][]', status));
        }
        if (filterBroker) params.set('filter[broker]', filterBroker);
        if (selectedBinderId) params.set('selectedBinderId', selectedBinderId);
        
        const queryString = params.toString();
        const endpoint = `/api/v1/ledger/sales/binders/list${queryString ? `?${queryString}` : ''}`;
        
        const response = await client.get(endpoint);
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                data: response,
                endpoint,
                filters: {
                  product: filterProduct,
                  status: filterStatus,
                  broker: filterBroker,
                  selectedBinderId
                },
                usage: "Use the 'value' field as binder ID and 'label' field for display names",
                relatedTools: {
                  fullDetails: "Use ledger_list_binders for complete binder information",
                  getSpecific: "Use ledger_get_binder with a specific binder ID"
                }
              }, null, 2)
            }
          ]
        };

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: false,
                error: errorMessage,
                endpoint: `/api/v1/ledger/sales/binders/list`,
                troubleshooting: {
                  authentication: "Verify bearerToken is valid (use identifier_login to get new token)",
                  tenant: "Ensure tenantId is correct (should be 'accelerate')",
                  network: "Check network access to https://accelerate.app.beta.insly.training",
                  permissions: "Verify user has access to binder data",
                  filters: "Check that filter values are valid for your tenant",
                  headers: "Ensure both Authorization and X-Tenant-ID headers are sent"
                },
                testCredentials: {
                  getToken: "identifier_login({ username: 'rasim.mehtijev@insly.com', password: '[password]', tenantTag: 'accelerate' })",
                  usageExample: "ledger_sales_binders_list"
                }
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}