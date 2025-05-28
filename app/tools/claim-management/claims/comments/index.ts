import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerListCommentsToolClaimManagement } from './list-comments';
import { registerCreateCommentToolClaimManagement } from './create-comment';
import { registerUpdateCommentToolClaimManagement } from './update-comment';
import { registerDeleteCommentToolClaimManagement } from './delete-comment';

export function registerCommentsTools(server: McpServer) {
  registerListCommentsToolClaimManagement(server);
  registerCreateCommentToolClaimManagement(server);
  registerUpdateCommentToolClaimManagement(server);
  registerDeleteCommentToolClaimManagement(server);
}