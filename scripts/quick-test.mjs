import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

const origin = process.argv[2] || "http://localhost:3000";

async function main() {
  try {
    const transport = new SSEClientTransport(new URL(`${origin}/sse`));
    
    const client = new Client(
      {
        name: "quick-test-client",
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

    console.log("Connecting to", origin);
    await client.connect(transport);

    console.log("Connected! Server capabilities:", client.getServerCapabilities());

    const result = await client.listTools();
    console.log("Available tools:", result);
    
    // Test echo tool
    const echoResult = await client.callTool("echo", { message: "Hello from test!" });
    console.log("Echo test:", echoResult);
    
    // Test calculator tool
    const calcResult = await client.callTool("calculator", { operation: "add", a: 5, b: 3 });
    console.log("Calculator test:", calcResult);
    
    client.close();
    console.log("Test completed successfully!");
  } catch (error) {
    console.error("Test failed:", error.message);
    process.exit(1);
  }
}

// Set timeout to prevent hanging
setTimeout(() => {
  console.log("Test timed out after 30 seconds");
  process.exit(1);
}, 30000);

main();