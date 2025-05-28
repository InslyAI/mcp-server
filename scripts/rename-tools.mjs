#!/usr/bin/env node

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ledgerDir = join(__dirname, '../app/tools/ledger');

// Mapping of directory paths to API prefixes
const pathMapping = {
  'sales/binders': 'ledger_sales_binders_',
  'sales/quotes': 'ledger_sales_quotes_',
  'sales/endorsements': 'ledger_sales_endorsements_',
  'sales/e-proposals': 'ledger_sales_e_proposals_',
  'sales/features': 'ledger_sales_features_',
  'sales/high-risk': 'ledger_sales_high_risk_',
  'sales/ireland-lookup': 'ledger_sales_lookup_ireland_',
  'sales/policies/calculations': 'ledger_sales_policies_calculations_',
  'sales/policies/documents': 'ledger_sales_policies_documents_',
  'sales/policies/information': 'ledger_sales_policies_information_',
  'sales/policies/lifecycle': 'ledger_sales_policies_lifecycle_',
  'sales/policies/referrals': 'ledger_sales_policies_referrals_',
  'schemes/actions': 'ledger_schemes_actions_',
  'schemes/features': 'ledger_schemes_features_',
  'schemes/mta-renewal': 'ledger_schemes_mta_renewal_',
  'schemes/policy': 'ledger_schemes_policy_',
  'schemes/regular': 'ledger_schemes_regular_',
  'policies/documents': 'ledger_policies_documents_',
  'brokers': 'ledger_brokers_',
  'broker-payments': 'ledger_broker_payments_',
  'chat': 'ledger_chat_',
  'consolidated-invoices': 'ledger_consolidated_invoices_',
  'customers': 'ledger_customers_',
  'dashboards': 'ledger_dashboards_',
  'debt-policies': 'ledger_debt_policies_',
  'documents': 'ledger_documents_',
  'excel-calculator': 'ledger_excel_calculator_',
  'invoices': 'ledger_invoices_',
  'reinsurance': 'ledger_reinsurance_',
  'reports': 'ledger_reports_',
  'requests': 'ledger_requests_',
  'search': 'ledger_search_',
  'users': 'ledger_users_'
};

// Action mapping - extract action from filename
function getActionFromFilename(filename) {
  // Remove .ts extension
  const base = filename.replace('.ts', '');
  
  // Common action patterns
  if (base.startsWith('create-')) return 'create';
  if (base.startsWith('get-')) return 'get';
  if (base.startsWith('list-')) return 'list';
  if (base.startsWith('update-')) return 'update';
  if (base.startsWith('delete-')) return 'delete';
  if (base.startsWith('generate-')) return 'generate';
  if (base.startsWith('manage-')) return 'manage';
  if (base.startsWith('calculate-')) return 'calculate';
  if (base.startsWith('issue-')) return 'issue';
  if (base.startsWith('approve-')) return 'approve';
  if (base.startsWith('submit-')) return 'submit';
  if (base.startsWith('schedule-')) return 'schedule';
  if (base.startsWith('upload-')) return 'upload';
  if (base.startsWith('renew-')) return 'renew';
  if (base.startsWith('bind-')) return 'bind';
  if (base.startsWith('unbind-')) return 'unbind';
  if (base.startsWith('copy-')) return 'copy';
  if (base.startsWith('decline-')) return 'decline';
  if (base.startsWith('escalate-')) return 'escalate';
  if (base.startsWith('revert-')) return 'revert';
  if (base.startsWith('terminate-')) return 'terminate';
  if (base.startsWith('track-')) return 'track';
  if (base.startsWith('search-')) return 'search';
  if (base.startsWith('send-')) return 'send';
  if (base.startsWith('import-')) return 'import';
  
  // Special cases
  if (base.includes('address-lookup')) return 'address_lookup';
  if (base.includes('multi-search')) return 'multi_search';
  if (base.includes('bdx')) return 'bdx';
  
  // Fallback - use the filename as is but replace hyphens with underscores
  return base.replace(/-/g, '_');
}

function processFile(filePath, relativePath) {
  try {
    const content = readFileSync(filePath, 'utf8');
    
    // Skip if no server.tool registration
    if (!content.includes('server.tool(')) {
      return;
    }
    
    // Find the path key for this file
    const pathKey = Object.keys(pathMapping).find(key => 
      relativePath.startsWith(key)
    );
    
    if (!pathKey) {
      console.log(`No mapping found for path: ${relativePath}`);
      return;
    }
    
    const prefix = pathMapping[pathKey];
    const filename = relativePath.split('/').pop();
    const action = getActionFromFilename(filename);
    const newToolName = prefix + action;
    
    // Find and replace tool names
    const toolNameRegex = /"ledger_[^"]+"/g;
    const matches = content.match(toolNameRegex);
    
    if (matches) {
      let newContent = content;
      matches.forEach(match => {
        const oldName = match.slice(1, -1); // Remove quotes
        console.log(`Renaming ${oldName} -> ${newToolName} in ${relativePath}`);
        newContent = newContent.replace(match, `"${newToolName}"`);
      });
      
      // Also update descriptions to include category context
      if (newContent !== content) {
        writeFileSync(filePath, newContent);
        console.log(`Updated: ${filePath}`);
      }
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

function walkDirectory(dir, baseDir = dir) {
  const files = readdirSync(dir);
  
  for (const file of files) {
    const fullPath = join(dir, file);
    const stat = statSync(fullPath);
    
    if (stat.isDirectory()) {
      walkDirectory(fullPath, baseDir);
    } else if (file.endsWith('.ts') && file !== 'index.ts' && file !== 'client.ts' && file !== 'types.ts') {
      const relativePath = fullPath.replace(baseDir + '/', '');
      processFile(fullPath, relativePath);
    }
  }
}

console.log('Starting tool renaming process...');
walkDirectory(ledgerDir);
console.log('Tool renaming complete!');