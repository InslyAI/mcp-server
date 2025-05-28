#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';

// Common name fixes for duplicate tool names
const nameFixes = [
  // Sales policies information
  {
    file: 'sales/policies/information/get-policy.ts',
    oldName: 'ledger_sales_policies_information_get',
    newName: 'ledger_sales_policies_get'
  },
  {
    file: 'sales/policies/information/get-policy-links.ts',
    oldName: 'ledger_sales_policies_information_get',
    newName: 'ledger_sales_policies_get_links'
  },
  {
    file: 'sales/policies/information/get-policy-customer.ts',
    oldName: 'ledger_sales_policies_information_get',
    newName: 'ledger_sales_policies_get_customer'
  },
  {
    file: 'sales/policies/information/get-policy-changes.ts',
    oldName: 'ledger_sales_policies_information_get',
    newName: 'ledger_sales_policies_get_changes'
  },
  {
    file: 'sales/policies/information/get-installments-schedule.ts',
    oldName: 'ledger_sales_policies_information_get',
    newName: 'ledger_sales_policies_get_installments'
  },
  
  // Schemes policy tools
  {
    file: 'schemes/policy/get-policy-object-types.ts',
    oldName: 'ledger_schemes_policy_get',
    newName: 'ledger_schemes_policy_get_object_types'
  },
  {
    file: 'schemes/policy/get-policy-products.ts',
    oldName: 'ledger_schemes_policy_get',
    newName: 'ledger_schemes_policy_get_products'
  },
  {
    file: 'schemes/policy/get-policy-insurers.ts',
    oldName: 'ledger_schemes_policy_get',
    newName: 'ledger_schemes_policy_get_insurers'
  },
  {
    file: 'schemes/policy/get-policy-termination-schema.ts',
    oldName: 'ledger_schemes_policy_get',
    newName: 'ledger_schemes_policy_get_termination_schema'
  },
  {
    file: 'schemes/policy/get-policy-termination-ui-schema.ts',
    oldName: 'ledger_schemes_policy_get',
    newName: 'ledger_schemes_policy_get_termination_ui_schema'
  },
  
  // Broker tools
  {
    file: 'brokers/get-broker-short-names.ts',
    oldName: 'ledger_brokers_get',
    newName: 'ledger_brokers_get_short_names'
  },
  {
    file: 'brokers/get-broker-policies-count.ts',
    oldName: 'ledger_brokers_get',
    newName: 'ledger_brokers_get_policies_count'
  },
  
  // Other duplicates that need specific names
  {
    file: 'dashboards/get-policies-renewal-products.ts',
    oldName: 'ledger_dashboards_get',
    newName: 'ledger_dashboards_get_policies_renewal_products'
  },
  {
    file: 'dashboards/get-renewal-products.ts',
    oldName: 'ledger_dashboards_get',
    newName: 'ledger_dashboards_get_renewal_products'
  },
  {
    file: 'documents/get-document-types.ts',
    oldName: 'ledger_documents_get',
    newName: 'ledger_documents_get_types'
  }
];

const baseDir = '/Users/ai/Github/mcp-server-1/app/tools/ledger/';

nameFixes.forEach(fix => {
  const filePath = baseDir + fix.file;
  try {
    let content = readFileSync(filePath, 'utf8');
    
    if (content.includes(fix.oldName)) {
      content = content.replace(`"${fix.oldName}"`, `"${fix.newName}"`);
      writeFileSync(filePath, content);
      console.log(`Fixed: ${fix.file} - ${fix.oldName} -> ${fix.newName}`);
    }
  } catch (error) {
    console.error(`Error processing ${fix.file}:`, error.message);
  }
});

console.log('Duplicate name fixes complete!');