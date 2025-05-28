#!/usr/bin/env node

import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

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

async function fixClientImports(filePath) {
  try {
    const content = await readFile(filePath, 'utf-8');
    
    // Check if file uses LedgerClient
    const usesLedgerClient = content.includes('import { LedgerClient }') || content.includes('new LedgerClient(');
    const usesCreateLedgerClient = content.includes('import { createLedgerClient }') || content.includes('createLedgerClient(');
    
    if (!usesLedgerClient && !usesCreateLedgerClient) {
      return { updated: false, reason: 'No client usage found' };
    }
    
    let updatedContent = content;
    let changes = [];
    
    // Standardize to use createLedgerClient pattern
    if (usesLedgerClient) {
      // Replace import statement
      updatedContent = updatedContent.replace(
        /import { LedgerClient } from ['"]([^'"]+)['"]/,
        'import { createLedgerClient } from "$1"'
      );
      changes.push('Updated import to use createLedgerClient');
      
      // Replace usage pattern
      updatedContent = updatedContent.replace(
        /const client = new LedgerClient\(([^)]+)\)/g,
        'const client = createLedgerClient($1)'
      );
      changes.push('Updated client instantiation');
    }
    
    if (content !== updatedContent) {
      await writeFile(filePath, updatedContent, 'utf-8');
      return {
        updated: true,
        file: filePath,
        changes: changes
      };
    }
    
    return { updated: false, reason: 'No changes needed' };
  } catch (error) {
    return { updated: false, error: error.message };
  }
}

async function main() {
  const ledgerDir = '/Users/ai/Github/mcp-server-1/app/tools/ledger';
  
  console.log('🔍 Finding all ledger tool files...');
  const tsFiles = await getAllTsFiles(ledgerDir);
  console.log(`📁 Found ${tsFiles.length} tool files to process\n`);
  
  let updateCount = 0;
  let errorCount = 0;
  
  for (const file of tsFiles) {
    const result = await fixClientImports(file);
    
    if (result.updated) {
      updateCount++;
      const shortPath = file.replace('/Users/ai/Github/mcp-server-1/app/tools/ledger/', '');
      console.log(`✅ Updated: ${shortPath}`);
      result.changes.forEach(change => console.log(`   - ${change}`));
      console.log('');
    } else if (result.error) {
      errorCount++;
      console.log(`❌ Error: ${file.replace('/Users/ai/Github/mcp-server-1/app/tools/ledger/', '')} - ${result.error}`);
    }
  }
  
  console.log(`\\n🎯 Summary:`);
  console.log(`   📊 Total files processed: ${tsFiles.length}`);
  console.log(`   ✏️  Client imports updated: ${updateCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log(`   ✅ Files unchanged: ${tsFiles.length - updateCount - errorCount}`);
  
  if (updateCount > 0) {
    console.log(`\\n🔄 Run 'pnpm build' to verify all changes compile correctly.`);
  }
}

main().catch(console.error);