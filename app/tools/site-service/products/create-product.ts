import { createSiteServiceClient } from "../client";
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

const ProductCreateSchema = z.object({
  name: z.string().min(1).describe("New product name (e.g., 'product-name')"),
  title: z.string().min(1).describe("New product title (e.g., 'Product Title')")
});

export function registerCreateProductTool(server: McpServer) {
  server.tool(
    "site_service_products_create",
    "Create a new product - creates stubs for product schemas, schema features and product features",
    {
      bearerToken: z.string().min(1).describe("JWT bearer token from identifier_login"),
      tenantId: z.string().min(1).describe("Tenant identifier for API access"),
      tenantTag: z.string().min(1).describe("Tenant tag identifier"),
      name: z.string().min(1).describe("New product name (e.g., 'product-name')"),
      title: z.string().min(1).describe("New product title (e.g., 'Product Title')")
    },
    async ({ bearerToken, tenantId, tenantTag, name, title }) => {
      try {
        const client = createSiteServiceClient(bearerToken, tenantId);
        const requestBody = { name, title };
        const data = await client.post(`/api/v1/sites/products/${tenantTag}`, requestBody);
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({ 
              success: true, 
              data,
              message: `Created product '${name}' (${title}) for tenant '${tenantTag}'`
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
              details: `Failed to create product '${name}' for tenant '${tenantTag}'`
            }, null, 2)
          }]
        };
      }
    }
  );
}