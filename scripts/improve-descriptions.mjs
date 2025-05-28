#!/usr/bin/env node

import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

// Description improvements based on MCP best practices audit
const descriptionImprovements = [
  // Remove redundant prefixes
  {
    pattern: /^This tool allows you to /,
    replacement: ''
  },
  {
    pattern: /^Use this to /,
    replacement: ''
  },
  {
    pattern: /^Use this tool to /,
    replacement: ''
  },
  
  // Specific tool improvements
  {
    old: 'Get JSON schema for specific action types in the system',
    new: 'Retrieve JSON schema definitions for configuring specific action types and validation rules'
  },
  {
    old: 'Get simple list of system users with filtering and search options',
    new: 'List system users with role-based filtering, search capabilities, and broker associations'
  },
  {
    old: 'Create a new customer with the provided information',
    new: 'Create new customer record with personal/business details, contact information, and insurance history'
  },
  {
    old: 'Create a new consolidated invoice for multiple individual invoices',
    new: 'Create consolidated invoice combining multiple individual invoices for broker commission management'
  },
  {
    old: 'Generate a policy document of a specific type. The document is generated based on the policy data and returns binary content',
    new: 'Generate policy documents (certificates, wordings, quotes) in PDF/Word format for customer delivery and compliance'
  },
  {
    old: 'Generate a quote document of a specific type. The document is generated based on the quote data and returns binary content',
    new: 'Generate quote documents (proposals, summaries, comparisons) in PDF/Word format for client presentation'
  },
  {
    old: 'Get detailed information about a specific broker payment including commissions and breakdowns',
    new: 'Retrieve broker payment details including commission calculations, tax breakdowns, and payment schedules'
  },
  {
    old: 'Get dashboard data for policies that are eligible for renewal and don\'t have renewed policies issued yet',
    new: 'Retrieve renewal pipeline dashboard showing policies expiring within specified timeframe for campaign management'
  },
  {
    old: 'Upload one or more files to a quote. Files are attached as supporting documents',
    new: 'Upload supporting documents (PDFs, images, spreadsheets) to quote for underwriting review and compliance'
  },
  {
    old: 'Upload one or more files to a policy. Files are attached as supporting documents',
    new: 'Upload supporting documents (PDFs, images, spreadsheets) to policy for compliance and record-keeping'
  },
  {
    old: 'Get detailed information about a specific binder including its configuration and terms',
    new: 'Retrieve binder details including coverage terms, pricing structure, and binding authority limits'
  },
  {
    old: 'Calculate premium, taxes, and fees for a new policy based on risk data and coverage selections',
    new: 'Calculate policy premium, taxes, fees, and commissions based on risk assessment and coverage selections'
  },
  {
    old: 'Calculate premium, taxes, and fees for a quote based on risk data and coverage selections',
    new: 'Calculate quote premium, taxes, fees, and commissions based on risk assessment and coverage selections'
  },
  {
    old: 'Get comprehensive customer data including personal details, address, and insurance history',
    new: 'Retrieve comprehensive customer profile including personal details, contact information, policy history, and risk profile'
  },
  {
    old: 'Get all notifications for a user with filtering options for read/unread status',
    new: 'List user notifications with filtering by type, status, and priority for inbox management'
  },
  {
    old: 'Create a new audit entry to track important business events and compliance requirements',
    new: 'Create audit entry for compliance tracking, regulatory reporting, and business event documentation'
  },
  {
    old: 'Get compliance report data for regulatory reporting and audit purposes',
    new: 'Generate compliance reports for regulatory submissions, audit trails, and governance requirements'
  },
  {
    old: 'Track data access events for compliance and security monitoring',
    new: 'Log data access events for GDPR compliance, security monitoring, and audit trail requirements'
  },
  {
    old: 'Get configuration settings for chat and communication features',
    new: 'Retrieve chat configuration including notification settings, auto-responses, and integration parameters'
  },
  {
    old: 'Execute an automated workflow process with specified parameters and context',
    new: 'Execute automated business workflow for policy processing, document generation, or data synchronization'
  },
  {
    old: 'Monitor workflow execution status and track progress of automated processes',
    new: 'Track workflow execution status, completion rates, and error handling for process monitoring'
  },
  {
    old: 'Get insurance scheme configuration including products, coverage options, and pricing rules',
    new: 'Retrieve insurance product scheme configuration including coverage options, pricing rules, and underwriting criteria'
  }
];

async function getAllTsFiles(dir, files = []) {
  const items = await readdir(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = join(dir, item.name);
    
    if (item.isDirectory()) {
      await getAllTsFiles(fullPath, files);
    } else if (item.isFile() && item.name.endsWith('.ts') && !item.name.includes('index.ts')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

function improveDescription(description) {
  let improved = description;
  
  // Apply pattern-based improvements first
  for (const improvement of descriptionImprovements) {
    if (improvement.pattern) {
      improved = improved.replace(improvement.pattern, improvement.replacement);
    } else if (improvement.old && improved === improvement.old) {
      improved = improvement.new;
    }
  }
  
  // Capitalize first letter after pattern replacements
  improved = improved.charAt(0).toUpperCase() + improved.slice(1);
  
  return improved;
}

async function processFile(filePath) {
  try {
    const content = await readFile(filePath, 'utf-8');
    
    // Extract current description from server.tool() call
    // Pattern: server.tool("toolname", "description", {
    const descriptionMatch = content.match(/server\.tool\(\s*['"`][^'"`]+['"`],\s*['"`]([^'"`]+)['"`]/);
    if (!descriptionMatch) {
      console.log(`⚠️  No description found in: ${filePath}`);
      return { updated: false };
    }
    
    const originalDescription = descriptionMatch[1];
    const improvedDescription = improveDescription(originalDescription);
    
    if (originalDescription !== improvedDescription) {
      // Replace the description in the file
      const updatedContent = content.replace(
        /server\.tool\(\s*['"`]([^'"`]+)['"`],\s*['"`][^'"`]+['"`]/,
        `server.tool(\n    "$1",\n    "${improvedDescription}"`
      );
      
      await writeFile(filePath, updatedContent, 'utf-8');
      
      return {
        updated: true,
        file: filePath,
        old: originalDescription,
        new: improvedDescription
      };
    }
    
    return { updated: false };
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return { updated: false, error: error.message };
  }
}

async function main() {
  const ledgerDir = '/Users/ai/Github/mcp-server-1/app/tools/ledger';
  
  console.log('🔍 Finding all TypeScript tool files...');
  const tsFiles = await getAllTsFiles(ledgerDir);
  console.log(`📁 Found ${tsFiles.length} tool files to process\n`);
  
  const results = [];
  let updateCount = 0;
  
  for (const file of tsFiles) {
    const result = await processFile(file);
    
    if (result.updated) {
      updateCount++;
      results.push(result);
      console.log(`✅ Updated: ${file.replace('/Users/ai/Github/mcp-server-1/app/tools/ledger/', '')}`);
      console.log(`   Old: "${result.old}"`);
      console.log(`   New: "${result.new}"\n`);
    } else if (result.error) {
      console.log(`❌ Error: ${file.replace('/Users/ai/Github/mcp-server-1/app/tools/ledger/', '')} - ${result.error}\n`);
    }
  }
  
  console.log(`\n🎯 Summary:`);
  console.log(`   📊 Total files processed: ${tsFiles.length}`);
  console.log(`   ✏️  Descriptions updated: ${updateCount}`);
  console.log(`   ✅ Files unchanged: ${tsFiles.length - updateCount}`);
  
  if (updateCount > 0) {
    console.log(`\n🔄 Run 'pnpm build' to verify all changes compile correctly.`);
  }
}

main().catch(console.error);