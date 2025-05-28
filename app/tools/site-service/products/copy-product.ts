import { createSiteServiceClient } from "../client";
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

const ProductCopySchema = z.object({
  source: z.string().min(1).describe("Source product name to copy from"),
  target: z.object({
    name: z.string().min(1).describe("Target product name"),
    title: z.string().min(1).describe("Target product title")
  }).describe("Target product configuration")
});

export function registerCopyProductTool(server: McpServer) {
  server.tool(
    "site_service_products_copy",
    "Copy existing product - copies existing product schemas, scheme features and product features to a new product",
    {
      bearerToken: z.string().min(1).describe("JWT bearer token from identifier_login"),
      tenantId: z.string().min(1).describe("Tenant identifier for API access"),
      tenantTag: z.string().min(1).describe("Tenant tag identifier"),
      source: z.string().min(1).describe("Source product name to copy from (e.g., 'old-product')"),
      targetName: z.string().min(1).describe("Target product name (e.g., 'new-product')"),
      targetTitle: z.string().min(1).describe("Target product title (e.g., 'New Product')")
    },
    async ({ bearerToken, tenantId, tenantTag, source, targetName, targetTitle }) => {
      try {
        const client = createSiteServiceClient(bearerToken, tenantId);
        const requestBody = {
          source,
          target: {
            name: targetName,
            title: targetTitle
          }
        };
        const data = await client.post(`/api/v1/sites/products/${tenantTag}/copy`, requestBody);
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({ 
              success: true, 
              data,
              message: `Copied product '${source}' to '${targetName}' (${targetTitle}) for tenant '${tenantTag}'`
            }, null, 2)
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: JSON.stringify({ 
              success: false, 
              error: error instanceof Error ? error.message : 'Unknown error',
              details: `Failed to copy product '${source}' to '${targetName}' for tenant '${tenantTag}'`
            }, null, 2)
          }]
        };
      }
    }
  );
}