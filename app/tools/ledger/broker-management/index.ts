/**
 * Broker Management Tools Registration
 * Broker consolidation and administrative tools
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerMergeBrokersTool } from './merge-brokers';
import { registerGetBrokerPoliciesCountTool } from './get-broker-policies-count';
import { registerGetBrokerShortNamesTool } from './get-broker-short-names';

export function registerBrokerManagementTools(server: McpServer) {
  registerMergeBrokersTool(server);
  registerGetBrokerPoliciesCountTool(server);
  registerGetBrokerShortNamesTool(server);
}