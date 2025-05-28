import { registerGetActionsToolClaimManagement } from './get-actions';

export function registerAccessManagementTools(server: any) {
  registerGetActionsToolClaimManagement(server);
}