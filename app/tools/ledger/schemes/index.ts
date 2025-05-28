/**
 * Scheme Management Tools Registration
 * Schema and UI schema management tools for products, policies, and features
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerGetFeatureSchemaTool } from './features/get-feature-schema';
import { registerGetFeatureUiSchemaTool } from './features/get-feature-ui-schema';
import { registerGetRegularSchemaTool } from './regular/get-regular-schema';
import { registerGetRenewalSchemaTool } from './regular/get-renewal-schema';
import { registerGetRenewalUiSchemaTool } from './regular/get-renewal-ui-schema';
import { registerGetMtaRenewalSchemaTool } from './mta-renewal/get-mta-renewal-schema';
import { registerGetMtaRenewalUiSchemaTool } from './mta-renewal/get-mta-renewal-ui-schema';
import { registerGetActionSchemaTool } from './actions/get-action-schema';
import { registerGetActionUiSchemaTool } from './actions/get-action-ui-schema';
import { registerGetSchemaProductsTool } from './regular/get-schema-products';
import { registerGetPolicyObjectTypesTool } from './policy/get-policy-object-types';
import { registerGetPolicyProductsTool } from './policy/get-policy-products';
import { registerGetPolicyInsurersTool } from './policy/get-policy-insurers';
import { registerGetPolicyTerminationSchemaTool } from './policy/get-policy-termination-schema';
import { registerGetPolicyTerminationUiSchemaTool } from './policy/get-policy-termination-ui-schema';

/**
 * Register all Scheme Management MCP tools
 * These tools handle JSON schemas, UI schemas, and product configuration
 */
export function registerSchemeTools(server: McpServer) {
  registerGetFeatureSchemaTool(server);
  registerGetFeatureUiSchemaTool(server);
  registerGetRegularSchemaTool(server);
  registerGetRenewalSchemaTool(server);
  registerGetRenewalUiSchemaTool(server);
  registerGetMtaRenewalSchemaTool(server);
  registerGetMtaRenewalUiSchemaTool(server);
  registerGetActionSchemaTool(server);
  registerGetActionUiSchemaTool(server);
  registerGetSchemaProductsTool(server);
  registerGetPolicyObjectTypesTool(server);
  registerGetPolicyProductsTool(server);
  registerGetPolicyInsurersTool(server);
  registerGetPolicyTerminationSchemaTool(server);
  registerGetPolicyTerminationUiSchemaTool(server);
}