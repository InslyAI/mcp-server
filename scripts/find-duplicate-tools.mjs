#!/usr/bin/env node

import { readdir, readFile } from 'fs/promises';
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

async function extractToolNames(filePath) {
  try {
    const content = await readFile(filePath, 'utf-8');
    const toolNameMatch = content.match(/server\.tool\(\s*['"`]([^'"`]+)['"`]/);
    if (toolNameMatch) {
      return { file: filePath, toolName: toolNameMatch[1] };
    }
  } catch (error) {
    console.error(`Error reading ${filePath}: ${error.message}`);
  }
  return null;
}

async function main() {
  const ledgerDir = '/Users/ai/Github/mcp-server-1/app/tools/ledger';
  
  console.log('🔍 Finding all tool names...');
  const tsFiles = await getAllTsFiles(ledgerDir);
  console.log(`📁 Found ${tsFiles.length} tool files\n`);
  
  const toolNames = new Map(); // toolName -> array of files
  
  for (const file of tsFiles) {
    const result = await extractToolNames(file);
    if (result) {
      if (!toolNames.has(result.toolName)) {
        toolNames.set(result.toolName, []);
      }
      toolNames.get(result.toolName).push(result.file.replace('/Users/ai/Github/mcp-server-1/app/tools/ledger/', ''));
    }
  }
  
  console.log('🔍 Checking for duplicates...\n');
  
  let duplicatesFound = false;
  for (const [toolName, files] of toolNames.entries()) {
    if (files.length > 1) {
      duplicatesFound = true;
      console.log(`❌ DUPLICATE: "${toolName}" used in ${files.length} files:`);
      files.forEach(file => console.log(`   - ${file}`));
      console.log('');
    }
  }
  
  if (!duplicatesFound) {
    console.log('✅ No duplicate tool names found!');
  }
  
  console.log(`\n📊 Total unique tool names: ${toolNames.size}`);
  console.log(`📊 Total tool files: ${tsFiles.length}`);
}

main().catch(console.error);