import { registerListObjectsToolClaimManagement } from './list-objects';
import { registerListPersonsToolClaimManagement } from './list-persons';

export function registerEntitiesTools(server: any) {
  registerListObjectsToolClaimManagement(server);
  registerListPersonsToolClaimManagement(server);
}

// Note: Additional entity list tools to be implemented:
// - list-reserves
// - list-decisions
// - list-payment-decisions
// - list-open-major-events
// - list-active-users