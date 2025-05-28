import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerBasicClaimsTools } from './basic/index';
import { registerDocumentsTools } from './documents/index';
import { registerCommentsTools } from './comments/index';
import { registerAlarmsTools } from './alarms/index';
import { registerReservesTools } from './reserves/index';
import { registerDecisionsTools } from './decisions/index';
import { registerPaymentDecisionsTools } from './payment-decisions/index';

/**
 * Register all claims-related tools
 * Total: 41 tools across 7 categories
 * 
 * Categories:
 * - Basic Operations (6 tools): CRUD, amounts, events
 * - Documents (8 tools): upload, download, generate, render
 * - Comments (4 tools): CRUD operations for notes
 * - Alarms (3 tools): list, update, poll unnoted
 * - Reserves (9 tools): financial reserves management, decisions
 * - Decisions (6 tools): indemnity decisions workflow and management
 * - Payment Decisions (5 tools): payment workflow and processing
 */
export function registerClaimsTools(server: McpServer) {
  registerBasicClaimsTools(server);
  registerDocumentsTools(server);
  registerCommentsTools(server);
  registerAlarmsTools(server);
  registerReservesTools(server);
  registerDecisionsTools(server);
  registerPaymentDecisionsTools(server);
}