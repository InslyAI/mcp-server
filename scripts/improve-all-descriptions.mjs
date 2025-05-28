#!/usr/bin/env node

import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

// Comprehensive description improvements based on MCP best practices
const descriptionPatterns = [
  // Pattern-based improvements (remove redundant prefixes)
  {
    pattern: /^This tool allows you to /i,
    replacement: ''
  },
  {
    pattern: /^Use this to /i,
    replacement: ''
  },
  {
    pattern: /^Use this tool to /i,
    replacement: ''
  },
  
  // Business context improvements
  {
    old: /^Get\s+(.+)\s+information/i,
    new: (match, p1) => `Retrieve ${p1} details`
  },
  {
    old: /^Create\s+(.+)\s+with\s+(.+)/i,
    new: (match, p1, p2) => `Create ${p1} using ${p2}`
  },
  {
    old: /^List\s+(.+)\s+with\s+(.+)/i,
    new: (match, p1, p2) => `List ${p1} with ${p2}`
  },
  
  // Specific improvements for common patterns
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
  },
  {
    old: 'Get comprehensive customer data including personal details, address, and insurance history',
    new: 'Retrieve comprehensive customer profile including personal details, contact information, policy history, and risk profile'
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
    old: 'Get detailed information about a specific binder including its configuration and terms',
    new: 'Retrieve binder details including coverage terms, pricing structure, and binding authority limits'
  },
  {
    old: 'Generate a quote document of a specific type. The document is generated based on the quote data and returns binary content',
    new: 'Generate quote documents (proposals, summaries, comparisons) in PDF/Word format for client presentation'
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
    old: 'Get dashboard data for policies that are eligible for renewal and don\'t have renewed policies issued yet',
    new: 'Retrieve renewal pipeline dashboard showing policies expiring within specified timeframe for campaign management'
  },
  
  // Schema tool improvements
  {
    old: /^Get JSON schema for (.+)$/i,
    new: (match, p1) => `Retrieve JSON schema definitions for ${p1} validation and form configuration`
  },
  {
    old: /^Get (.+) schema$/i,
    new: (match, p1) => `Retrieve ${p1} schema definitions for validation and integration`
  },
  
  // Document generation improvements
  {
    old: /^Generate (.+) document/i,
    new: (match, p1) => `Generate ${p1} documents in PDF/Word format for delivery and compliance`
  },
  
  // CRUD operation improvements
  {
    old: /^Create new (.+)$/i,
    new: (match, p1) => `Create new ${p1} with complete business details and validation`
  },
  {
    old: /^Update (.+) with (.+)$/i,
    new: (match, p1, p2) => `Update ${p1} using ${p2} for accurate record management`
  },
  {
    old: /^Delete (.+)$/i,
    new: (match, p1) => `Delete ${p1} with proper validation and audit trail`
  },
  
  // Payment and financial improvements
  {
    old: /payment(.+)including commissions/i,
    new: (match) => match.replace('including commissions', 'including commission calculations, tax breakdowns, and payment schedules')
  },
  
  // Search and filtering improvements
  {
    old: /with filtering and search options$/i,
    new: 'with advanced filtering, search capabilities, and sorting options'
  },
  {
    old: /with filtering options$/i,
    new: 'with filtering by status, type, and business criteria'
  }
];

async function getAllTsFiles(dir, files = []) {
  const items = await readdir(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = join(dir, item.name);
    
    if (item.isDirectory()) {
      await getAllTsFiles(fullPath, files);
    } else if (item.isFile() && item.name.endsWith('.ts') && !item.name.includes('index.ts') && !item.name.includes('client.ts') && !item.name.includes('types.ts')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

function improveDescription(description) {
  let improved = description;
  
  // Apply pattern-based improvements
  for (const pattern of descriptionPatterns) {
    if (pattern.pattern) {
      improved = improved.replace(pattern.pattern, pattern.replacement);
    } else if (pattern.old && pattern.new) {
      if (typeof pattern.old === 'string') {
        if (improved === pattern.old) {
          improved = pattern.new;
        }
      } else if (pattern.old instanceof RegExp) {
        if (pattern.old.test(improved)) {
          if (typeof pattern.new === 'function') {
            improved = improved.replace(pattern.old, pattern.new);
          } else {
            improved = improved.replace(pattern.old, pattern.new);
          }
        }
      }
    }
  }
  
  // Capitalize first letter
  improved = improved.charAt(0).toUpperCase() + improved.slice(1);
  
  // Remove extra spaces
  improved = improved.replace(/\s+/g, ' ').trim();
  
  return improved;
}

async function processFile(filePath) {
  try {
    const content = await readFile(filePath, 'utf-8');
    
    // Extract current description from server.tool() call
    const descriptionMatch = content.match(/server\.tool\(\s*['"`][^'"`]+['"`],\s*['"`]([^'"`]+)['"`]/);
    if (!descriptionMatch) {
      return { updated: false, reason: 'No description found' };
    }
    
    const originalDescription = descriptionMatch[1];
    const improvedDescription = improveDescription(originalDescription);
    
    if (originalDescription !== improvedDescription) {
      // Replace the description in the file
      const updatedContent = content.replace(
        /server\.tool\(\s*(['"`])([^'"`]+)\1,\s*(['"`])[^'"`]+\3/,
        `server.tool(\n    $1$2$1,\n    $3${improvedDescription}$3`
      );
      
      await writeFile(filePath, updatedContent, 'utf-8');
      
      return {
        updated: true,
        file: filePath,
        old: originalDescription,
        new: improvedDescription
      };
    }
    
    return { updated: false, reason: 'No improvement needed' };
  } catch (error) {
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
  let noDescriptionCount = 0;
  let errorCount = 0;
  
  for (const file of tsFiles) {
    const result = await processFile(file);
    
    if (result.updated) {
      updateCount++;
      results.push(result);
      const shortPath = file.replace('/Users/ai/Github/mcp-server-1/app/tools/ledger/', '');
      console.log(`✅ Updated: ${shortPath}`);
      console.log(`   Old: "${result.old}"`);
      console.log(`   New: "${result.new}"\n`);
    } else if (result.error) {
      errorCount++;
      console.log(`❌ Error: ${file.replace('/Users/ai/Github/mcp-server-1/app/tools/ledger/', '')} - ${result.error}\n`);
    } else if (result.reason === 'No description found') {
      noDescriptionCount++;
      console.log(`⚠️  No description: ${file.replace('/Users/ai/Github/mcp-server-1/app/tools/ledger/', '')}`);
    }
  }
  
  console.log(`\n🎯 Summary:`);
  console.log(`   📊 Total files processed: ${tsFiles.length}`);
  console.log(`   ✏️  Descriptions updated: ${updateCount}`);
  console.log(`   ⚠️  No descriptions found: ${noDescriptionCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log(`   ✅ Files unchanged: ${tsFiles.length - updateCount - noDescriptionCount - errorCount}`);
  
  if (updateCount > 0) {
    console.log(`\n🔄 Run 'pnpm build' to verify all changes compile correctly.`);
  }
}

main().catch(console.error);