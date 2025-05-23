import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

const origin = process.argv[2] || "http://localhost:3002";

async function testMCPTools() {
  try {
    const transport = new SSEClientTransport(new URL(`${origin}/sse`));
    
    const client = new Client(
      {
        name: "formflow-test-client",
        version: "1.0.0",
      },
      {
        capabilities: {
          prompts: {},
          resources: {},
          tools: {},
        },
      }
    );

    console.log("🔌 Connecting to MCP server at", origin);
    await client.connect(transport);
    console.log("✅ Connected successfully!");

    console.log("🔍 Listing available tools...");
    const tools = await client.listTools();
    console.log("📋 Available tools:");
    
    tools.tools.forEach(tool => {
      console.log(`  - ${tool.name}: ${tool.description}`);
    });

    // Test if FormFlow tools are registered
    const formflowTools = tools.tools.filter(tool => tool.name.startsWith('formflow_'));
    console.log(`\n🎯 FormFlow tools found: ${formflowTools.length}/6`);
    
    if (formflowTools.length === 6) {
      console.log("✅ All FormFlow MCP tools are properly registered!");
    } else {
      console.log("⚠️  Some FormFlow tools may be missing");
    }

    client.close();
    console.log("🔚 Test completed");
    
  } catch (error) {
    console.error("❌ Error testing MCP tools:", error.message);
    process.exit(1);
  }
}

// Set timeout to prevent hanging
setTimeout(() => {
  console.log("⏰ Test timed out after 30 seconds");
  process.exit(1);
}, 30000);

testMCPTools();