import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerFeaturesTools } from "./features";
import { registerClaimFeaturesTools } from "./claim-features";
import { registerExcelCalculatorTools } from "./excel-calculator";
import { registerProductsTools } from "./products";
import { registerProductFeaturesTools } from "./product-features";
import { registerSchemesTools } from "./schemes";
import { registerSchemeFeaturesTools } from "./scheme-features";
import { registerStaticDocumentsTools } from "./static-documents";

export function registerSiteServiceTools(server: McpServer) {
  registerFeaturesTools(server);
  registerClaimFeaturesTools(server);
  registerExcelCalculatorTools(server);
  registerProductsTools(server);
  registerProductFeaturesTools(server);
  registerSchemesTools(server);
  registerSchemeFeaturesTools(server);
  registerStaticDocumentsTools(server);
}