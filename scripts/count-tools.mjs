#!/usr/bin/env node

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

async function countTools(endpoint) {
  try {
    console.log(`🔌 Connecting to ${endpoint}`);
    
    const transport = new SSEClientTransport(new URL(endpoint));
    const client = new Client({
      name: "tool-counter",
      version: "1.0.0",
    }, {
      capabilities: {}
    });

    await client.connect(transport);
    
    // List all tools
    const result = await client.listTools();
    const toolCount = result.tools.length;
    
    console.log(`✅ ${endpoint}: ${toolCount} tools`);
    
    await client.close();
    return toolCount;
    
  } catch (error) {
    console.log(`❌ ${endpoint}: Error - ${error.message}`);
    return 0;
  }
}

async function main() {
  const baseUrl = process.argv[2] || "http://localhost:3000";
  
  console.log("🧮 Counting MCP tools across all endpoints...\n");
  
  // Test all endpoints
  const endpoints = [
    `${baseUrl}/sse`,
    `${baseUrl}/formflow/sse`, 
    `${baseUrl}/identifier/sse`,
    `${baseUrl}/ledger/sse`
  ];
  
  const results = [];
  for (const endpoint of endpoints) {
    const count = await countTools(endpoint);
    results.push({ endpoint, count });
  }
  
  console.log("\n📊 Summary:");
  console.log("==================");
  results.forEach(({ endpoint, count }) => {
    const name = endpoint.includes('/formflow/') ? 'FormFlow' :
                 endpoint.includes('/identifier/') ? 'Identifier' :
                 endpoint.includes('/ledger/') ? 'Ledger' : 'Unified';
    console.log(`${name.padEnd(12)}: ${count} tools`);
  });
  
  const totalUnified = results.find(r => !r.endpoint.includes('/formflow/') && 
                                          !r.endpoint.includes('/identifier/') && 
                                          !r.endpoint.includes('/ledger/'))?.count || 0;
  
  console.log(`\n🎯 Total unified tools: ${totalUnified}`);
}

main().catch(console.error);