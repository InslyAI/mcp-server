/**
 * Broker Payments Management Tools Registration
 * Financial operations and commission management for brokers
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerCreateBdxReportTool } from './create-bdx-report';
import { registerGetBdxReportTool } from './get-bdx-report';
import { registerGetPaymentDetailTool } from './get-payment-detail';
import { registerGetPaymentSuggestionTool } from './get-payment-suggestion';
import { registerListPaymentsPaginatedTool } from './list-payments-paginated';
import { registerListPaymentsByPayerTool } from './list-payments-by-payer';
import { registerGetLastRequestedPeriodTool } from './get-last-requested-period';

/**
 * Register all Broker Payments Management MCP tools
 * These tools handle broker commission payments, reports, and financial operations
 */
export function registerBrokerPaymentTools(server: McpServer) {
  registerCreateBdxReportTool(server);
  registerGetBdxReportTool(server);
  registerGetPaymentDetailTool(server);
  registerGetPaymentSuggestionTool(server);
  registerListPaymentsPaginatedTool(server);
  registerListPaymentsByPayerTool(server);
  registerGetLastRequestedPeriodTool(server);
}