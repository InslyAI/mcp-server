import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerListPartnersToolClaimManagement } from './list-partners';
import { registerCreatePartnerToolClaimManagement } from './create-partner';
import { registerGetPartnerToolClaimManagement } from './get-partner';
import { registerUpdatePartnerToolClaimManagement } from './update-partner';
import { registerDeletePartnerToolClaimManagement } from './delete-partner';

export function registerPartnersTools(server: McpServer) {
  registerListPartnersToolClaimManagement(server);
  registerCreatePartnerToolClaimManagement(server);
  registerGetPartnerToolClaimManagement(server);
  registerUpdatePartnerToolClaimManagement(server);
  registerDeletePartnerToolClaimManagement(server);
}
