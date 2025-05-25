/**
 * Consolidated Invoices Management Tools Registration
 * Invoice consolidation and billing management tools
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerListConsolidatedInvoiceBrokersTool } from './list-brokers';
import { registerListConsolidatedInvoicesTool } from './list-consolidated-invoices';
import { registerCreateConsolidatedInvoiceTool } from './create-consolidated-invoice';
import { registerGetConsolidatedInvoiceTool } from './get-consolidated-invoice';
import { registerManageConsolidatedInvoiceItemsTool } from './manage-invoices';

/**
 * Register all Consolidated Invoices Management MCP tools
 * These tools handle invoice consolidation, billing, and financial operations
 */
export function registerConsolidatedInvoiceTools(server: McpServer) {
  registerListConsolidatedInvoiceBrokersTool(server);
  registerListConsolidatedInvoicesTool(server);
  registerCreateConsolidatedInvoiceTool(server);
  registerGetConsolidatedInvoiceTool(server);
  registerManageConsolidatedInvoiceItemsTool(server);
}