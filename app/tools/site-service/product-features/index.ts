import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerGetProductFeaturesTool } from "./get-product-features";
import { registerGetProductFeaturesForSchemaTool } from "./get-product-features-for-schema";
import { registerSetProductFeaturesPutTool } from "./set-product-features-put";
import { registerSetProductFeaturesPostTool } from "./set-product-features-post";
import { registerGetProductsListTool } from "./get-products-list";
import { registerGetSpecificProductFeatureTool } from "./get-specific-product-feature";
import { registerUpdateSpecificProductFeatureTool } from "./update-specific-product-feature";

export function registerProductFeaturesTools(server: McpServer) {
  registerGetProductFeaturesTool(server);
  registerGetProductFeaturesForSchemaTool(server);
  registerSetProductFeaturesPutTool(server);
  registerSetProductFeaturesPostTool(server);
  registerGetProductsListTool(server);
  registerGetSpecificProductFeatureTool(server);
  registerUpdateSpecificProductFeatureTool(server);
}