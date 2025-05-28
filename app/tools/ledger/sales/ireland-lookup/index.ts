/**
 * Sales Ireland Lookup Tools Registration
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { registerIrelandAddressLookupTool, registerIrelandPostcodeLookupTool } from "./ireland-address-lookup";

export function registerLookupServicesTools(server: McpServer) {
  registerIrelandAddressLookupTool(server);
  registerIrelandPostcodeLookupTool(server);
}