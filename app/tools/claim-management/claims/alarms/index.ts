import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerListAlarmsToolClaimManagement } from './list-alarms';
import { registerUpdateAlarmToolClaimManagement } from './update-alarm';
import { registerPollUnnotedAlarmsToolClaimManagement } from './poll-unnoted-alarms';

export function registerAlarmsTools(server: McpServer) {
  registerListAlarmsToolClaimManagement(server);
  registerUpdateAlarmToolClaimManagement(server);
  registerPollUnnotedAlarmsToolClaimManagement(server);
}