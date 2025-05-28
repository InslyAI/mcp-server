import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerGetClaimFeaturesTool } from "./get-claim-features";
import { registerSaveClaimFeaturesTool } from "./save-claim-features";
import { registerGetClaimFeatureTool } from "./get-claim-feature";
import { registerSetClaimFeatureTool } from "./set-claim-feature";

export function registerClaimFeaturesTools(server: McpServer) {
  registerGetClaimFeaturesTool(server);
  registerSaveClaimFeaturesTool(server);
  registerGetClaimFeatureTool(server);
  registerSetClaimFeatureTool(server);
}