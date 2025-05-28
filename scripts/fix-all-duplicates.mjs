#!/usr/bin/env node

import { readFile, writeFile } from 'fs/promises';

// Mapping of files to their correct unique tool names
const toolNameFixes = [
  // Broker Payments duplicates
  { file: 'broker-payments/get-bdx-report.ts', newName: 'ledger_broker_payments_bdx_get' },
  { file: 'broker-payments/get-last-requested-period.ts', newName: 'ledger_broker_payments_period_get' },
  { file: 'broker-payments/get-payment-suggestion.ts', newName: 'ledger_broker_payments_suggestion_get' },
  // get-payment-detail.ts keeps 'ledger_broker_payments_get'
  
  { file: 'broker-payments/list-payments-by-payer.ts', newName: 'ledger_broker_payments_by_payer_list' },
  // list-payments-paginated.ts keeps 'ledger_broker_payments_list'
  
  // Consolidated Invoices duplicates
  { file: 'consolidated-invoices/create-credit-note.ts', newName: 'ledger_consolidated_invoices_credit_note_create' },
  // create-consolidated-invoice.ts keeps 'ledger_consolidated_invoices_create'
  
  { file: 'consolidated-invoices/get-available-invoices.ts', newName: 'ledger_consolidated_invoices_available_get' },
  { file: 'consolidated-invoices/get-invoice-documents.ts', newName: 'ledger_consolidated_invoices_documents_get' },
  // get-consolidated-invoice.ts keeps 'ledger_consolidated_invoices_get'
  
  { file: 'consolidated-invoices/list-brokers.ts', newName: 'ledger_consolidated_invoices_brokers_list' },
  // list-consolidated-invoices.ts keeps 'ledger_consolidated_invoices_list'
  
  // Sales Features duplicates
  { file: 'sales/features/get-product-features.ts', newName: 'ledger_sales_features_product_get' },
  { file: 'sales/features/get-tenant-features.ts', newName: 'ledger_sales_features_tenant_get' },
  // get-specific-feature.ts keeps 'ledger_sales_features_get'
  
  // Sales Policies Calculations duplicates
  { file: 'sales/policies/calculations/calculate-policy-debug.ts', newName: 'ledger_sales_policies_calculations_debug_calculate' },
  // calculate-policy.ts keeps 'ledger_sales_policies_calculations_calculate'
  
  { file: 'sales/policies/calculations/manage-policy-packages.ts', newName: 'ledger_sales_policies_calculations_packages_manage' },
  // manage-policy-calculations.ts keeps 'ledger_sales_policies_calculations_manage'
  
  // Sales Policies Information duplicates
  { file: 'sales/policies/information/manage-policy-events.ts', newName: 'ledger_sales_policies_information_events_manage' },
  // manage-policy-actions.ts keeps 'ledger_sales_policies_information_manage'
  
  // Sales Policies Lifecycle duplicates
  { file: 'sales/policies/lifecycle/create-mta.ts', newName: 'ledger_sales_policies_lifecycle_mta_create' },
  // create-external-policy.ts keeps 'ledger_sales_policies_lifecycle_create'
  
  // Schemes Actions duplicates
  { file: 'schemes/actions/get-action-ui-schema.ts', newName: 'ledger_schemes_actions_ui_get' },
  // get-action-schema.ts keeps 'ledger_schemes_actions_get'
  
  // Schemes Features duplicates
  { file: 'schemes/features/get-feature-ui-schema.ts', newName: 'ledger_schemes_features_ui_get' },
  // get-feature-schema.ts keeps 'ledger_schemes_features_get'
  
  // Schemes MTA Renewal duplicates
  { file: 'schemes/mta-renewal/get-mta-renewal-ui-schema.ts', newName: 'ledger_schemes_mta_renewal_ui_get' },
  // get-mta-renewal-schema.ts keeps 'ledger_schemes_mta_renewal_get'
  
  // Schemes Regular duplicates (4 files)
  { file: 'schemes/regular/get-renewal-schema.ts', newName: 'ledger_schemes_regular_renewal_get' },
  { file: 'schemes/regular/get-renewal-ui-schema.ts', newName: 'ledger_schemes_regular_renewal_ui_get' },
  { file: 'schemes/regular/get-schema-products.ts', newName: 'ledger_schemes_regular_products_get' },
  // get-regular-schema.ts keeps 'ledger_schemes_regular_get'
];

async function fixDuplicateToolName(file, newName) {
  const fullPath = `/Users/ai/Github/mcp-server-1/app/tools/ledger/${file}`;
  
  try {
    const content = await readFile(fullPath, 'utf-8');
    
    // Find and replace the tool name in server.tool() call
    const updatedContent = content.replace(
      /server\.tool\(\s*(['"`])ledger_[^'"`]+\1,/,
      `server.tool(\n    "${newName}",`
    );
    
    if (content !== updatedContent) {
      await writeFile(fullPath, updatedContent, 'utf-8');
      console.log(`✅ Updated: ${file} -> ${newName}`);
      return true;
    } else {
      console.log(`⚠️  No change: ${file}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error: ${file} - ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🔧 Fixing all duplicate tool names...\n');
  
  let fixedCount = 0;
  
  for (const fix of toolNameFixes) {
    const success = await fixDuplicateToolName(fix.file, fix.newName);
    if (success) fixedCount++;
  }
  
  console.log(`\n✅ Fixed ${fixedCount} duplicate tool names out of ${toolNameFixes.length} total fixes.`);
  console.log('\n🔄 Run the duplicate finder script again to verify all duplicates are resolved.');
}

main().catch(console.error);