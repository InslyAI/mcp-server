/**
 * Ledger MCP Tools Registration
 * Business operations tools for Insly Ledger service
 * 
 * NEW ORGANIZATION: Tools now organized by API path structure
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// Sales API tools (organized by /api/v1/ledger/sales/*)
import { registerSalesTools } from "./sales";

// Direct Policies API tools (organized by /api/v1/ledger/policies/*)
import { registerPolicyTools } from "./policies";

// Schemes API tools (organized by /api/v1/ledger/schemes/*)
import { registerSchemeTools } from "./schemes";

// Other API categories (flat structure)
import { registerDocumentTools } from "./documents";
import { registerDashboardTools } from "./dashboards";
import { registerReportTools } from "./reports";
import { registerUserTools } from "./users";
import { registerCustomerTools } from "./customers";
import { registerBrokerPaymentTools } from "./broker-payments";
import { registerConsolidatedInvoiceTools } from "./consolidated-invoices";
import { registerDebtPolicyTools } from "./debt-policies";
import { registerReinsuranceTools } from "./reinsurance";
import { registerSearchTools } from "./search";
import { registerRequestTrackingTools } from "./requests";
import { registerBrokerManagementTools } from "./brokers";
import { registerExcelCalculatorTools } from "./excel-calculator";
import { registerInvoiceFilesTools } from "./invoices";
import { registerChatSettingsTools } from "./chat";

/**
 * Register all Ledger MCP tools
 * These tools handle business operations with Insly Ledger service
 * 
 * NEW ORGANIZATION: Tools organized by API path structure
 * TOTAL IMPLEMENTATION: 158+ Ledger tools (Complete API Coverage!)
 */
export function registerLedgerTools(server: McpServer) {
  // Sales API tools (/api/v1/ledger/sales/* - 60+ tools) 
  registerSalesTools(server);
  
  // Direct Policies API tools (/api/v1/ledger/policies/* - 19 tools)
  registerPolicyTools(server);
  
  // Schemes API tools (/api/v1/ledger/schemes/* - 17 tools)
  registerSchemeTools(server);
  
  // Remaining API categories (flat structure)
  registerCustomerTools(server);               // Customer management (11 tools)
  registerConsolidatedInvoiceTools(server);    // Invoice consolidation (9 tools)
  registerDashboardTools(server);              // Business intelligence (5 tools)
  registerBrokerPaymentTools(server);          // Payment processing (7 tools)
  registerReportTools(server);                 // Business reporting (5 tools)
  registerBrokerManagementTools(server);       // Broker administration (3 tools)
  registerReinsuranceTools(server);            // Reinsurance management (2 tools)
  registerDocumentTools(server);               // Document generation (remaining tools)
  registerExcelCalculatorTools(server);        // Calculator management (2 tools)
  registerInvoiceFilesTools(server);           // Invoice file operations (2 tools)
  registerSearchTools(server);                 // Universal search (1 tool)
  registerRequestTrackingTools(server);        // Request status tracking (1 tool)
  registerDebtPolicyTools(server);             // Debt policies (1 tool)
  registerUserTools(server);                   // User management (1 tool)
  registerChatSettingsTools(server);           // Chat configuration (1 tool)
  
  // 🎯 COMPLETE COVERAGE: 158+ Ledger tools implemented!
  // ✅ 100% LEDGER API COVERAGE ACHIEVED
  // ✅ REORGANIZED BY API PATH STRUCTURE
  // ✅ IMPROVED MAINTAINABILITY AND NAVIGATION
  // ✅ PRODUCTION READY WITH ALL TOOLS ENABLED
}