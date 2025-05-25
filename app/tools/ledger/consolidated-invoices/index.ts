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
import { registerGetAvailableInvoicesTool } from './get-available-invoices';
import { registerAddRemoveInvoiceTool } from './add-remove-invoice';
import { registerIssueConsolidatedInvoiceTool } from './issue-consolidated-invoice';
import { registerGetInvoiceDocumentsTool } from './get-invoice-documents';
import { registerCreateCreditNoteTool } from './create-credit-note';

/**
 * Register all Consolidated Invoices Management MCP tools
 * These tools handle invoice consolidation, billing, and financial operations
 */
export function registerConsolidatedInvoiceTools(server: McpServer) {
  // Core invoice management (5 tools)
  registerListConsolidatedInvoiceBrokersTool(server);
  registerListConsolidatedInvoicesTool(server);
  registerCreateConsolidatedInvoiceTool(server);
  registerGetConsolidatedInvoiceTool(server);
  registerManageConsolidatedInvoiceItemsTool(server);
  
  // Advanced invoice operations (5 tools)
  registerGetAvailableInvoicesTool(server);
  registerAddRemoveInvoiceTool(server);
  registerIssueConsolidatedInvoiceTool(server);
  registerGetInvoiceDocumentsTool(server);
  registerCreateCreditNoteTool(server);
}