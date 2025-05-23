import { z } from "zod";
import type { McpServer } from "@vercel/mcp-adapter";

export function registerCalculatorTool(server: McpServer) {
  server.tool(
    "calculator",
    "Perform basic mathematical calculations",
    { 
      operation: z.enum(["add", "subtract", "multiply", "divide"]),
      a: z.number(),
      b: z.number()
    },
    async ({ operation, a, b }) => {
      let result: number;
      
      switch (operation) {
        case "add":
          result = a + b;
          break;
        case "subtract":
          result = a - b;
          break;
        case "multiply":
          result = a * b;
          break;
        case "divide":
          if (b === 0) {
            return {
              content: [{ type: "text", text: "Error: Division by zero is not allowed" }],
            };
          }
          result = a / b;
          break;
      }
      
      return {
        content: [{ 
          type: "text", 
          text: `Calculator result: ${a} ${operation} ${b} = ${result}` 
        }],
      };
    }
  );
}