import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerGetSchemeTool } from "./get-scheme";
import { registerCreateSchemeTool } from "./create-scheme";
import { registerGetSchemesListTool } from "./get-schemes-list";
import { registerGetSchemesByTypeTool } from "./get-schemes-by-type";
import { registerGetSchemeByVersionTool } from "./get-scheme-by-version";
import { registerGetUiSchemeByVersionTool } from "./get-ui-scheme-by-version";
import { registerUpdateUiSchemeTool } from "./update-ui-scheme";
import { registerGetLatestUiSchemeTool } from "./get-latest-ui-scheme";
import { registerGetSchemeVersionTool } from "./get-scheme-version";

export function registerSchemesTools(server: McpServer) {
  registerGetSchemeTool(server);
  registerCreateSchemeTool(server);
  registerGetSchemesListTool(server);
  registerGetSchemesByTypeTool(server);
  registerGetSchemeByVersionTool(server);
  registerGetUiSchemeByVersionTool(server);
  registerUpdateUiSchemeTool(server);
  registerGetLatestUiSchemeTool(server);
  registerGetSchemeVersionTool(server);
}