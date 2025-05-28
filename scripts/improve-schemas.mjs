#!/usr/bin/env node

import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

// Schema improvements to apply across all tools
const schemaImprovements = [
  // Date validation
  {
    pattern: /z\.string\(\)\.describe\("([^"]*date[^"]*\(YYYY-MM-DD[^"]*)"\)/gi,
    replacement: 'z.string().regex(/^\\d{4}-\\d{2}-\\d{2}$/).describe("$1")'
  },
  {
    pattern: /z\.string\(\)\.describe\("([^"]*[Dd]ate in YYYY-MM-DD format[^"]*)"\)/gi,
    replacement: 'z.string().regex(/^\\d{4}-\\d{2}-\\d{2}$/).describe("$1")'
  },
  
  // Datetime validation
  {
    pattern: /z\.string\(\)\.describe\("([^"]*ISO[^"]*format[^"]*)"\)/gi,
    replacement: 'z.string().datetime().describe("$1")'
  },
  
  // Email validation improvements (if not already .email())
  {
    pattern: /z\.string\(\)\.optional\(\)\.describe\("([^"]*email address[^"]*)"\)/gi,
    replacement: 'z.string().email().optional().describe("$1")'
  },
  {
    pattern: /z\.string\(\)\.describe\("([^"]*email address[^"]*)"\)/gi,
    replacement: 'z.string().email().describe("$1")'
  },
  
  // Phone number validation
  {
    pattern: /z\.string\(\)\.optional\(\)\.describe\("([^"]*phone number[^"]*)"\)/gi,
    replacement: 'z.string().regex(/^[\\+]?[0-9\\s\\-\\(\\)]{7,15}$/).optional().describe("$1 (international format)")'
  },
  {
    pattern: /z\.string\(\)\.describe\("([^"]*phone number[^"]*)"\)/gi,
    replacement: 'z.string().regex(/^[\\+]?[0-9\\s\\-\\(\\)]{7,15}$/).describe("$1 (international format)")'
  },
  
  // Positive integer validation for IDs
  {
    pattern: /z\.number\(\)\.describe\("([^"]*[Ii][Dd][^"]*)"\)/gi,
    replacement: 'z.number().int().positive().describe("$1")'
  },
  {
    pattern: /z\.string\(\)\.describe\("([^"]*[Ii][Dd] of[^"]*)"\)/gi,
    replacement: 'z.string().min(1).describe("$1")'
  },
  {
    pattern: /z\.string\(\)\.describe\("([^"]*identifier[^"]*)"\)/gi,
    replacement: 'z.string().min(1).describe("$1")'
  },
  
  // Pagination limits
  {
    pattern: /z\.number\(\)\.optional\(\)\.describe\("([^"]*limit[^"]*results[^"]*)"\)/gi,
    replacement: 'z.number().int().min(1).max(1000).optional().describe("$1 (1-1000)")'
  },
  {
    pattern: /z\.number\(\)\.optional\(\)\.describe\("([^"]*per page[^"]*)"\)/gi,
    replacement: 'z.number().int().min(1).max(1000).optional().describe("$1 (1-1000)")'
  },
  {
    pattern: /z\.number\(\)\.optional\(\)\.describe\("([^"]*page number[^"]*)"\)/gi,
    replacement: 'z.number().int().min(1).optional().describe("$1 (starting from 1)")'
  },
  
  // Amount/currency validation
  {
    pattern: /z\.number\(\)\.describe\("([^"]*amount[^"]*)"\)/gi,
    replacement: 'z.number().positive().describe("$1")'
  },
  {
    pattern: /z\.number\(\)\.optional\(\)\.describe\("([^"]*amount[^"]*)"\)/gi,
    replacement: 'z.number().positive().optional().describe("$1")'
  },
  {
    pattern: /z\.string\(\)\.describe\("([^"]*currency code[^"]*)"\)/gi,
    replacement: 'z.string().length(3).regex(/^[A-Z]{3}$/).describe("$1 (ISO 4217, e.g., EUR, USD)")'
  },
  
  // Percentage validation
  {
    pattern: /z\.number\(\)\.describe\("([^"]*percentage[^"]*)"\)/gi,
    replacement: 'z.number().min(0).max(100).describe("$1 (0-100)")'
  },
  
  // String length validation for names
  {
    pattern: /z\.string\(\)\.optional\(\)\.describe\("([^"]*first name[^"]*)"\)/gi,
    replacement: 'z.string().min(1).max(100).optional().describe("$1 (1-100 characters)")'
  },
  {
    pattern: /z\.string\(\)\.optional\(\)\.describe\("([^"]*last name[^"]*)"\)/gi,
    replacement: 'z.string().min(1).max(100).optional().describe("$1 (1-100 characters)")'
  },
  {
    pattern: /z\.string\(\)\.optional\(\)\.describe\("([^"]*company name[^"]*)"\)/gi,
    replacement: 'z.string().min(1).max(200).optional().describe("$1 (1-200 characters)")'
  },
  
  // URL validation
  {
    pattern: /z\.string\(\)\.describe\("([^"]*[Uu][Rr][Ll][^"]*)"\)/gi,
    replacement: 'z.string().url().describe("$1")'
  },
  {
    pattern: /z\.string\(\)\.optional\(\)\.describe\("([^"]*[Uu][Rr][Ll][^"]*)"\)/gi,
    replacement: 'z.string().url().optional().describe("$1")'
  },
  
  // Boolean descriptions enhancement
  {
    pattern: /z\.boolean\(\)\.describe\("([^"]*[Ww]hether[^"]*)"\)/gi,
    replacement: 'z.boolean().default(false).describe("$1")'
  },
  
  // Replace overly permissive z.any() with better types
  {
    pattern: /z\.any\(\)\.describe\("([^"]*filter[^"]*)"\)/gi,
    replacement: 'z.union([z.string(), z.number(), z.boolean(), z.array(z.string())]).describe("$1 (string, number, boolean, or string array)")'
  },
  {
    pattern: /z\.record\(z\.any\(\)\)\.describe\("([^"]*filter[^"]*)"\)/gi,
    replacement: 'z.record(z.union([z.string(), z.number(), z.boolean(), z.array(z.string())])).describe("$1 (values can be strings, numbers, booleans, or string arrays)")'
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

function improveSchemas(content) {
  let improved = content;
  let changesApplied = [];
  
  for (const improvement of schemaImprovements) {
    const before = improved;
    improved = improved.replace(improvement.pattern, improvement.replacement);
    
    if (before !== improved) {
      changesApplied.push({
        pattern: improvement.pattern.source || improvement.pattern.toString(),
        applied: true
      });
    }
  }
  
  return { improved, changesApplied };
}

async function processFile(filePath) {
  try {
    const content = await readFile(filePath, 'utf-8');
    
    // Skip files that don't contain zod schemas
    if (!content.includes('z.') || !content.includes('.describe(')) {
      return { updated: false, reason: 'No Zod schemas found' };
    }
    
    const { improved, changesApplied } = improveSchemas(content);
    
    if (content !== improved && changesApplied.length > 0) {
      await writeFile(filePath, improved, 'utf-8');
      
      return {
        updated: true,
        file: filePath,
        changesCount: changesApplied.length,
        changes: changesApplied
      };
    }
    
    return { updated: false, reason: 'No improvements needed' };
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
  let totalChanges = 0;
  let noSchemaCount = 0;
  let errorCount = 0;
  
  for (const file of tsFiles) {
    const result = await processFile(file);
    
    if (result.updated) {
      updateCount++;
      totalChanges += result.changesCount;
      results.push(result);
      const shortPath = file.replace('/Users/ai/Github/mcp-server-1/app/tools/ledger/', '');
      console.log(`✅ Updated: ${shortPath} (${result.changesCount} improvements)`);
    } else if (result.error) {
      errorCount++;
      console.log(`❌ Error: ${file.replace('/Users/ai/Github/mcp-server-1/app/tools/ledger/', '')} - ${result.error}`);
    } else if (result.reason === 'No Zod schemas found') {
      noSchemaCount++;
    }
  }
  
  console.log(`\\n🎯 Summary:`);
  console.log(`   📊 Total files processed: ${tsFiles.length}`);
  console.log(`   ✏️  Schema files updated: ${updateCount}`);
  console.log(`   🔧 Total schema improvements: ${totalChanges}`);
  console.log(`   ⚠️  No schemas found: ${noSchemaCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log(`   ✅ Files unchanged: ${tsFiles.length - updateCount - noSchemaCount - errorCount}`);
  
  if (updateCount > 0) {
    console.log(`\\n🔄 Run 'pnpm build' to verify all schema changes compile correctly.`);
    console.log(`\\n📝 Schema improvements applied:`);
    console.log(`   ✓ Date format validation (YYYY-MM-DD)`);
    console.log(`   ✓ Email format validation`);
    console.log(`   ✓ Phone number format validation`);
    console.log(`   ✓ ID and identifier validation`);
    console.log(`   ✓ Pagination limits (1-1000)`);
    console.log(`   ✓ Amount and percentage validation`);
    console.log(`   ✓ String length constraints`);
    console.log(`   ✓ URL format validation`);
    console.log(`   ✓ Better type unions for filters`);
  }
}

main().catch(console.error);