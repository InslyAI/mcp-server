#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to ledger tools directory
const ledgerToolsDir = path.join(__dirname, '..', 'app', 'tools', 'ledger');

function extractToolsFromFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const tools = [];
  
  // Look for server.tool() calls with tool name and description
  const toolRegex = /server\.tool\(\s*["']([^"']+)["'],\s*["']([^"']+)["']/g;
  
  let match;
  while ((match = toolRegex.exec(content)) !== null) {
    const [, name, description] = match;
    tools.push({ name, description });
  }
  
  return tools;
}

function scanDirectory(dir) {
  const allTools = [];
  
  function scanRecursive(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      
      if (entry.isDirectory()) {
        scanRecursive(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.ts') && entry.name !== 'index.ts') {
        try {
          const tools = extractToolsFromFile(fullPath);
          allTools.push(...tools);
        } catch (error) {
          console.error(`Error processing ${fullPath}:`, error.message);
        }
      }
    }
  }
  
  scanRecursive(dir);
  return allTools;
}

// Extract all tools
const tools = scanDirectory(ledgerToolsDir);

console.log(`Found ${tools.length} tools:`);
console.log('\n// Tools object for capabilities:');
console.log('tools: {');

tools.forEach(tool => {
  console.log(`  ${tool.name}: {`);
  console.log(`    description: "${tool.description}",`);
  console.log(`  },`);
});

console.log('}');

console.log(`\n\n// Summary: ${tools.length} total tools found`);
tools.forEach(tool => {
  console.log(`// ${tool.name}: ${tool.description}`);
});