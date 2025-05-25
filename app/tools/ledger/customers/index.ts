/**
 * Customer Management Tools Registration
 * Customer administration and data management tools
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerListCustomersTool } from './list-customers';
import { registerCreateCustomerTool } from './create-customer';
import { registerGetCustomerTool } from './get-customer';
import { registerUpdateCustomerTool } from './update-customer';
import { registerGetCustomerTotalsTool } from './get-customer-totals';
import { registerGetCustomerProfileTool } from './get-customer-profile';
import { registerGetCustomerHistoryTool } from './get-customer-history';
import { registerGetCustomerNotesTool } from './get-customer-notes';
import { registerDeleteCustomerNoteTool } from './delete-customer-note';

/**
 * Register all Customer Management MCP tools
 * These tools handle customer data, profiles, notes, and relationship management
 */
export function registerCustomerTools(server: McpServer) {
  registerListCustomersTool(server);
  registerCreateCustomerTool(server);
  registerGetCustomerTool(server);
  registerUpdateCustomerTool(server);
  registerGetCustomerTotalsTool(server);
  registerGetCustomerProfileTool(server);
  registerGetCustomerHistoryTool(server);
  registerGetCustomerNotesTool(server);
  registerDeleteCustomerNoteTool(server);
}