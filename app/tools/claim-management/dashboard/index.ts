import { registerMyClaimsOpenToolClaimManagement } from './my-claims-open';
import { registerMyClaimsAlarmedToolClaimManagement } from './my-claims-alarmed';
import { registerMyClaimsInactiveToolClaimManagement } from './my-claims-inactive';

export function registerDashboardTools(server: any) {
  registerMyClaimsOpenToolClaimManagement(server);
  registerMyClaimsAlarmedToolClaimManagement(server);
  registerMyClaimsInactiveToolClaimManagement(server);
}

// Note: Additional dashboard tools to be implemented:
// - my-claims-recent
// - claims-unassigned  
// - my-tasks-assigned
// - my-tasks-created